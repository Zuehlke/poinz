import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import {fileURLToPath} from 'url';

import settings from '../docuSettings.mjs';
import generateMermaidDiagrams from './generateMermaidDiagrams.mjs';
import gatherData from './gatherData.mjs';
import renderDocu from './renderDocu.mjs';

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Parses commandHandlers, validationSchemas and eventHandlers to gather information about commands and generated events.
 * Writes documentation to markdown file.
 */
async function generate() {
  console.log(chalk.blue.bold('Generating commands and events documentation for Poinz:'));
  console.log(
    `  Expecting commandHandlers in "${settings.cmdHandlersDirPath}"\n  Expecting eventHandlers in "${settings.evtHandlersDirPath}"\n\n`
  );

  const data = await gatherData(settings.cmdHandlersDirPath, settings.evtHandlersDirPath);

  const version = await getPoinzVersionFromPackageJson();
  const markdownString = await renderDocu(data, version);
  await fs.promises.writeFile(
    path.join(settings.docuOutputDirPath, './commandAndEventDocu.md'),
    markdownString,
    'utf-8'
  );

  console.log(chalk.blue.bold('\n\nGenerating svg graphics from diagrams...\n'));
  await generateMermaidDiagrams();
}

async function getPoinzVersionFromPackageJson() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const pkgJsonPath = path.resolve(dirname, '../../package.json');

  const pkg = await fs.readJson(pkgJsonPath);

  return pkg.version;
}
