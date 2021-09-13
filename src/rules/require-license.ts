import { checkFileNameWithExtension } from '../helpers';
import type { RuleInterface } from '../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension: string };

const FILENAME = 'LICENSE';

export const rule: RuleInterface<Messages, Schema> = {
  name: 'base/require-license',

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
        enum: ['txt', ''],
      },
    },
    required: ['extension'],
    additionalProperties: false,
  },

  async exec({ fs, report, options, getReport }) {
    const allowedExt = options.extension;
    const preferredName = `${FILENAME}${allowedExt ? `.${allowedExt}` : ''}`;

    return await checkFileNameWithExtension(
      { fs, report, getReport },
      { allowedExt, preferredName }
    );
  },
};
