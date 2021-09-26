import { checkFileNameWithExtension } from '../../helpers';
import type { RuleInterface } from '../../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string; required?: boolean };

const FILENAME = 'CONTRIBUTING';
const CONTENT = `# Contributing

## Dev Setup

\`\`\`sh
# install

# build

# test

# lint
\`\`\`

## Releasing
\`\`\`sh
\`\`\``;

export const def: RuleInterface<Messages, Schema> = {
  name: 'base/contributing',

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
        enum: ['md', ''],
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec(rule) {
    const extension = rule.options?.extension || '';

    return await checkFileNameWithExtension(rule, {
      required: Boolean(rule.options?.required),
      extension,
      baseName: FILENAME,
      getContent: () => CONTENT,
    });
  },
};
