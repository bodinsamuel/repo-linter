import { checkFileNameWithExtension } from '../helpers';
import type { RuleInterface } from '../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string };

const FILENAME = '.prettierrc';
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
  name: 'base/require-prettierrc',

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
        enum: ['json', 'json5', 'yaml', 'yml', 'js', 'cjs', 'toml', ''],
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec(rule) {
    const extension = rule.options?.extension || '';

    return await checkFileNameWithExtension(rule, {
      baseName: FILENAME,
      extension,
      getContent: () => CONTENT,
    });
  },
};
