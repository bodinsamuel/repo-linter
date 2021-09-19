import { checkFileNameWithExtension } from '../helpers';
import type { RuleInterface } from '../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string };

const FILENAME = '.prettierrc';

export const rule: RuleInterface<Messages, Schema> = {
  name: 'base/require-prettierrc',

  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: ({ fullName }) => `Expected file "${fullName}" to exists.`,
    extension: ({ fileName }) =>
      `Expected file "${fileName}" to have the correct extension.`,
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

  async exec({ fs, report, options, getReport }) {
    const extension = options.extension || '';

    return await checkFileNameWithExtension(
      { fs, report, getReport },
      { baseName: FILENAME, extension }
    );
  },
};
