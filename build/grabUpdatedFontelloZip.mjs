import path from 'path';
import util from 'util';
import fs from 'fs-extra';
import {exec} from 'child_process';
import {deleteAsync} from 'del';
import {fileURLToPath} from 'url';

const execPromised = util.promisify(exec);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const POINZ_CLIENT_FONT_DIR = path.resolve(__dirname, '../client/app/assets/font');

grab(process.argv[2])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function grab(inputZipFile) {
  if (!inputZipFile) {
    throw new Error('Please specify fontello ZIP file to grab');
  }

  const absoluteFile = path.resolve(process.cwd(), inputZipFile);

  const inputZipFileExists = await fs.exists(absoluteFile);
  if (!inputZipFileExists) {
    throw new Error(`File "${absoluteFile}" does not exist...`);
  }

  console.log(`extracting ${absoluteFile}...`);

  const parentDir = path.dirname(absoluteFile);
  const targetExtractedFontelloDirname = path.join(parentDir, path.basename(absoluteFile, '.zip'));
  const weNeedToExtract = await fs.exists(targetExtractedFontelloDirname);
  if (weNeedToExtract) {
    console.warn(
      `Target fontello directory "${targetExtractedFontelloDirname}" already exists... We wil copy files from there...!`
    );
  } else {
    await execPromised(`unzip ${path.basename(absoluteFile)}`, {cwd: parentDir});
    console.log('extracted');
  }

  console.log(`copying files to ${POINZ_CLIENT_FONT_DIR}`);
  await fs.copy(path.join(targetExtractedFontelloDirname, 'font'), POINZ_CLIENT_FONT_DIR);
  await fs.copy(
    path.join(targetExtractedFontelloDirname, 'config.json'),
    path.join(POINZ_CLIENT_FONT_DIR, 'config.json')
  );
  await fs.copy(
    path.join(targetExtractedFontelloDirname, 'css', 'poinz.css'),
    path.join(POINZ_CLIENT_FONT_DIR, 'poinz.css')
  );

  if (weNeedToExtract) {
    console.log(`deleting "${targetExtractedFontelloDirname}"`);
    await deleteAsync(targetExtractedFontelloDirname, {force: true});
  }
}
