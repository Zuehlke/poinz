/**
 *  Build Script for Docker Image
 *
 *  1. clean-up output directories
 *  2. build poinz client (webpack)
 *  3. transpile backend sources
 *  4. copy client and backend to "deploy" folder
 *  5. build docker image (see Dockerfile)
 *
 * */
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const {exec} = require('child_process');
const {spawn} = require('cross-spawn');
const del = require('del');

const execPromised = Promise.promisify(exec);

const HEROKU_DEPLOYMENT_TAG = 'registry.heroku.com/poinz/web';

const clientDirPath = path.resolve(__dirname, '../client');
const serverDirPath = path.resolve(__dirname, '../server');

build()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    console.error(error.stack);
    process.exit(1);
  });

async function build() {
  // 1. clean-up output directories
  console.log('clean up deploy and distubtion');
  await del([
    './deploy/',
    './deploy/package.json',
    '!./client/dist/index.html',
    './client/dist/**/*'
  ]);

  // 2. build poinz client (webpack)
  console.log('installing npm dependencies for client...');
  await spawnAndPrint('npm', ['install'], {cwd: clientDirPath});

  console.log('building client with webpack...');
  await spawnAndPrint(
    './node_modules/.bin/webpack',
    '-p --colors --bail --config webpack.production.config.js'.split(' '),
    {cwd: path.resolve(__dirname, '../client')}
  );

  console.log('copying built client to ./deploy/public');
  await fs.copy('./client/dist', './deploy/public/assets');
  await fs.copy('./client/index.html', './deploy/public/index.html');

  // 3. transpile backend sources
  console.log('installing npm dependencies for server...');
  await spawnAndPrint('npm', ['install'], {cwd: serverDirPath});

  console.log('building backend (babel transpile)...');
  await spawnAndPrint('./node_modules/.bin/babel', './src/ -d ./lib'.split(' '), {
    cwd: serverDirPath
  });

  // 4. copy client and backend to "deploy" folder
  await fs.copy('./server/lib', './deploy/lib');
  await fs.copy('./server/resources', './deploy/resources');
  await fs.copy('./server/package.json', './deploy/package.json');

  //  5. build docker image (see Dockerfile)
  const gitInfo = await getGitInformation();
  await startBuildingDockerImage(gitInfo);

  console.log('Done.\ndocker run  -e NODE_ENV=development -p 3000:3000 -d xeronimus/poinz');
}

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
  const spawned = spawn(command, arguments, options);
  spawned.stdout.pipe(process.stdout);
  spawned.stderr.pipe(process.stderr);

  return new Promise((resolve, reject) =>
    spawned.on('exit', (code) =>
      code !== 0 ? reject(new Error('Error in child process')) : resolve()
    )
  );
}

function startBuildingDockerImage(gitInfo) {
  console.log(`building docker container for ${gitInfo.hash} on ${gitInfo.branch}`);

  const userAndProject = 'xeronimus/poinz';
  const cmdArgs = `build -t ${userAndProject}:latest -t ${HEROKU_DEPLOYMENT_TAG} .`;

  return spawnAndPrint('docker', cmdArgs.split(' '), {cwd: path.resolve(__dirname, '..')});
}

function getGitInformation() {
  return Promise.all([
    execPromised('git rev-parse --abbrev-ref HEAD', {cdw: __dirname}),
    execPromised('git rev-parse --short HEAD', {cdw: __dirname})
  ]).spread((abbrev, short) => ({
    branch: abbrev.split('\n').join(''),
    hash: short.split('\n').join('')
  }));
}
