const https = require('https');

const bucket = 'fir-rlos.appspot.com';
const path = 'faces/test3.jpg';
const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(path)}`;

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
