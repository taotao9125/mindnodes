const fse = require('fs-extra');
const minimist = require('minimist');
const path = require('path');
const args = minimist(process.argv.slice(2));

const dirName = args.name;
const targetPath = path.join('./src', dirName);

if (!dirName) {
  throw '缺失 name 参数, 如 --name=yourDirName';
}

const isExists = fse.existsSync(targetPath);

if (isExists) {
  throw '目录已存在';
}
