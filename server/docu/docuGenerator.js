const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const gatherData = require('./gatherData');
const renderDocu = require('./renderDocu');

const cmdHandlersDirPath = path.join(__dirname, '../src/commandHandlers');
const validationSchemasDirPath = path.join(__dirname, '../resources/validationSchemas');
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
    `  Expecting commandHandlers in "${cmdHandlersDirPath}"\n  Expecting validationSchemas in "${validationSchemasDirPath}"\n  Expecting eventHandlers in "${evtHandlersDirPath}"\n\n`
  );

  const data = await gatherData(cmdHandlersDirPath, validationSchemasDirPath, evtHandlersDirPath);

  const markdownString = renderDocu(data);
  await fs.promises.writeFile(
    path.join(__dirname, './commandAndEventDocu.md'),
    markdownString,
    'utf-8'
  );
}
