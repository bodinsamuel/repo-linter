import { constants } from 'fs';
import fs from 'fs/promises';

const cacheFileList = new Map<string, string[]>();

export class FS {
  #base;

  constructor(base: string) {
    this.#base = base;
  }

  async fileExists(file: string): Promise<boolean> {
    try {
      await fs.access(file, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async fileLoad(file: string): Promise<string | void> {
    try {
      return await fs.readFile(file, 'utf-8');
    } catch {
      return undefined;
    }
  }

  async listFiles(path: string): Promise<string[]> {
    if (cacheFileList.has(path)) {
      return cacheFileList.get(path)!;
    }

    const list = await fs.readdir(path);
    cacheFileList.set(path, list);
    return list;
  }
}
