export type UploadSettings = {
}

export async function upload(path: string, settings: UploadSettings) {
  // TODO
}

export async function uploadAll(paths: string[], settings: UploadSettings) {
  return Promise.all(paths.map((v) => upload(v, settings)));
}
