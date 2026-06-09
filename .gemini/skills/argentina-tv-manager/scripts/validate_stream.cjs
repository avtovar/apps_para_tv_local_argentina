/* eslint-disable @typescript-eslint/no-require-imports */

const https = require('https');
const http = require('http');

async function validateStream(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ valid: true, status: res.statusCode });
      } else {
        resolve({ valid: false, status: res.statusCode });
      }
    });

    req.on('error', (e) => {
      resolve({ valid: false, error: e.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ valid: false, error: 'Timeout' });
    });
  });
}

const url = process.argv[2];
if (!url) {
  console.log('Error: No URL provided');
  process.exit(1);
}

validateStream(url).then((result) => {
  if (result.valid) {
    console.log(`✅ Valid stream: ${url} (Status: ${result.status})`);
  } else {
    console.log(`❌ Invalid stream: ${url} (Error: ${result.error || result.status})`);
    process.exit(1);
  }
});
