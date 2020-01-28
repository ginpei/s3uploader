import { green } from 'colors/safe';
import { extractTemp } from './lib/extract';
import { uploadAll, UploadSettings } from './lib/upload';

async function main() {
  const settings = getAwsSettings();
  const zipPath = getTargetZipPath();
  const filePaths = await extractTemp(zipPath);
  await uploadAll(filePaths, settings);
  process.stdout.write(green('Done.\n'));
}

function getTargetZipPath() {
  // return process.argv[2];
  return '/mnt/c/Users/ginpei/Downloads/conde-2020-01-24/drive-download-20200128T051611Z-001.zip';
}

function getAwsSettings(): UploadSettings {
  return {};
}

// eslint-disable-next-line no-console
main().catch((error) => console.error(error));
