import fs from 'fs';
import https from 'https';
import path from 'path';
import glob from 'glob';

import settings from '../docuSettings.mjs';

const BASE_URL = 'https://mermaid.ink/svg/';

export default downloadMermaidDiagramsAsSvg;

/*
 *  see  https://mermaid-js.github.io/mermaid-live-editor
 */

/**
 *
 * @return {Promise<string[]>}
 */
async function downloadMermaidDiagramsAsSvg() {
  const files = await listMarkdownFiles();
  const filesWithUrl = await Promise.all(files.map(augmentWithUrl));

  await Promise.all(
    filesWithUrl.map(async (file) => {
      console.log(`   downloading mermaid.js diagram for ${file.fileName}`);
      await downloadImageToFile(file.url, file.filePath + '.svg');
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

/**
 *
 * @param {object} diagram
 * @return {Promise<{filePath:string,fileName:string,url:string}>}
 */
async function augmentWithUrl(diagram) {
  const source = await fs.promises.readFile(diagram.filePath, 'utf-8');
  return {...diagram, url: createMermaidImageUrl(source)};
}

function createMermaidImageUrl(rawMermaidDiagramText) {
  const config = {code: rawMermaidDiagramText, mermaid: {theme: 'default'}, updateEditor: false};
  const buffer = Buffer.from(JSON.stringify(config), 'utf-8');
  const encodedConfig = buffer.toString('base64');
  return BASE_URL + encodedConfig;
}

function downloadImageToFile(imageUrl, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https
      .get(imageUrl, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', async (err) => {
        await fs.promises.unlink(filePath);
        reject(err);
      });
  });
}
