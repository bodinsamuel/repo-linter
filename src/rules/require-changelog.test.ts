import fsPromise from 'fs/promises';

import { FS } from '../fs';
import type { RuleInterface } from '../rule';
import { RuleWrapper } from '../rule';

import { def as ruleRaw } from './require-changelog';

const spy = jest.spyOn(fsPromise, 'readdir');
const fs = new FS({});
const rule = ruleRaw as RuleInterface<any>;

describe('changelog', () => {
  it('should report passed', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['CHANGELOG'] as any);

    const check = await rule.exec(r);
    expect(check).toBeUndefined();
    expect(r.report).not.toHaveBeenCalled();
  });

  it('should report fail for presence', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce([]);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('presence', {
      fullName: 'CHANGELOG',
    });
  });
});
