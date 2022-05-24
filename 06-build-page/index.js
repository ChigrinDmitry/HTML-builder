const path = require('path');
const fs = require('fs');

fs.rm(path.join(__dirname, '/project-dist/'), { recursive: true, force: true }, () => {
  fs.mkdir(path.join(__dirname, '/project-dist/'), () => {
    fs.readdir(path.join(__dirname, '/'), (err, elements) => {

        if (err) throw err;

        elements.forEach(file => {

        if(file === 'assets') fs.mkdir(path.join(__dirname, '/project-dist/'), () => {
          fs.readdir(path.join(__dirname, '/assets'), (assetsError, assetsElems) => {

            if (assetsError) throw err;

            fs.mkdir(path.join(__dirname, '/project-dist/assets/'), () => {

              assetsElems.forEach(assetLocation => {
                fs.readdir(path.join(__dirname, `/assets/${assetLocation}`), (err, assets) => {
                    
                    if (err) throw err;

                  assets.forEach(asset => {
                    fs.mkdir(path.join(__dirname, `/project-dist/assets/${assetLocation}/`), () => {
                      const readContent = fs.createReadStream(path.join(__dirname, `/assets/${assetLocation}/${asset}`));
                      const writeContent = fs.createWriteStream(path.join(__dirname, `/project-dist/assets/${assetLocation}/${asset}`));
                      readContent.on('data', (data) => {
                        writeContent.write(data);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      
        if (file === 'styles') {
          const writeContent = fs.createWriteStream(path.join(__dirname,'/project-dist/style.css'), {encoding: 'utf8'});
          const stylesCss = [];

          fs.readdir(path.join(__dirname, '/styles/'), (err, files) => {

            if (err) throw err;

            const cssFiles = files.filter(file => path.extname(file) === '.css');
            let length = cssFiles.length;

            cssFiles.forEach(file => {
              fs.lstat(`${__dirname}/styles/${file}`, (err, stat) => {

                if (err) throw err;

                if(stat.isFile()) {

                  const readContent = fs.createReadStream(path.join(__dirname, `/styles/${file}`), {encoding: 'utf8'});
                  readContent.on('data', (data) => {
                    stylesCss.push(data);
                    if (length === stylesCss.length) {
                        writeContent.write(stylesCss.join('\n'));
                    }
                  });
                } else {
                  length -= 1;
                }
              });
            });
          });
        }

        if (path.extname(file) === '.html' ) {          
          const readHtml = fs.createReadStream(__dirname + '/template.html', {encoding: 'utf8'});

          readHtml.on('data', (data) => {
            let html = data;
            const components = [];
            let lastComponentIndex = 0;
            while (lastComponentIndex  !== -1) {
                lastComponentIndex = html.indexOf('{{', lastComponentIndex + 1);
              const name = html.substring(lastComponentIndex+2, html.indexOf('}}', lastComponentIndex + 1));
              if(!name.includes(' '))
                components.push(name);
            }

            fs.readdir(path.join(__dirname, '/components/'), (err, files) => {

                if (err) throw err;
                
              components.forEach((component) => {
                if (files.find((file) => file === `${component}.html`)) {
                  const readComponent = fs.createReadStream(path.join(__dirname, `/components/${component}.html`), {encoding: 'utf8'}, {encoding: 'utf8'});
                  readComponent.on('data', (data) => {
                    html = html.replace(`{{${component}}}`, data);
                    if (!html.includes('{{')) {
                      const writeContent = fs.createWriteStream(path.join(__dirname, '/project-dist/index.html'), {encoding: 'utf8'}, {encoding: 'utf8'});
                      writeContent.write(html);
                    }
                  });
                } else {
                  html = html.replace(`{{${component}}}`, '');
                }
              });
            });
          });
        };

      });
    });
  });
});