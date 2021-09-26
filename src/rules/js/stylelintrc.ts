import { checkFileNameWithExtension } from '../../helpers';
import type { RuleInterface } from '../../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string; required?: boolean };

const FILENAME = '.stylelintrc';
const CONTENT = JSON.stringify(
  {
    extends: ['stylelint-config-recommended', 'stylelint-config-standard'],
  },
  null,
  2
);

export const def: RuleInterface<Messages, Schema> = {
  name: 'js/stylelintrc',

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
      required: {
        type: 'boolean',
        nullable: true,
      },
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
    return await checkFileNameWithExtension(rule, {
      baseName: FILENAME,
      getContent: () => CONTENT,
    });
  },
};
