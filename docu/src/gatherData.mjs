import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import babel from '@babel/core';
import vm from 'vm';

export default gatherData;

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
    // Find all calls to pushEvent(...) and extract name of event
    CallExpression: function ({node}) {
      const {callee, arguments: args, loc} = node;

      if (callee.type === 'Identifier' && callee.name === 'pushEvent') {
        const isRestrictedEvent = args.length > 2 && args[2].value === true;
        const eventName = args[0].value;
        console.log(
          `   command "${chalk.yellow.bold(commandName)}" produces event "${chalk.yellow.bold(
            eventName
          )}"  (commandHandler file ${filePath} , line ${loc.start.line})`
        );
        cmdHandlerInfo.events.push({eventName, restricted: isRestrictedEvent});
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

  // compact events, remove duplicates
  cmdHandlerInfo.events = Object.values(
    cmdHandlerInfo.events.reduce((total, current) => {
      if (total[current.eventName] && current.restricted) {
        total[current.eventName].restricted = true;
      } else {
        total[current.eventName] = current;
      }
      return total;
    }, [])
  );

  // sort events alphabetically
  cmdHandlerInfo.events.sort((evA, evB) => evA.eventName.localeCompare(evB.eventName));

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
  const addEventTotal = (total, {eventName, restricted}, commandName) => {
    if (!total[eventName]) {
      total[eventName] = {
        eventName,
        restricted,
        byCommands: []
      };
    } else if (restricted) {
      total[eventName].restricted = true; // an event could  be "pushed" restricted and unrestricted... would not make sense, but we cannot quarantee that it is not the case.
    }
    total[eventName].byCommands.push(commandName);
    total[eventName].byCommands = uniqueArray(total[eventName].byCommands);
    return total;
  };

  const eventMap = commandHandlerInfo.reduce(
    (total, currentCmdHandler) =>
      currentCmdHandler.events.reduce(
        (innerTotal, e) => addEventTotal(innerTotal, e, currentCmdHandler.commandName),
        total
      ),
    {}
  );

  return Object.values(eventMap);
}

/**
 * use "import" statements in file "commandHandlers.js" to find all commandHandlers
 * we cannot "readDir" the cmdHandlersDirPath, since it contains also other files...
 *
 * @return {Promise<string[]>} list of filenames
 */
async function getListOfCommandHandlerFiles(cmdHandlersDirPath) {
  const {result} = await parseFile(path.join(cmdHandlersDirPath, 'commandHandlers.js'));
  const imports = [];
  babel.traverse(result, {
    ImportDeclaration: (nodePath) => {
      imports.push(nodePath.node.source.value);
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
