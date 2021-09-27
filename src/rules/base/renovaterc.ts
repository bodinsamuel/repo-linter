import { checkFileName } from '../../helpers';
import type { RuleInterface } from '../../rule';

type Messages = 'preferred' | 'presence';
type Schema = { preferred?: string; required?: boolean };

const FILENAME = '.renovaterc.json';
const NAMES = [
  '.renovaterc.json',
  '.renovaterc',
  'renovate.json',
  'renovate.json5',
];
const CONTENT = JSON.stringify(
  {
    extends: ['config:js-app', 'algolia'],
  },
  null,
  2
);

export const def: RuleInterface<Messages, Schema> = {
  name: 'base/renovaterc',

  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: ({ fileName }) => `Expected file "${fileName}" to exists.`,
    preferred: ({ fileName, preferred }) => {
      return `Expected file "${preferred}" to exists but found "${fileName}".`;
    },
  },

  schema: {
    type: 'object',
    properties: {
      required: {
        type: 'boolean',
        nullable: true,
      },
      preferred: {
        type: 'string',
        enum: NAMES,
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec(rule) {
    return await checkFileName(rule, {
      names: NAMES,
      defaultName: FILENAME,
      getContent: () => CONTENT,
    });
  },
};
