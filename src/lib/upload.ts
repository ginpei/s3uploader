import fs from 'fs';
import AWS from 'aws-sdk';
import path from 'path';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { log } from './log';

const s3 = new AWS.S3();

export type UploadSettings = {
  bucket: string;
  keyPrefix: string;
}

export async function upload(
  filePath: string,
  fileKey: string,
  settings: UploadSettings,
) {
  const buffer = fs.readFileSync(filePath);

  const key = path.join(settings.keyPrefix, fileKey);

  const params: PutObjectRequest = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: settings.bucket,
    Key: key,
  };
  log('Uploading:', filePath);
  const req = s3.putObject(params);
  const p = req.promise();
  p.then(() => log('Uploaded.'));
  p.catch(() => log('Failed to upload.'));
  return p;
}

export async function uploadDir(
  dirPath: string,
  settings: UploadSettings,
) {
  const [firstProp, ...props] = await walkThrough(dirPath);
  if (!firstProp) {
    return Promise.resolve();
  }

  let p = upload(firstProp.filePath, firstProp.fileKey, settings);
  props.forEach(({ filePath, fileKey }) => {
    p = p.then(() => upload(filePath, fileKey, settings));
  });
  return p;
}

type FileProps = {
  filePath: string;
  fileKey: string;
}

async function walkThrough(
  dirPath: string,
  keyPrefix = '',
): Promise<FileProps[]> {
  const curDirPath = path.join(dirPath, keyPrefix);
  const files = fs.readdirSync(curDirPath);

  const tasks = files.map((file) => {
    const fileKey = path.join(keyPrefix, file);
    const stat = fs.statSync(path.join(curDirPath, file));
    if (stat.isDirectory()) {
      return walkThrough(curDirPath, fileKey);
    }

    const filePath = path.join(curDirPath, file);
    const props: FileProps = {
      filePath,
      fileKey,
    };
    return [props];
  });

  return Promise.all(tasks).then((v) => flat(v));
}

function flat<T>(arr: (T | T[])[]): T[] {
  return arr.reduce((a: T[], i) => a.concat(i), []);
}
