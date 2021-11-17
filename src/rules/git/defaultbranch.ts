import type { RuleInterface } from '../../rule';

type Messages = 'presence';
type Schema = { name?: string };

export const def: RuleInterface<Messages, Schema> = {
  name: 'git/defaultbranch',

  docs: {
    description: `enforce the name of a the default git branch`,
    url: 'https://github.com/algolia/repo-linter',
  },

  messages: {
    presence: ({ expected, current }) =>
      `Expected default branch to be "${expected}", found "${current}".`,
  },

  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  },

  async exec(rule) {
    const expected = rule.options?.name || 'master';
    const current = await rule.exec(
      'git symbolic-ref refs/remotes/origin/HEAD | sed s@^refs/remotes/origin/@@',
      { shell: true }
    );

    if (!current.stdout || current.stdout !== expected) {
      rule.report('presence', { expected, current: current.stdout });
    }
  },
};
