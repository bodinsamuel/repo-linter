import type { JSONSchemaType } from 'ajv';

import type { FS } from '../fs';

export type Severity = 'error' | 'off' | 'warn';

export type Options<TSchema = never> = [Severity, TSchema] | [Severity];

export type Reported = { message: string };

export interface RuleInterface<TMessage extends string, TSchema = never> {
  name: string;
  docs: {
    description: string;
    url: string;
  };
  messages: Record<TMessage, string>;
  schema?: JSONSchemaType<TSchema>;

  exec: (opts: {
    fs: FS;
    report: (name: TMessage) => void;
    options: TSchema;
    severity: Severity;
  }) => Promise<void>;
}
