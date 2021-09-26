import { checkFilePresence } from '../../helpers';
import type { RuleInterface } from '../../rule';

type Messages = 'presence';

const FILENAME = '.github/workflows/*.yml';

export const def: RuleInterface<Messages> = {
  name: 'github/actions',

  docs: {
    description: `enforce the presence of a file matching the pattern "${FILENAME}".`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: `Expected file matching the pattern "${FILENAME}" to exists.`,
  },

  async exec(rule) {
    return await checkFilePresence(rule, {
      baseName: FILENAME,
      getContent: () => process.version.substr(1),
    });
  },
};
