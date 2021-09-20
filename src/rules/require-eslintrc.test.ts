import fsPromise from 'fs/promises';

import { FS } from '../fs';
import type { RuleInterface } from '../rule';
import { RuleWrapper } from '../rule';

import { def as ruleRaw } from './require-eslintrc';

const spy = jest.spyOn(fsPromise, 'readdir');
const fs = new FS({});
const rule = ruleRaw as RuleInterface<any>;

describe('eslintrc', () => {
  it('should report passed', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['.eslintrc'] as any);

    const check = await rule.exec(r);
    expect(check).toBeUndefined();
    expect(r.report).not.toHaveBeenCalled();
    expect(r.reports).toStrictEqual([]);
  });

  it('should report fail if file missing', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce([]);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('presence', {
      fullName: '.eslintrc',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { fullName: '.eslintrc' },
        message: 'Expected file ".eslintrc" to exists.',
        name: 'presence',
      },
    ]);
  });

  it('should report fail if file has wrong extension', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['.eslintrc.sh' as any]);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('extension', {
      extension: '',
      fileName: '.eslintrc.sh',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { extension: '', fileName: '.eslintrc.sh' },
        message:
          'Expected file ".eslintrc.sh" to have the correct extension (no extension).',
        name: 'extension',
      },
    ]);
  });
});
