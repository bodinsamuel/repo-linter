import type { RuleInterface } from '../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension: string };

const FILENAME = 'LICENSE';
const REGEX = /^LICENSE/;

export const rule: RuleInterface<Messages, Schema> = {
  name: 'base/require-license',

  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: `Expected file "${FILENAME}" to exists.`,
    extension: `Expected file "${FILENAME}" to have the correct extension.`,
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

  async exec({ fs, report, options }) {
    const allowedExt = options.extension;
    const list = await fs.listFiles('./');
    console.log('extension', allowedExt, list);

    let exists = false;
    for (const file of list) {
      if (!REGEX.test(file)) {
        continue;
      }

      if (!file.endsWith(`.${allowedExt}`)) {
        report('extension');
        continue;
      }
      exists = true;
    }

    if (!exists) {
      report('presence');
    }
  },
};
