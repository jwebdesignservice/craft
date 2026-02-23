// Gmail IMAP checker for OpenClaw
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

// Load last checked state
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  } catch {
    return { lastUID: 0, lastCheck: null };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// IMAP connection
const imap = new Imap({
  user: env.GMAIL_USER,
  password: env.GMAIL_APP_PASSWORD,
  host: env.GMAIL_IMAP_HOST,
  port: parseInt(env.GMAIL_IMAP_PORT),
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

function checkEmail() {
  return new Promise((resolve, reject) => {
    const state = loadState();
    const newEmails = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) return reject(err);

        const searchCriteria = state.lastUID > 0 
          ? [['UID', `${state.lastUID + 1}:*`], 'UNSEEN']
          : ['UNSEEN'];

        imap.search(searchCriteria, (err, results) => {
          if (err) return reject(err);
          if (!results || results.length === 0) {
            imap.end();
            return resolve({ count: 0, emails: [] });
          }

          const fetch = imap.fetch(results, { bodies: '' });
          let processed = 0;

          fetch.on('message', (msg, seqno) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) return;
                newEmails.push({
                  uid: seqno,
                  from: parsed.from?.text || 'Unknown',
                  subject: parsed.subject || '(no subject)',
                  snippet: (parsed.text || '').substring(0, 200).replace(/\n/g, ' '),
                  date: parsed.date
                });
              });
            });
          });

          fetch.once('end', () => {
            const maxUID = Math.max(...results, state.lastUID);
            saveState({ lastUID: maxUID, lastCheck: new Date().toISOString() });
            imap.end();
            resolve({ count: newEmails.length, emails: newEmails });
          });
        });
      });
    });

    imap.once('error', reject);
    imap.connect();
  });
}

// Run check
checkEmail()
  .then(result => {
    if (result.count > 0) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('GMAIL_NO_NEW');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('GMAIL_ERROR:', err.message);
    process.exit(1);
  });
