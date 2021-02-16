const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const downloadMermaidDiagramsAsSvg = require('./diagrams/downloadMermaidDiagramsAsSvg');
const gatherData = require('./gatherData');
const renderDocu = require('./renderDocu');

const cmdHandlersDirPath = path.join(__dirname, '../src/commandHandlers');
const evtHandlersDirPath = path.join(__dirname, '../src/eventHandlers');

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
    `  Expecting commandHandlers in "${cmdHandlersDirPath}"\n  Expecting eventHandlers in "${evtHandlersDirPath}"\n\n`
  );

  const data = await gatherData(cmdHandlersDirPath, evtHandlersDirPath);

  const markdownString = await renderDocu(data);
  await fs.promises.writeFile(
    path.join(__dirname, './commandAndEventDocu.md'),
    markdownString,
    'utf-8'
  );

  await downloadMermaidDiagramsAsSvg();
}
