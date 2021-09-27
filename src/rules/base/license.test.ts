import fsPromise from 'fs/promises';

import { FS } from '../../fs';
import type { RuleInterface } from '../../rule';
import { RuleWrapper } from '../../rule';

import { def as ruleRaw } from './license';

const spy = jest.spyOn(fsPromise, 'readdir');
const fs = new FS({});
const rule = ruleRaw as RuleInterface<any, { required?: boolean }>;

describe('license', () => {
  it('should report passed', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['LICENSE.md'] as any);

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
      fileName: 'LICENSE.md',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { fileName: 'LICENSE.md' },
        message: 'Expected file "LICENSE.md" to exists.',
        name: 'presence',
      },
    ]);
  });

  it('should report fail if file has wrong extension', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['LICENSE' as any]);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('preferred', {
      preferred: 'LICENSE.md',
      fileName: 'LICENSE',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { preferred: 'LICENSE.md', fileName: 'LICENSE' },
        message: 'Expected file "LICENSE.md" to exists but found "LICENSE".',
        name: 'preferred',
      },
    ]);
  });
});
