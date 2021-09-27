import { checkFilePresence } from '../../helpers';
import type { RuleInterface } from '../../rule';

type Messages = 'presence';
type Schema = { required?: boolean };

const FILENAME = 'bundlesize.config.json';

export const def: RuleInterface<Messages, Schema> = {
  name: 'js/bundlesizeconfigjson',

  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: `Expected file "${FILENAME}" to exists.`,
  },

  schema: {
    type: 'object',
    properties: {
      required: {
        type: 'boolean',
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec(rule) {
    return await checkFilePresence(rule, {
      baseName: FILENAME,
      getContent: () => JSON.stringify({}),
    });
  },
};
