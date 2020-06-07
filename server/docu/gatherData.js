const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');

module.exports = gatherData;

/**
 * gathers command and event metadata from our sources
 *
 * @param {string} cmdHandlersDirPath
 * @param {string} validationSchemasDirPath
 * @param {string} evtHandlersDirPath
 * @return {Promise<{commandHandlerFileData: any, eventList: *}>}
 */
async function gatherData(cmdHandlersDirPath, validationSchemasDirPath, evtHandlersDirPath) {
  const commandHandlerFilenames = await fs.promises.readdir(cmdHandlersDirPath);
  let commandHandlerFileData = await Promise.all(
    commandHandlerFilenames.map(
      async (f) => await handleSingleCmdHandlerFile(path.join(cmdHandlersDirPath, f))
    )
  );
  commandHandlerFileData = commandHandlerFileData.filter((chi) => !!chi);
  let eventList = getEventListFromCmdHandlers(commandHandlerFileData);
  eventList = await augmentEventsWithDescriptions(eventList);

  return {commandHandlerFileData, eventList};

  async function augmentEventsWithDescriptions(eventList) {
    return await Promise.all(eventList.map(handleSingleEvtHandlerFile));
  }

  /**
   * just pull out all events from all cmdHandlers into a list. hold reference to names of producing commands.
   */
  function getEventListFromCmdHandlers(commandHandlerInfo) {
    const addEventTotal = (total, event, commandName) => {
      if (!total[event]) {
        total[event] = {
          eventName: event,
          byCommands: []
        };
      }
      total[event].byCommands.push(commandName);
      return total;
    };

    const eventMap = commandHandlerInfo.reduce((total, currentCmdHandler) => {
      return currentCmdHandler.events.reduce(
        (innerTotal, e) => addEventTotal(innerTotal, e, currentCmdHandler.commandName),
        total
      );
    }, {});

    return Object.values(eventMap);
  }

  async function handleSingleEvtHandlerFile(evt) {
    const filePath = path.join(evtHandlersDirPath, evt.eventName + '.js');

    const parseResult = await parseFile(filePath);

    evt.description = getFirstBlockComment(parseResult);
    if (!evt.description) {
      console.log(`   EventHandler "${filePath}" has no descriptive comment... :( `);
    }
    evt.relativeFilePath = getPoinzRelativePath(filePath);
    return evt;
  }

  function getFirstBlockComment(parseResult) {
    if (parseResult.comments) {
      const blockComments = parseResult.comments.filter((c) => c.type === 'CommentBlock');
      if (blockComments.length) {
        let comment = blockComments[0].value.replace(/\*/g, '');
        return comment
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => !!l)
          .join('\n');
      }
    }
    return '';
  }

  function getPoinzRelativePath(filePath) {
    const absPath = path.resolve(filePath);

    return absPath.substring(absPath.lastIndexOf('poinz') + 5);
  }

  async function parseFile(filePath) {
    const source = await fs.promises.readFile(filePath, 'utf-8');
    return await new Promise((resolve, reject) =>
      babel.parse(source, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      })
    );
  }

  /**
   *  parse given commandHandler file with babel. pull information from AST
   */
  async function handleSingleCmdHandlerFile(filePath) {
    const commandName = path.basename(filePath, '.js');

    if (commandName === 'commandHandlers') {
      // special "indexing" file is not a command handler
      return undefined;
    }

    const parseResult = await parseFile(filePath);
    const schema = await getValidationSchemaForCommand(commandName);
    const cmdHandlerInfo = {
      filePath,
      relativeFilePath: getPoinzRelativePath(filePath),
      commandName,
      schema,
      events: []
    };

    cmdHandlerInfo.description = getFirstBlockComment(parseResult);

    babel.traverse(parseResult, {
      CallExpression: function ({node}) {
        const {callee, arguments, loc} = node;

        if (callee.type === 'MemberExpression' && callee.property.name === 'applyEvent') {
          const eventName = arguments[0].value;
          console.log(
            `   commandHandler file ${filePath} produces event "${chalk.yellow.bold(
              eventName
            )}" on line ${loc.start.line}`
          );
          cmdHandlerInfo.events.push(eventName);
        }
      }
    });

    return cmdHandlerInfo;
  }

  /**
   * load matching validation schema json file for given command
   */
  async function getValidationSchemaForCommand(commandName) {
    const validationSchemaFileContent = await fs.promises.readFile(
      path.join(validationSchemasDirPath, commandName + '.json'),
      'utf-8'
    );
    return JSON.parse(validationSchemaFileContent);
  }
}
