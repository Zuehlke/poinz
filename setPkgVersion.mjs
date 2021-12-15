import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import {fileURLToPath} from "url";

/**
 * Sets the specified version in our three package.json files
 *
 * invoke via command-line:    $ node setPkgVersion.mjs 0.4.3
 *
 */



const modules = [
  './',
  './client',
  './server',
];

if (process.argv.length < 3) {
  console.error(chalk.red.bold('Please specify version...'));
  process.exit(1);
}
const versionToSet = process.argv[2];

const dirname = path.dirname(fileURLToPath(import.meta.url));

Promise.all(modules.map(setPkgVersionInModule)).then(() => console.log(chalk.green('done')));

async function setPkgVersionInModule(module) {
  const absolutePkgJsonPath = path.resolve(dirname, path.join(module, 'package.json'));
  console.log(chalk.blue(`setting Version in ${absolutePkgJsonPath} to ${versionToSet}`));

  const pkgContent = await fs.readJson(absolutePkgJsonPath, 'utf-8');
  pkgContent.version = versionToSet;
  await fs.writeJson(absolutePkgJsonPath, pkgContent, {spaces: 2});
}
