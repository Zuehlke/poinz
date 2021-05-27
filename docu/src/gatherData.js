const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const vm = require('vm');

module.exports = gatherData;

/**
 * gathers command and event metadata from our sources
 *
 * @param {string} cmdHandlersDirPath
 * @param {string} evtHandlersDirPath
 * @return {Promise<{commandHandlerFileData: any, eventList: *}>}
 */
async function gatherData(cmdHandlersDirPath, evtHandlersDirPath) {
  const commandHandlerFilenames = await getListOfCommandHandlerFiles(cmdHandlersDirPath);
  let commandHandlerFileData = await Promise.all(
    commandHandlerFilenames.map(
      async (f) => await handleSingleCmdHandlerFile(path.join(cmdHandlersDirPath, f))
    )
  );
  commandHandlerFileData = commandHandlerFileData.filter((cmdHFData) => !!cmdHFData);
  let eventList = getEventListFromCmdHandlers(commandHandlerFileData);
  eventList = await augmentEventsWithDescriptions(evtHandlersDirPath, eventList);

  return {commandHandlerFileData, eventList};
}

/**
 *  parse given commandHandler file with babel. pull information from AST
 */
async function handleSingleCmdHandlerFile(filePath) {
  const commandName = path.basename(filePath, '.js');
  const {result, source} = await parseFile(filePath);

  const cmdHandlerInfo = {
    filePath,
    relativeFilePath: getPoinzRelativePath(filePath),
    commandName,
    events: []
  };

  cmdHandlerInfo.description = getFirstBlockComment(result);

  babel.traverse(result, {
    // Find all calls to .applyEvent(...) and extract name of event
    CallExpression: function ({node}) {
      const {callee, arguments: args, loc} = node;

      if (
        callee.type === 'MemberExpression' &&
        (callee.property.name === 'applyEvent' || callee.property.name === 'applyRestrictedEvent')
      ) {
        const eventName = args[0].value;
        console.log(
          `   commandHandler file ${filePath} produces event "${chalk.yellow.bold(
            eventName
          )}" on line ${loc.start.line}`
        );
        cmdHandlerInfo.events.push(eventName);
      }
    },

    // find "const schema = {.....}"  variable declarations and extract validation schema
    VariableDeclaration: function ({node}) {
      if (
        node.kind === 'const' &&
        node.declarations &&
        node.declarations.length > 0 &&
        node.declarations[0].id.name === 'schema'
      ) {
        const firstDeclaration = node.declarations[0];
        const schemaObjectLiteralSourceString = source.substring(
          firstDeclaration.init.start,
          firstDeclaration.init.end
        );
        const sourceToEvaluate = `schema = ${schemaObjectLiteralSourceString}`;
        const ctx = {schema: {}};
        try {
          vm.createContext(ctx);
          vm.runInContext(sourceToEvaluate, ctx);
        } catch (err) {
          throw new Error(`Could not gather command schema from ${filePath}\n` + err.message);
        }
        cmdHandlerInfo.schema = ctx.schema;
      }
    }
  });

  if (!cmdHandlerInfo.schema) {
    console.error(
      `Could not get validationSchema for command "${commandName}"! Expected it to be defined as "const schema = {......}" `
    );
  }

  // throw away duplicate event names
  cmdHandlerInfo.events = [...new Set(cmdHandlerInfo.events)];

  // sort them alphabetically
  cmdHandlerInfo.events.sort();

  return cmdHandlerInfo;
}

async function augmentEventsWithDescriptions(evtHandlersDirPath, eventList) {
  return await Promise.all(
    eventList.map(handleSingleEvtHandlerFile.bind(undefined, evtHandlersDirPath))
  );
}

async function handleSingleEvtHandlerFile(evtHandlersDirPath, evt) {
  const filePath = path.join(evtHandlersDirPath, evt.eventName + '.js');

  const {result} = await parseFile(filePath);

  evt.description = getFirstBlockComment(result);
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

/**
 * just pull out all events from all cmdHandlers into a single list. hold reference to names of producing commands.
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
    total[event].byCommands = uniqueArray(total[event].byCommands);
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

/**
 * use "import" statements in file "commandHandlers.js" to find all commandHandlers
 * we cannot "readDir" the cmdHandlersDirPath, since it contains also other files...
 *
 * @return {string[]} list of filenames
 */
async function getListOfCommandHandlerFiles(cmdHandlersDirPath) {
  const {result} = await parseFile(path.join(cmdHandlersDirPath, 'commandHandlers.js'));
  const imports = [];
  babel.traverse(result, {
    ImportDeclaration: (nodePath) => {
      imports.push(nodePath.node.source.value + '.js');
    }
  });

  imports.sort();
  return imports;
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
      resolve({result, source});
    })
  );
}

const uniqueArray = (array) => array.filter((cmd, index, self) => self.indexOf(cmd) === index);
