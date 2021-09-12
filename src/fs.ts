import { constants } from 'fs';
import fs from 'fs/promises';
import path from 'path';

const cacheFileList = new Map<string, string[]>();

export class FS {
  #base;

  constructor(base: string) {
    this.#base = base;
  }

  async fileExists(file: string): Promise<boolean> {
    try {
      await fs.access(
        path.isAbsolute(file) ? file : path.join(this.#base, file),
        constants.F_OK
      );
      return true;
    } catch {
      return false;
    }
  }

  async fileLoad(file: string): Promise<string | void> {
    try {
      return await fs.readFile(
        path.isAbsolute(file) ? file : path.join(this.#base, file),
        'utf-8'
      );
    } catch {
      return undefined;
    }
  }

  async listFiles(dir: string): Promise<string[]> {
    const rp = path.isAbsolute(dir) ? dir : path.join(this.#base, dir);
    console.log('want', dir, rp);
    if (cacheFileList.has(rp)) {
      return cacheFileList.get(rp)!;
    }

    const list = await fs.readdir(rp);
    cacheFileList.set(rp, list);
    return list;
  }
}
