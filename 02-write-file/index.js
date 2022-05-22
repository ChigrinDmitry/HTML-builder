const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const {stdin, stdout } = process;

stdout.write('Hello, please enter your text here\n');

stdin.on('data', chunk => {
    if (chunk.toString().trim() === 'exit') {
        stdout.write('Au revoir!');
        process.exit();
    }
    output.write(chunk);
});

process.on('SIGINT', () => {
    stdout.write('Au revoir!');
    process.exit();
});