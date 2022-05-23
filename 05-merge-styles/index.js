const path = require('path');
const fs = require('fs');

fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (error, elements) => {
  if (error) throw error;

  elements.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {

      const readableStream = fs.createReadStream(
        path.join(path.join(__dirname, 'styles'), file.name)
      );

      readableStream.on('data', (data) => {
        fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data, (error) => {
          if (error) throw error;
        });
      });
    }
  });
});