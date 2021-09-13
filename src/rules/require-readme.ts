import { checkFileNameWithExtension } from '../helpers';
import type { RuleInterface } from '../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string };

const FILENAME = 'README';

export const rule: RuleInterface<Messages, Schema> = {
  name: 'base/require-readme',

  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: ({ preferredName }) =>
      `Expected file "${preferredName}" to exists.`,
    extension: ({ fileName }) =>
      `Expected file "${fileName}" to have the correct extension.`,
  },

  schema: {
    type: 'object',
    properties: {
      extension: {
        type: 'string',
        enum: ['md', ''],
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec({ fs, report, options, getReport }) {
    const allowedExt = options.extension || '';
    const preferredName = `${FILENAME}${allowedExt ? `.${allowedExt}` : ''}`;

    return await checkFileNameWithExtension(
      { fs, report, getReport },
      { allowedExt, preferredName }
    );
  },
};
