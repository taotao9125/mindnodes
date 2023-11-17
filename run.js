const fse = require('fs-extra');
const glob = require('glob');
const path = require('path');
const childProcess = require('child_process');
const srcDir = './src';

function parseFiles(srcDir) {
  const files = glob.globSync(`${srcDir}/**/*.md`, { nodir: true });
  const parsedFile = files.map(el => {
    const p = path.parse(el);
    return {
      ...p,
      src: el,
      target: path.join(p.dir.replace(/src\//, 'dist/'), `${p.name}.html`)
    };
  });
  return parsedFile;
}

function genIndexPage(parsedFile) {
  const indexPageTpl = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>mindnodes</title>
      <style>
        * {
          margin: 0;
          padding: 0;
        }
        body {
          padding: 20px;
        }
      </style>
    </head>
    <body>
    <ul>__CONTENT__</ul>
    </body>
    </html>
    `.trim();

  const indexPageContent = parsedFile.reduce((acc, cur) => {
    acc = acc + `<li><a href="${cur.dir}">${cur.dir.split('/').pop()}</a></li>`;
    return acc;
  }, '');

  const target = 'dist/index.html';
  fse.ensureFileSync(target);
  fse.writeFileSync(target, indexPageContent);
}

function genMinNodesPage(parsedFile) {
  parsedFile.forEach(el => {
    fse.ensureFileSync(el.target);
    childProcess.exec(`npx markmap-cli ${el.src} --no-open --offline -o ${el.target}`);
  });
}

const fileInfos = parseFiles(srcDir);
genMinNodesPage(fileInfos);
genIndexPage(fileInfos);
