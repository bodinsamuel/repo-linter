import fsPromise from 'fs/promises';

import { FS } from '../../fs';
import type { RuleInterface } from '../../rule';
import { RuleWrapper } from '../../rule';

import { def as ruleRaw } from './stylelintrc';

const spy = jest.spyOn(fsPromise, 'readdir');
const fs = new FS({});
const rule = ruleRaw as RuleInterface<any, { required?: boolean }>;

describe('stylelintrc', () => {
  it('should report passed', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['.stylelintrc.json'] as any);

    const check = await rule.exec(r);
    expect(check).toBeUndefined();
    expect(r.report).not.toHaveBeenCalled();
    expect(r.reports).toStrictEqual([]);
  });

  it('should report fail if file missing', async () => {
    const r = new RuleWrapper(rule, ['error', { required: true }], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce([]);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('presence', {
      fileName: '.stylelintrc.json',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { fileName: '.stylelintrc.json' },
        message: 'Expected file ".stylelintrc.json" to exists.',
        name: 'presence',
      },
    ]);
  });

  it('should report fail if file has wrong extension', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['.stylelintrc' as any]);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('preferred', {
      preferred: '.stylelintrc.json',
      fileName: '.stylelintrc',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { preferred: '.stylelintrc.json', fileName: '.stylelintrc' },
        message:
          'Expected file ".stylelintrc.json" to exists but found ".stylelintrc".',
        name: 'preferred',
      },
    ]);
  });
});
