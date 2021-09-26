import fsPromise from 'fs/promises';

import { FS } from '../fs';
import { RuleWrapper } from '../rule';
import type { RuleInterface } from '../rule';

import { checkFilePresence } from './checkFilePresence';

const spyExists = jest.spyOn(fsPromise, 'access');
const spyWrite = jest.spyOn(fsPromise, 'writeFile');

const fs = new FS({});
const baseName = 'foobar';
const getContent = (): string => '';
const rule: RuleInterface<'presence', never> = {
  name: 'foobar',
  docs: {
    description: '',
    url: '',
  },
  messages: {
    presence: '',
  },
  exec: () => {},
};

describe('checkFilePresence', () => {
  beforeEach(() => {
    spyExists.mockClear();
    spyWrite.mockClear();
  });

  it('should find the file with the correct name', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);
    const report = jest.spyOn(r, 'report');
    spyExists.mockResolvedValueOnce(true as any);

    const check = await checkFilePresence(r, {
      baseName,
      getContent,
    });
    expect(check).toBeUndefined();
    expect(report).not.toHaveBeenCalled();
  });

  it('should not find the file', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);
    const report = jest.spyOn(r, 'report');
    spyExists.mockRejectedValueOnce(false as any);

    const check = await checkFilePresence(r, {
      baseName,
      getContent,
    });
    expect(check).toBeInstanceOf(Function);
    expect(report).toHaveBeenCalledWith('presence');
  });

  describe('fixer', () => {
    it('should create file if missing', async () => {
      const r = new RuleWrapper(rule, ['error'], fs);
      spyExists.mockRejectedValueOnce(false as any);

      const fixer = await checkFilePresence(r, {
        baseName,
        getContent,
      });
      await fixer!();
      expect(spyWrite).toHaveBeenCalledWith(r.fs.toAbsolute('foobar'), '');
    });
  });
});
