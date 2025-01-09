/**
 * Build-Script for our Poinz Backend and frontend
 * Will produce a /www/js folder that contains the backend (built) and the client (built). Ready to www/js on a server with nodejs runtime.
 * */
import path from 'path';
import {fileURLToPath} from 'url';
import {deleteAsync} from 'del';
import fs from 'fs-extra';

import {spawnAndPrint} from './buildUtils.mjs';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDirPath = path.resolve(dirname, '../client');
const serverDirPath = path.resolve(dirname, '../server');

build()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    console.error(error.stack);
    process.exit(1);
  });

async function build() {
  // 1. clean-up output directories
  console.log('(1/4) Clean up www/js/ and client/dist/');
  await deleteAsync(['./www/js/', './client/dist/**/*']);

  // 2. build poinz client (webpack)
  console.log('(2/4) Installing npm dependencies for client and build it with webpack');
  await spawnAndPrint('npm', ['install'], {cwd: clientDirPath});
  await spawnAndPrint('npm', 'run build'.split(' '), {cwd: path.resolve(dirname, '../client')});

  console.log('...copying built client to ./www/js/public');
  await fs.copy('./client/dist', './www/js/public/assets');
  await fs.copy('./client/index.html', './www/js/public/index.html');
  await fs.copy('./client/site.webmanifest', './www/js/public/site.webmanifest');
  await fs.copy('./client/favicon.ico', './www/js/public/favicon.ico');
  await fs.copy('./client/favicon-16x16.png', './www/js/public/favicon-16x16.png');
  await fs.copy('./client/favicon-32x32.png', './www/js/public/favicon-32x32.png');

  // 3. install dependencies for backend
  console.log('(3/4) Installing npm dependencies for server...');
  await spawnAndPrint('npm', ['install'], {cwd: serverDirPath});

  // 4. copy client and backend to "www/js" folder
  console.log('(4/4) Copying to /www/js folder');
  await fs.copy('./server/src', './www/js/src');
  await fs.copy('./server/package.json', './www/js/package.json');
  await fs.copy('./server/package-lock.json', './www/js/package-lock.json');
}
