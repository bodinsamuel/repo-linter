import { exec } from '../helpers';
import type { RuleInterface } from '../rule';

type Messages = 'presence';

const FILENAME = 'tsconfig.json';

export const def: RuleInterface<Messages> = {
  name: 'base/require-tsconfigjson',

  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: `Expected file "${FILENAME}" to exists.`,
  },

  async exec(rule) {
    const exists = await rule.fs.fileExists(FILENAME);
    if (exists) {
      return;
    }

    rule.report('presence');
    return async (): Promise<void> => {
      await exec('yarn tsc --init');
    };
  },
};
