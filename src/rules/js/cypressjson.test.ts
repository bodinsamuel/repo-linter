import fsPromise from 'fs/promises';

import { FS } from '../../fs';
import type { RuleInterface } from '../../rule';
import { RuleWrapper } from '../../rule';

import { def as ruleRaw } from './cypressjson';

const spy = jest.spyOn(fsPromise, 'access');
const fs = new FS({});
const rule = ruleRaw as RuleInterface<any, { required?: boolean }>;

describe('cypress.json', () => {
  it('should report passed', async () => {
    const r = new RuleWrapper(rule, ['error'], fs);

    jest.spyOn(r, 'report');
    spy.mockResolvedValueOnce(['cypress.json'] as any);

    const check = await rule.exec(r);
    expect(check).toBeUndefined();
    expect(r.report).not.toHaveBeenCalled();
    expect(r.reports).toStrictEqual([]);
  });

  it('should report fail if file missing', async () => {
    const r = new RuleWrapper(rule, ['error', { required: true }], fs);

    jest.spyOn(r, 'report');
    spy.mockRejectedValueOnce(false as any);

    const check = await rule.exec(r);
    expect(check).toBeInstanceOf(Function);
    expect(r.report).toHaveBeenCalledWith('presence');
    expect(r.reports).toStrictEqual([
      {
        data: {},
        message: 'Expected file "cypress.json" to exists.',
        name: 'presence',
      },
    ]);
  });
});
