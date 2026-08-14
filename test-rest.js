const https = require('https');

const bucket = 'fir-rlos.firebasestorage.app';
const path = 'faces/test.jpg';
const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${encodeURIComponent(path)}`;

const req = https.request(uploadUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'image/jpeg',
    'Content-Length': 4
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data));
});
req.write('test');
req.end();
