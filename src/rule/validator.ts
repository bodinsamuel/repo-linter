import Ajv from 'ajv';
import type { JSONSchemaType } from 'ajv';

import type { RuleInterface } from './types';

export const schema: JSONSchemaType<
  Pick<RuleInterface<any>, 'docs' | 'messages' | 'name'>
> = {
  type: 'object',
  required: ['name', 'docs', 'messages'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
    },
    docs: {
      type: 'object',
      required: ['description', 'url'],
      additionalProperties: false,
      properties: {
        url: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
    },
    messages: {
      type: 'object',
      required: [],
      additionalProperties: true,
    },
  },
};

const ajv = new Ajv();
const validation = ajv.compile(schema);

export function validateRule(rule: any): rule is RuleInterface<any> {
  if (typeof rule === 'object') {
    const { name, docs, messages } = rule;
    const valid = validation({ name, docs, messages });
    if (valid) {
      return true;
    }
  }

  throw new Error(`Invalid rule:
    - object: ${JSON.stringify(rule)}
    - errors: ${JSON.stringify(validation.errors)}`);
}
