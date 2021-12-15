import path from 'path';
import {fileURLToPath} from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const docuSettings = {
  commandAndEventDocuTemplate: path.resolve(dirname, './templates/commandAndEventDocu.ejs'),
  cmdHandlersDirPath: path.resolve(dirname, '../server/src/commandHandlers'),
  evtHandlersDirPath: path.resolve(dirname, '../server/src/eventHandlers'),
  diagramsDirPath: path.resolve(dirname, './diagrams'),
  docuOutputDirPath: path.resolve(dirname, './')
};

export default docuSettings;
