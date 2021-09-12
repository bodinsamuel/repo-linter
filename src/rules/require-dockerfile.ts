import type { RuleInterface } from '../Rule';

type Messages = 'presence';

const FILENAME = 'Dockerfile';

export const rule: RuleInterface<Messages> = {
  name: 'base/require-dockerfile',
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
