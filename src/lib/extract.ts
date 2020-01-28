import cp from 'child_process';
import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export async function extract(src: string, outDir: string): Promise<string[]> {
  const args = [src, '-d', outDir];
  const { stdout } = cp.spawnSync('unzip', args, { encoding: 'utf8' });

  const keyword = 'inflating:';

  const children = stdout.split('\n')
    .filter((v) => v.trim().startsWith(keyword))
    .map((v) => v.slice(v.indexOf(keyword) + keyword.length).trim());

  const descendants = await Promise.all(children.map(
    (path) => (path.endsWith('.zip') ? extract(path, outDir) : [path]),
  ));

  const results = descendants.reduce((a, v) => a.concat(v), []);
  return results;
}

export function extractTemp(src: string) {
  const prefix = join(tmpdir(), 'ginpei-');
  const dir = mkdtempSync(prefix);
  return extract(src, dir);
}
