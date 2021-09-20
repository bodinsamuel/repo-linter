import { checkFilePresence } from '../helpers';
import type { RuleInterface } from '../rule';

type Messages = 'presence';

const FILENAME = 'Dockerfile';

export const def: RuleInterface<Messages> = {
  name: 'base/require-dockerfile',

  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: `Expected file "${FILENAME}" to exists.`,
  },

  async exec(rule) {
    return await checkFilePresence(rule, {
      baseName: FILENAME,
      getContent: () => '',
    });
  },
};
