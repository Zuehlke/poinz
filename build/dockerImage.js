/**
 *  Build Script for Docker Image
 *
 *  1. clean-up output directories
 *  2. build poinz client (webpack)
 *  3. transpile backend sources
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

// -- first let's clean up
del([
  './deploy/',
  './deploy/package.json',
  '!./client/dist/index.html',
  './client/dist/**/*'
])
// -- client
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

  // -- server
  .then(() => {
    console.log('installing npm dependencies for server...');
    return spawnAndPrint('npm', ['install'], {cwd: path.resolve(__dirname, '../server')});
  })
  .then(() => {
    console.log('building backend (babel transpile)...');
    return spawnAndPrint(
      './node_modules/.bin/babel', './src/ -d ./lib'.split(' '),
      {cwd: path.resolve(__dirname, '../server')});
  })
  .then(() => fs.copy('./server/lib', './deploy/lib')) // copy transpiled backend files to deploy folder
  .then(() => fs.copy('./server/resources', './deploy/resources'))
  .then(() => fs.copy('./server/package.json', './deploy/package.json'))

  // -- docker image
  .then(getGitInformation)
  .then(startBuildingDockerImage)
  .catch(error => {
    console.error(error);
    console.error(error.stack);
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

function startBuildingDockerImage(gitInfo) {
  console.log(`building docker container for ${gitInfo.hash} on ${gitInfo.branch}`);

  const userAndProject = 'xeronimus/poinz';
  const cmdArgs = `build -t ${userAndProject}:latest -t ${userAndProject}:${gitInfo.branch} -t ${userAndProject}:${gitInfo.hash} .`;

  return spawnAndPrint('docker', cmdArgs.split(' '), {cwd: path.resolve(__dirname, '..')});
}

function getGitInformation() {
  return Promise.all([
    exec('git rev-parse --abbrev-ref HEAD', {cdw: __dirname}),
    exec('git rev-parse --short HEAD', {cdw: __dirname})
  ])
    .spread((abbrev, short) => ({
      branch: abbrev.split('\n').join(''),
      hash: short.split('\n').join('')
    }));
}

