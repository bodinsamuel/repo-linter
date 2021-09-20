import fsPromise from 'fs/promises';

import { FS } from '../fs';
import type { RuleInterface } from '../rule';
import { RuleWrapper } from '../rule';

import { def as ruleRaw } from './require-dockerfile';

const spy = jest.spyOn(fsPromise, 'access');
const fs = new FS({});
const rule = ruleRaw as RuleInterface<any>;

describe('dockerfile', () => {
  it('should report passed', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(true as any);

    const check = await rule.exec(r);
    expect(check).toBeUndefined();
    expect(r.report).not.toHaveBeenCalled();
    expect(r.reports).toStrictEqual([]);
  });

  it('should report fail if file missing', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockRejectedValueOnce(false as any);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('presence');
    expect(r.reports).toStrictEqual([
      {
        data: {},
        message: 'Expected file "Dockerfile" to exists.',
        name: 'presence',
      },
    ]);
  });
});
