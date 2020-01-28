import AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { grey } from 'colors/safe';
import fs from 'fs';
import path from 'path';
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
  const req = s3.putObject(params);
  return req.promise();
}

export async function uploadDir(
  dirPath: string,
  settings: UploadSettings,
) {
  const [firstProp, ...props] = await walkThrough(dirPath);
  if (!firstProp) {
    return Promise.resolve();
  }

  const length = props.length + 1;

  logUploading(firstProp, 0, length);
  let p = upload(firstProp.filePath, firstProp.fileKey, settings);
  props.forEach(({ filePath, fileKey }, index) => {
    p = p.then(() => {
      logUploading(firstProp, index + 1, length);
      return upload(filePath, fileKey, settings);
    });
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

function logUploading(props: FileProps, index: number, length: number) {
  log(grey(`[${index + 1}/${length}]`), props.fileKey);
}

function flat<T>(arr: (T | T[])[]): T[] {
  return arr.reduce((a: T[], i) => a.concat(i), []);
}
