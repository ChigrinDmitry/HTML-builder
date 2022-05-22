const path = require('path');
const fs = require('fs');

const readableStream = fs.createReadStream(path.join('01-read-file', 'text.txt'), 'utf-8');

let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => console.log(data));