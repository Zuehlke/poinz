/**
 *  Build Script for Docker Image
 *
 *  1. cleanup output directories
 *  2. build poinz client (webpack)
 *  3. copy client and backend to "deploy" folder
 *  4. build docker image (see Dockerfile)
 *
 * */
var
  fs = require('fs-extra'),
  path = require('path'),
  spawn = require('child_process').spawn,
  Q = require('q'),
  del = require('del');

// first let's clean up
del([
  './deploy/src/',
  './deploy/public',
  './deploy/package.json',
  '!./client/dist/index.html',
  './client/dist/**/*'
])
  .then(function () {
    console.log('POINZ: building client with webpack...');
    return spawnAndPrint(
      './node_modules/.bin/webpack', '-p --colors --bail --config webpack.production.config.js'.split(' '),
      {cwd: path.resolve(__dirname, '../client')});
  })
  .then(function () {
    console.log('POINZ: copying sources...');
    return Q.ninvoke(fs, 'copy', './client/dist', './deploy/public/assets');
  })
  .then(function () {
    return Q.ninvoke(fs, 'copy', './client/index.html', './deploy/public/index.html');
  })
  .then(function () {
    return Q.ninvoke(fs, 'copy', './server/src', './deploy/src');
  })
  .then(function () {
    return Q.ninvoke(fs, 'copy', './server/package.json', './deploy/package.json');
  })
  .then(function () {
    console.log('POINZ: building docker container...');
    return spawnAndPrint('docker', 'build -t xeronimus/poinz .'.split(' '),
      {cwd: path.resolve(__dirname, '..')});
  })
  .catch(function (error) {
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
 * @returns {Promise} Returns a promise that will reject if childprocess does not exit with code 0.
 */
function spawnAndPrint(command, arguments, options) {
  var deferred = Q.defer();

  var spawned = spawn(command, arguments, options);
  spawned.stdout.pipe(process.stdout);
  spawned.stderr.pipe(process.stderr);

  // when the spawn child process exits, check if there were any errors
  spawned.on('exit', code => {
    if (code != 0) {
      deferred.reject(new Error('Error in child process'));
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}
