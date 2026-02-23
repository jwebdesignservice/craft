// Gmail IMAP monitor for OpenClaw - all non-spam emails
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');

// Load credentials
const envPath = path.join(__dirname, '.env.gmail');
const env = {};
fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const STATE_FILE = path.join(__dirname, '.gmail-state.json');

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  } catch {
    const now = new Date().toISOString();
    const s = { lastCheckISO: now, seenIds: [] };
    saveState(s);
    return s;
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

const imap = new Imap({
  user: env.GMAIL_USER,
  password: env.GMAIL_APP_PASSWORD,
  host: env.GMAIL_IMAP_HOST,
  port: parseInt(env.GMAIL_IMAP_PORT),
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  connTimeout: 15000,
  authTimeout: 15000
});

function checkEmail() {
  return new Promise((resolve, reject) => {
    const state = loadState();
    const sinceDate = new Date(state.lastCheckISO);
    const seenIds = state.seenIds || [];
    const newEmails = [];

    let timeout = setTimeout(() => {
      try { imap.end(); } catch(e) {}
      reject(new Error('Timeout'));
    }, 20000);

    imap.once('ready', () => {
      // Only check INBOX — Gmail's IMAP keeps spam in [Gmail]/Spam, not INBOX
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          clearTimeout(timeout);
          try { imap.end(); } catch(e) {}
          return reject(err);
        }

        // All emails since last check (no UNSEEN filter — catch everything)
        imap.search([['SINCE', sinceDate]], (err, results) => {
          if (err) {
            clearTimeout(timeout);
            try { imap.end(); } catch(e) {}
            return reject(err);
          }

          if (!results || results.length === 0) {
            clearTimeout(timeout);
            saveState({ lastCheckISO: new Date().toISOString(), seenIds: seenIds.slice(-200) });
            try { imap.end(); } catch(e) {}
            return resolve({ count: 0, emails: [] });
          }

          // Filter out already-seen IDs
          const toFetch = results.filter(id => !seenIds.includes(id));

          if (toFetch.length === 0) {
            clearTimeout(timeout);
            saveState({ lastCheckISO: new Date().toISOString(), seenIds: seenIds.slice(-200) });
            try { imap.end(); } catch(e) {}
            return resolve({ count: 0, emails: [] });
          }

          const fetch = imap.fetch(toFetch, { bodies: '' });

          fetch.on('message', (msg, seqno) => {
            let msgSeqno = seqno;
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (!err) {
                  newEmails.push({
                    id: msgSeqno,
                    from: parsed.from?.text || 'Unknown',
                    subject: parsed.subject || '(no subject)',
                    snippet: (parsed.text || '').substring(0, 200).replace(/\n/g, ' ').trim(),
                    date: parsed.date ? parsed.date.toISOString() : new Date().toISOString(),
                    read: false
                  });
                }
              });
            });
          });

          fetch.once('error', (err) => {
            clearTimeout(timeout);
            try { imap.end(); } catch(e) {}
            reject(err);
          });

          fetch.once('end', () => {
            clearTimeout(timeout);
            setTimeout(() => {
              const newSeenIds = [...seenIds, ...toFetch].slice(-200);
              saveState({ lastCheckISO: new Date().toISOString(), seenIds: newSeenIds });
              try { imap.end(); } catch(e) {}
              resolve({ count: newEmails.length, emails: newEmails });
            }, 500);
          });
        });
      });
    });

    imap.once('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    imap.connect();
  });
}

// Run check
checkEmail()
  .then(result => {
    if (result.count > 0) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('NO_NEW_EMAILS');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR:', err.message);
    process.exit(1);
  });
