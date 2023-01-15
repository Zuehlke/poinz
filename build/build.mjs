/**
 * Build-Script for our PoinZ Backend and frontend
 * Will produce a /deploy folder that contains the backend (built) and the client (built). Ready to deploy on a server with nodejs runtime.
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
  console.log('(1/4) Clean up deploy/ and client/dist/');
  await deleteAsync(['./deploy/', './client/dist/**/*']);

  // 2. build poinz client (webpack)
  console.log('(2/4) Installing npm dependencies for client and build it with webpack');
  await spawnAndPrint('npm', ['install'], {cwd: clientDirPath});
  await spawnAndPrint('npm', 'run build'.split(' '), {cwd: path.resolve(dirname, '../client')});

  console.log('...copying built client to ./deploy/public');
  await fs.copy('./client/dist', './deploy/public/assets');
  await fs.copy('./client/index.html', './deploy/public/index.html');
  await fs.copy('./client/site.webmanifest', './deploy/public/site.webmanifest');
  await fs.copy('./client/favicon.ico', './deploy/public/favicon.ico');
  await fs.copy('./client/favicon-16x16.png', './deploy/public/favicon-16x16.png');
  await fs.copy('./client/favicon-32x32.png', './deploy/public/favicon-32x32.png');

  // 3. install dependencies for backend
  console.log('(3/4) Installing npm dependencies for server...');
  await spawnAndPrint('npm', ['install'], {cwd: serverDirPath});

  // 4. copy client and backend to "deploy" folder
  console.log('(4/4) Copying to /deploy folder');
  await fs.copy('./server/src', './deploy/src');
  await fs.copy('./server/package.json', './deploy/package.json');
  await fs.copy('./server/package-lock.json', './deploy/package-lock.json');
}
