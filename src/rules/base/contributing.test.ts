import fsPromise from 'fs/promises';

import { FS } from '../../fs';
import type { RuleInterface } from '../../rule';
import { RuleWrapper } from '../../rule';

import { def as ruleRaw } from './contributing';

const spy = jest.spyOn(fsPromise, 'readdir');
const fs = new FS({});
const rule = ruleRaw as RuleInterface<any, { required?: boolean }>;

describe('contributing', () => {
  it('should report passed', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['CONTRIBUTING.md'] as any);

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
      fileName: 'CONTRIBUTING.md',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { fileName: 'CONTRIBUTING.md' },
        message: 'Expected file "CONTRIBUTING.md" to exists.',
        name: 'presence',
      },
    ]);
  });

  it('should report fail if file has wrong extension', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['CONTRIBUTING' as any]);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('preferred', {
      preferred: 'CONTRIBUTING.md',
      fileName: 'CONTRIBUTING',
    });
    expect(r.reports).toStrictEqual([
      {
        data: { preferred: 'CONTRIBUTING.md', fileName: 'CONTRIBUTING' },
        message:
          'Expected file "CONTRIBUTING.md" to exists but found "CONTRIBUTING".',
        name: 'preferred',
      },
    ]);
  });
});
