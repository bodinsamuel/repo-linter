import type { RuleInterface } from '../../rule';

type Messages = 'presence';
type Schema = { required?: boolean };

const FILENAME = 'package.json';

export const def: RuleInterface<Messages, Schema> = {
  name: 'js/packagejson',

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
      required: {
        type: 'boolean',
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec(rule) {
    const exists = await rule.fs.fileExists(FILENAME);
    if (exists) {
      return;
    }

    rule.report('presence');
    return async (): Promise<void> => {
      await rule.exec(
        'yarn set version berry && yarn init -p -w && yarn config set nodeLinker "node-modules" && yarn install',
        {
          shell: true,
        }
      );
    };
  },
};
