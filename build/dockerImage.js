/**
 *  Build Script for Docker Image
 *
 *  1. cleanup output directories
 *  2. build poinz client (webpack)
 *  3. copy client and backend to "deploy" folder
 *  4. build docker image (see Dockerfile)
 *
 * */
const
  path = require('path'),
  Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs-extra')),
  spawn = require('child_process').spawn,
  exec = Promise.promisify(require('child_process').exec),
  del = require('del');

// first let's clean up
del([
  './deploy/src/',
  './deploy/public',
  './deploy/package.json',
  '!./client/dist/index.html',
  './client/dist/**/*'
])
  .then(() => {
    console.log('installing npm dependencies for client...');
    return spawnAndPrint('npm', ['install'], {cwd: path.resolve(__dirname, '../client')});
  })
  .then(() => {
    console.log('building client with webpack...');
    return spawnAndPrint(
      './node_modules/.bin/webpack', '-p --colors --bail --config webpack.production.config.js'.split(' '),
      {cwd: path.resolve(__dirname, '../client')});
  })
  .then(() => fs.copy('./client/dist', './deploy/public/assets'))
  .then(() => fs.copy('./client/index.html', './deploy/public/index.html'))
  .then(() => fs.copy('./server/src', './deploy/src'))
  .then(() => fs.copy('./server/package.json', './deploy/package.json'))
  .then(() => exec('git rev-parse --short HEAD', {cdw: __dirname}))
  .then(stdout => stdout.split('\n').join(''))
  .then(gitShortHash => {
    console.log(`building docker container for ${gitShortHash}`);
    return spawnAndPrint('docker', `build -t xeronimus/poinz:latest -t xeronimus/poinz:${gitShortHash} .`.split(' '),
      {cwd: path.resolve(__dirname, '..')});
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


/**
 * spawns a child process (nodejs' child_process.spawn)
 * and pipes stdout and stderr to the node process.
 *
 * @param command
 * @param arguments
 * @param options
 * @returns {Promise<T>} Returns a promise that will reject if childprocess does not exit with code 0.
 */
function spawnAndPrint(command, arguments, options) {

  var spawned = spawn(command, arguments, options);
  spawned.stdout.pipe(process.stdout);
  spawned.stderr.pipe(process.stderr);

  return new Promise((resolve, reject) => spawned.on('exit', code => code != 0 ? reject(new Error('Error in child process')) : resolve()));
}

