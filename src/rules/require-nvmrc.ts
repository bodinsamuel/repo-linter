import type { RuleInterface } from '../Rule';

type Messages = 'presence';

const FILENAME = '.nvmrc';

export const rule: RuleInterface<Messages> = {
  name: 'base/require-nvmrc',
  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: `Expected file "${FILENAME}" to exists.`,
  },
  async exec(fs) {
    const exists = await fs.fileExists(FILENAME);
    if (!exists) {
      this.report('presence');
    }
  },
};
