import fsPromise from 'fs/promises';

import { FS } from '../fs';
import type { RuleInterface } from '../rule';
import { RuleWrapper } from '../rule';

import { def as ruleRaw } from './require-stylelintrc';

const spy = jest.spyOn(fsPromise, 'readdir');
const fs = new FS({});
const rule = ruleRaw as RuleInterface<any>;

describe('stylelintrc', () => {
  it('should report passed', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['.stylelintrc'] as any);

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
      fullName: '.stylelintrc',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { fullName: '.stylelintrc' },
        message: 'Expected file ".stylelintrc" to exists.',
        name: 'presence',
      },
    ]);
  });

  it('should report fail if file has wrong extension', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['.stylelintrc.sh' as any]);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('extension', {
      extension: '',
      fileName: '.stylelintrc.sh',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { extension: '', fileName: '.stylelintrc.sh' },
        message:
          'Expected file ".stylelintrc.sh" to have the correct extension (no extension).',
        name: 'extension',
      },
    ]);
  });
});
