import path from 'path';
import glob from 'glob';
import settings from '../docuSettings.mjs';

import util from 'util';
import {exec} from 'child_process';

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
      await execPromised(`mmdc -i ${file.filePath} -o ${file.filePath}.svg`);
    })
  );
}

/**
 *
 * @return {Promise<{filePath:string,fileName,string}>}
 */
async function listMarkdownFiles() {
  return new Promise((resolve, reject) => {
    glob('**/*.md', {cwd: settings.diagramsDirPath}, (err, matchingFileNames) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          matchingFileNames.map((fileName) => ({
            filePath: path.resolve(settings.diagramsDirPath, fileName),
            fileName
          }))
        );
      }
    });
  });
}
