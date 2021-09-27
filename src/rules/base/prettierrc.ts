import { checkFileName } from '../../helpers';
import type { RuleInterface } from '../../rule';

type Messages = 'preferred' | 'presence';
type Schema = { preferred?: string; required?: boolean };

const FILENAME = '.prettierrc.json';
const NAMES = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.yml',
  '.prettierrc.yaml',
  '.prettierrc.json5',
  '.prettierrc.js',
  '.prettierrc.cjs',
  'prettier.config.js',
  'prettier.config.cjs',
  '.prettierrc.toml',
];
const CONTENT = JSON.stringify(
  {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    printWidth: 80,
  },
  null,
  2
);

export const def: RuleInterface<Messages, Schema> = {
  name: 'base/prettierrc',

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
