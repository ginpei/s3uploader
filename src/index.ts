import { green } from 'colors/safe';
import { extract, prepareTempDir } from './lib/extract';
import { getUploadSettings } from './lib/getUploadSettings';
import { logError } from './lib/log';
import { uploadDir } from './lib/upload';

async function main() {
  const settings = getUploadSettings();
  if (!settings) {
    throw new Error('Failed to load settings');
  }

  const zipPath = getTargetZipPath();
  if (!zipPath) {
    throw new Error('No zip file is given');
  }

  const dir = prepareTempDir();
  await extract(zipPath, dir);
  await uploadDir(dir, settings);
  process.stdout.write(green('Done.\n'));
}

function getTargetZipPath() {
  return process.argv[2];
}

main().catch((error) => logError(error));
