const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, elements) => {
  if (err) throw err;

  elements.forEach((file) => {
    fs.lstat(`${__dirname}/secret-folder/${file}`, (err, stat) => {
      if (err) throw err;

      if (stat.isFile()) {
        const fileExtension = path.extname(file);
        const fileName = path.basename(file, fileExtension);
        const fileSize = stat.size;

        console.log(`${fileName} - ${fileExtension.slice(1)} - ${fileSize / 1000}kb`);
      }
    });
  });
});