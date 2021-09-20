import { checkFileNameWithExtension } from '../helpers';
import type { RuleInterface } from '../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string };

const FILENAME = '.eslintrc';
const CONTENT = JSON.stringify(
  {
    extends: ['algolia', 'algolia/jest', 'algolia/typescript'],
    parser: '@typescript-eslint/parser',
    plugins: ['jest'],
    rules: {},
    overrides: [],
  },
  null,
  2
);

export const def: RuleInterface<Messages, Schema> = {
  name: 'base/require-eslintrc',

  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: ({ fullName }) => `Expected file "${fullName}" to exists.`,
    extension: ({ fileName, extension }) =>
      `Expected file "${fileName}" to have the correct extension (${
        extension ? extension : 'no extension'
      }).`,
  },

  schema: {
    type: 'object',
    properties: {
      extension: {
        type: 'string',
        enum: ['json', 'yaml', 'yml', 'js', 'cjs', ''],
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec(rule) {
    const extension = rule.options?.extension || '';

    return await checkFileNameWithExtension(rule, {
      extension,
      baseName: FILENAME,
      getContent: () => CONTENT,
    });
  },
};
