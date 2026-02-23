const Imap = require('imap');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.gmail');
const env = {};
fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

console.log('Testing Gmail IMAP connection...');
console.log('User:', env.GMAIL_USER);

const imap = new Imap({
  user: env.GMAIL_USER,
  password: env.GMAIL_APP_PASSWORD,
  host: env.GMAIL_IMAP_HOST,
  port: parseInt(env.GMAIL_IMAP_PORT),
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  connTimeout: 10000,
  authTimeout: 10000
});

imap.once('ready', () => {
  console.log('✅ IMAP connection successful!');
  imap.end();
  process.exit(0);
});

imap.once('error', (err) => {
  console.error('❌ IMAP connection failed:', err.message);
  process.exit(1);
});

imap.once('end', () => {
  console.log('Connection ended');
});

console.log('Connecting...');
imap.connect();
