import { checkFileNameWithExtension } from '../../helpers';
import type { RuleInterface } from '../../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string; required?: boolean; dotNotation?: boolean };

const FILENAME_DOT = '.renovaterc';
const FILENAME = 'renovate';
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
      dotNotation: {
        type: 'boolean',
        nullable: true,
      },
      extension: {
        type: 'string',
        enum: ['json', 'json5', ''],
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
