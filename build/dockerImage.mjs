/**
 * Build-Script for our Poinz Docker Image
 * Make sure to invoke "./build.mjs" first!
 *
 * */
import path from 'path';
import {fileURLToPath} from 'url';
import util from 'util';
import {exec} from 'child_process';

import {spawnAndPrint} from './buildUtils.mjs';

const execPromised = util.promisify(exec);

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

  if (!process.env.DOCKER_REGISTRY) {
    throw new Error('DOCKER_REGISTRY environment variable must be set');
  }
  if (!process.env.DOCKER_USERNAME) {
    throw new Error('DOCKER_USERNAME environment variable must be set');
  }

  const registry = process.env.DOCKER_REGISTRY;
  const user = process.env.DOCKER_USERNAME.toLowerCase();
  const userAndProject = `${registry}/${user}/poinz`;
  const tags = [`${userAndProject}:latest`];
  gitInfo.tags.forEach((gitTag) => tags.push(`${userAndProject}:${gitTag}`));
  const cmdArgs = `build ${tags.map((tg) => '-t ' + tg).join(' ')} --network=host .`;

  console.log(` $ docker ${cmdArgs}`);

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
