import { checkFileNameWithExtension } from '../helpers';
import type { RuleInterface } from '../rule';

type Messages = 'extension' | 'presence';
type Schema = { extension?: string };

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
  name: 'base/require-releaserc',

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
    const extension = rule.options?.extension || '';

    return await checkFileNameWithExtension(rule, {
      extension,
      baseName: FILENAME,
      getContent: () => CONTENT,
    });
  },
};
