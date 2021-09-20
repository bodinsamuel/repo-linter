import fsPromise from 'fs/promises';

import { FS } from '../fs';
import type { RuleInterface } from '../rule';
import { RuleWrapper } from '../rule';

import { checkFileNameWithExtension } from './checkFileNameWithExtension';

const spy = jest.spyOn(fsPromise, 'readdir');
const fs = new FS({});
const baseName = 'foobar';
const getContent = (): string => '';
const rule: RuleInterface<'extension' | 'presence', never> = {
  name: 'foobar',
  docs: {
    description: '',
    url: '',
  },
  messages: {
    extension: '',
    presence: '',
  },
  exec: () => {},
};

describe('checkFileNameWithExtension', () => {
  it('should find the file with the correct name', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);
    const reports = jest.spyOn(r, 'reports', 'get');
    const report = jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['foobar'] as any);

    const check = await checkFileNameWithExtension(r, {
      extension: '',
      baseName,
      getContent,
    });
    expect(check).toBeUndefined();
    expect(report).not.toHaveBeenCalled();
    expect(reports).not.toHaveBeenCalled();
  });

  it('should find the file with the correct extension', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);
    const reports = jest.spyOn(r, 'reports', 'get');
    const report = jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['foobar.txt'] as any);

    const check = await checkFileNameWithExtension(r, {
      extension: 'txt',
      baseName,
      getContent,
    });
    expect(check).toBeUndefined();
    expect(report).not.toHaveBeenCalled();
    expect(reports).not.toHaveBeenCalled();
  });

  it('should find the file and report incorrect extension', async () => {
    const r = new RuleWrapper<'extension'>(rule, ['error'], fs);
    const reports = jest.spyOn(r, 'reports', 'get');
    const report = jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['foobar.txt'] as any);

    const check = await checkFileNameWithExtension(r, {
      extension: '',
      baseName,
      getContent,
    });
    expect(check).toBeInstanceOf(Function);
    expect(report).toHaveBeenCalledWith('extension', {
      extension: '',
      fileName: 'foobar.txt',
    });
    expect(reports).toHaveBeenCalled();
  });

  it('should report multiple incorrect extension', async () => {
    const r = new RuleWrapper<'extension'>(rule, ['error'], fs);
    const report = jest.spyOn(r, 'report');

    spy.mockResolvedValueOnce(['foobar.txt', 'foobar.json'] as any);

    const check = await checkFileNameWithExtension(r, {
      extension: '',
      baseName,
      getContent,
    });
    expect(report).toHaveBeenCalledTimes(3);
    expect(check).toBeUndefined();
  });

  it('should not find the file', async () => {
    const r = new RuleWrapper<'extension'>(rule, ['error'], fs);
    const reports = jest.spyOn(r, 'reports', 'get');
    const report = jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['bar.foo', 'barfoo.json', 'barfoo'] as any);

    const check = await checkFileNameWithExtension(r, {
      extension: '',
      baseName,
      getContent,
    });
    expect(check).toBeInstanceOf(Function);
    expect(report).toHaveBeenCalledWith('presence', { fullName: 'foobar' });
    expect(reports).toHaveBeenCalled();
  });
});