import type { RuleInterface } from '../Rule';

type Messages = 'presence';
type Schema = { extension?: string };

const FILENAME = 'CHANGELOG';

export const rule: RuleInterface<Messages, Schema> = {
  name: 'base/require-changelog',
  docs: {
    description: `enforce the presence of a "${FILENAME}" file at root level`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: `Expected file "${FILENAME}" to exists.`,
  },

  schema: {
    type: 'object',
    properties: {
      extension: {
        type: 'string',
        enum: ['txt', ''],
        default: '',
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec(fs) {
    const list = await fs.listFiles('/');
    if (!exists) {
      this.report('presence');
    }
  },
};
