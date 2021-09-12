import type { RuleInterface } from '../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string };

const FILENAME = 'CHANGELOG';
const REGEX = /^CHANGELOG/;

export const rule: RuleInterface<Messages, Schema> = {
  name: 'base/require-changelog',

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
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec({ fs, report, options }) {
    const allowedExt = options.extension;
    console.log('extension', allowedExt);
    const list = await fs.listFiles('./');

    for (const file of list) {
      if (!REGEX.test(file)) {
        continue;
      }

      if (!file.endsWith(`.${allowedExt}`)) {
        report('extension');
      }
      return;
    }

    report('presence');
  },
};
