import { constants } from 'fs';
import fs from 'fs/promises';
import path from 'path';

export class FS {
  #base;

  constructor({ base }: { base: string }) {
    this.#base = path.isAbsolute(base)
      ? base
      : // eslint-disable-next-line dot-notation
        path.join(process.env['PWD'] || __dirname, base);
  }

  get base(): string {
    return this.#base;
  }

  toAbsolute(file: string): string {
    return path.isAbsolute(file) ? file : path.join(this.#base, file);
  }

  toBase(file: string): string {
    return this.toAbsolute(file).replace(this.#base, '');
  }

  async dirExists(dir: string): Promise<boolean> {
    try {
      await fs.access(this.toAbsolute(dir), constants.R_OK);
      return true;
    } catch {
      return false;
    }
  }

  async fileExists(file: string): Promise<boolean> {
    try {
      await fs.access(this.toAbsolute(file), constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async fileLoad(file: string): Promise<string | void> {
    try {
      return await fs.readFile(this.toAbsolute(file), 'utf-8');
    } catch {
      return undefined;
    }
  }

  async fileWrite(file: string, content: string): Promise<void> {
    return await fs.writeFile(this.toAbsolute(file), content);
  }

  async fileRename(file: string, name: string): Promise<void> {
    return await fs.rename(this.toAbsolute(file), name);
  }

  async listFiles(dir: string): Promise<string[]> {
    const rp = this.toAbsolute(dir);

    const list = await fs.readdir(rp);
    return list;
  }
}
