const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const settings = require('../docuSettings');
const downloadMermaidDiagramsAsSvg = require('./downloadMermaidDiagramsAsSvg');
const gatherData = require('./gatherData');
const renderDocu = require('./renderDocu');

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

  const markdownString = await renderDocu(data);
  await fs.promises.writeFile(
    path.join(settings.docuOutputDirPath, './commandAndEventDocu.md'),
    markdownString,
    'utf-8'
  );

  console.log(chalk.blue.bold('\n\nGenerating svg graphics from diagrams...\n'));
  await downloadMermaidDiagramsAsSvg();
}
