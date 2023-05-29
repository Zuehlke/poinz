import path from 'path';
import {glob} from 'glob';
import util from 'util';
import {exec} from 'child_process';

import settings from '../docuSettings.mjs';

const execPromised = util.promisify(exec);

export default generateMermaidDiagrams;

/*
 *  see  https://mermaid-js.github.io/mermaid-live-editor
 *  see  https://github.com/mermaid-js/mermaid-cli
 */

/**
 *
 * @return {Promise<string[]>}
 */
async function generateMermaidDiagrams() {
  const files = await listMarkdownFiles();

  await Promise.all(
    files.map(async (file) => {
      console.log(`   generating mermaid diagram for ${file.fileName}`);
      await execPromised(`mmdc -i ${file.filePath}`);
    })
  );
}

/**
 *
 * @return {Promise<{filePath:string,fileName,string}>}
 */
async function listMarkdownFiles() {
  const matchingFileNames = await glob('**/*.md', {cwd: settings.diagramsDirPath});

  return matchingFileNames.map((fileName) => ({
    filePath: path.resolve(settings.diagramsDirPath, fileName),
    fileName
  }));
}
