import type { JSONSchemaType } from 'ajv';

import type { RuleWrapper } from './Wrapper';

export type Severity = 'error' | 'off' | 'warn';

export type Options<TSchema = never> = [Severity, TSchema] | [Severity];

export type Reported<TMessage extends string> = {
  name: TMessage;
  message: string;
  data?: any;
};

export type Fixer = () => Promise<void> | void;

export type ExecReturn = Fixer | void;

export interface RuleInterface<TMessage extends string, TSchema = never> {
  name: string;
  docs: {
    description: string;
    url: string;
  };
  messages: Record<TMessage, string | ((data?: any) => string)>;
  schema?: JSONSchemaType<TSchema>;

  exec: (
    wrapper: RuleWrapper<TMessage, TSchema>
  ) => ExecReturn | Promise<ExecReturn>;
}
