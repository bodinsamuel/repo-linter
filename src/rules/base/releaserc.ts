import { checkFileNameWithExtension } from '../../helpers';
import type { RuleInterface } from '../../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string; required?: boolean };

const FILENAME = '.releaserc';
const CONTENT = JSON.stringify(
  {
    branches: 'master',
    verifyConditions: ['@semantic-release/github'],
    prepare: [
      {
        path: '@semantic-release/changelog',
        changelogFile: 'CHANGELOG.md',
      },
      '@semantic-release/npm',
      {
        path: '@semantic-release/git',
        assets: ['package.json', 'CHANGELOG.md'],
        message:
          // eslint-disable-next-line no-template-curly-in-string
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    publish: ['@semantic-release/github'],
    success: [],
    fail: [],
    npmPublish: false,
  },
  null,
  2
);

export const def: RuleInterface<Messages, Schema> = {
  name: 'base/releaserc',

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
        enum: ['json', 'js', 'yaml', 'yml', ''],
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
