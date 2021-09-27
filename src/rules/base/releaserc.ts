import { checkFileName } from '../../helpers';
import type { RuleInterface } from '../../rule';

type Messages = 'preferred' | 'presence';
type Schema = { preferred?: string; required?: boolean };

const FILENAME = '.releaserc.json';
const NAMES = [
  '.releaserc',
  '.releaserc.json',
  '.releaserc.yaml',
  '.releaserc.yml',
  '.releaserc.js',
  'release.config.js',
];
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
    presence: ({ fileName }) => `Expected file "${fileName}" to exists.`,
    preferred: ({ fileName, preferred }) => {
      return `Expected file "${preferred}" to exists but found "${fileName}".`;
    },
  },

  schema: {
    type: 'object',
    properties: {
      required: {
        type: 'boolean',
        nullable: true,
      },
      preferred: {
        type: 'string',
        enum: NAMES,
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec(rule) {
    return await checkFileName(rule, {
      names: NAMES,
      defaultName: FILENAME,
      getContent: () => CONTENT,
    });
  },
};
