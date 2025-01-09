/**
 * Build-Script for our Poinz Docker Image
 * Make sure to invoke "./build.mjs" first!
 *
 * */
import path from 'path';
import {fileURLToPath} from 'url';
import util from 'util';
import {exec} from 'child_process';
import 'dotenv/config';

import {spawnAndPrint} from './buildUtils.mjs';

const execPromised = util.promisify(exec);

const HEROKU_DEPLOYMENT_TAG = 'registry.heroku.com/poinz/web';

const dirname = path.dirname(fileURLToPath(import.meta.url));

buildImage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    console.error(error.stack);
    process.exit(1);
  });

async function buildImage() {
  const gitInfo = await getGitInformation();

  console.log(
    `building docker container for ${gitInfo.hash} on branch ${
      gitInfo.branch
    } (git-tags: ${gitInfo.tags.join(' ')})`
  );

  const user = process.env.DOCKER_USERNAME || 'xeronimus';
  const userAndProject = `${user}/poinz`;
  const tags = [`${userAndProject}:latest`];
  gitInfo.tags.forEach((gitTag) => tags.push(`${userAndProject}:${gitTag}`));
  console.log(gitInfo)
  const cmdArgs = `build ${tags.map((tg) => '-t ' + tg).join(' ')} --network=host .`;

  console.log(` $ docker ${cmdArgs}`); // will be something like : docker build -t damilare/poinz:latest -t registry.heroku.com/poinz/web .

  return spawnAndPrint('docker', cmdArgs.split(' '), {cwd: path.resolve(dirname, '..')});
}

function getGitInformation() {
  return Promise.all([
    execPromised('git rev-parse --abbrev-ref HEAD', {cwd: dirname}), // This will return `HEAD` if in detached mode
    execPromised('git rev-parse --short HEAD', {cwd: dirname}),
    execPromised('git tag --points-at HEAD', {cwd: dirname})
  ]).then(([abbrev, short, tags]) => ({
    branch: process.env.TRAVIS_BRANCH || abbrev.stdout.split('\n').join(''),
    hash: short.stdout.split('\n').join(''),
    tags: tags.stdout.split('\n').filter((n) => n)
  }));
}
