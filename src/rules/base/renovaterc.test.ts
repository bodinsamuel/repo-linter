import fsPromise from 'fs/promises';

import { FS } from '../../fs';
import type { RuleInterface } from '../../rule';
import { RuleWrapper } from '../../rule';

import { def as ruleRaw } from './renovaterc';

const spy = jest.spyOn(fsPromise, 'readdir');
const fs = new FS({});
const rule = ruleRaw as RuleInterface<any, { required?: boolean }>;

describe('renovaterc', () => {
  it('should report passed', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['.renovaterc.json'] as any);

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
      fileName: '.renovaterc.json',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { fileName: '.renovaterc.json' },
        message: 'Expected file ".renovaterc.json" to exists.',
        name: 'presence',
      },
    ]);
  });

  it('should report fail if file has wrong extension', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['.renovaterc' as any]);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('preferred', {
      preferred: '.renovaterc.json',
      fileName: '.renovaterc',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { preferred: '.renovaterc.json', fileName: '.renovaterc' },
        message:
          'Expected file ".renovaterc.json" to exists but found ".renovaterc".',
        name: 'preferred',
      },
    ]);
  });
});
