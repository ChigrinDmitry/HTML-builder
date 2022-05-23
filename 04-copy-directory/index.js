const path = require('path');
const fs = require('fs');

fs.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true }, () => {
  fs.mkdir(path.join(__dirname, 'files-copy'), () => {
    fs.readdir(path.join(__dirname, 'files'), (err, elements) => {
      
    if (err) throw err;

    elements.forEach(file => {
        const readContent = fs.createReadStream(__dirname + `/files/${file}`);
        const writeContent = fs.createWriteStream(__dirname + `/files-copy/${file}`);

        readContent.on('data', (data) => {
            writeContent.write(data);
        });
      });
    });
  });
});