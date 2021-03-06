import fsPromise from 'fs/promises';

import { FS } from '../fs';
import type { RuleInterface } from '../rule';
import { RuleWrapper } from '../rule';

import { checkFileName } from './checkFileName';

const spyList = jest.spyOn(fsPromise, 'readdir');
const spyWrite = jest.spyOn(fsPromise, 'writeFile');
const spyRename = jest.spyOn(fsPromise, 'rename');

const fs = new FS({});
const defaultName = 'foobar';
const names = ['foobar', 'foobar.txt', 'foobar.json'];
const getContent = (): string => '';
const rule: RuleInterface<
  'preferred' | 'presence',
  { required?: boolean; preferred?: string }
> = {
  name: 'foobar',
  docs: {
    description: '',
    url: '',
  },
  messages: {
    preferred: '',
    presence: '',
  },
  exec: () => {},
};

describe('checkFileName', () => {
  beforeEach(() => {
    spyList.mockClear();
    spyWrite.mockClear();
    spyRename.mockClear();
  });

  it('should find the file with the correct name', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);
    const reports = jest.spyOn(r, 'reports', 'get');
    const report = jest.spyOn(r, 'report');
    spyList.mockResolvedValueOnce(['foobar'] as any);

    const check = await checkFileName(r, { names, defaultName, getContent });
    expect(check).toBeUndefined();
    expect(report).not.toHaveBeenCalled();
    expect(reports).not.toHaveBeenCalled();
  });

  it('should find the file with the correct extension', async () => {
    const r = new RuleWrapper(rule, ['error', { preferred: 'foobar.txt' }], fs);
    const reports = jest.spyOn(r, 'reports', 'get');
    const report = jest.spyOn(r, 'report');
    spyList.mockResolvedValueOnce(['foobar.txt'] as any);

    const check = await checkFileName(r, { names, defaultName, getContent });
    expect(check).toBeUndefined();
    expect(report).not.toHaveBeenCalled();
    expect(reports).not.toHaveBeenCalled();
  });

  it('should find a file but not report incorrect extension (false positive)', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);
    const report = jest.spyOn(r, 'report');
    spyList.mockResolvedValueOnce(['foobar.sh'] as any);

    const check = await checkFileName(r, { names, defaultName, getContent });
    expect(check).toBeUndefined();
    expect(report).not.toHaveBeenCalled();
  });

  it('should report multiple incorrect extension', async () => {
    const r = new RuleWrapper(rule, ['error', { required: true }], fs);
    const report = jest.spyOn(r, 'report');

    spyList.mockResolvedValueOnce(['foobar.txt', 'foobar.json'] as any);

    const check = await checkFileName(r, { names, defaultName, getContent });
    expect(report).toHaveBeenCalledTimes(3);
    expect(check).toBeUndefined();
  });

  it('should not find the file', async () => {
    const r = new RuleWrapper(rule, ['error', { required: true }], fs);
    const reports = jest.spyOn(r, 'reports', 'get');
    const report = jest.spyOn(r, 'report');
    spyList.mockResolvedValueOnce(['bar.foo', 'barfoo.json', 'barfoo'] as any);

    const check = await checkFileName(r, { names, defaultName, getContent });
    expect(check).toBeInstanceOf(Function);
    expect(report).toHaveBeenCalledWith('presence', { fileName: 'foobar' });
    expect(reports).toHaveBeenCalled();
  });

  describe('fixer', () => {
    it('should create file if missing', async () => {
      const r = new RuleWrapper(rule, ['error', { required: true }], fs);
      spyList.mockResolvedValueOnce([]);
      spyWrite.mockResolvedValue();

      const fixer = await checkFileName(r, { names, defaultName, getContent });
      await fixer!();
      expect(spyWrite).toHaveBeenCalledWith(r.fs.toAbsolute('foobar'), '');
      expect(spyRename).not.toHaveBeenCalled();
    });

    it('should rename if wrong extension', async () => {
      const r = new RuleWrapper(rule, ['error'], fs);
      spyList.mockResolvedValueOnce(['foobar.json' as any]);
      spyRename.mockResolvedValue();

      const fixer = await checkFileName(r, { names, defaultName, getContent });
      await fixer!();
      expect(spyRename).toHaveBeenCalledWith(
        r.fs.toAbsolute('foobar.json'),
        'foobar'
      );
      expect(spyWrite).not.toHaveBeenCalled();
    });
  });
});
