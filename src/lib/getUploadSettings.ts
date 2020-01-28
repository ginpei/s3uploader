import { readFileSync } from 'fs';
import { UploadSettings } from './upload';

export function getUploadSettings(): UploadSettings {
  const fname = 'upload-settings.json';
  const json = readFileSync(fname, 'utf8');
  const data = JSON.parse(json);
  return data;
}
