import type { JSONSchemaType } from 'ajv';

import type { FS } from '../fs';

export type Severity = 'error' | 'off' | 'warn';

export type Options<TSchema = never> = [Severity, TSchema] | [Severity];

export type Reported<TMessage extends string> = {
  name: TMessage;
  message: string;
  data?: any;
};

export type Fixer = () => Promise<void> | void;

export type ExecParams<TMessage extends string, TSchema = never> = {
  fs: FS;
  report: (name: TMessage, data?: any) => void;
  getReport: () => Array<Reported<TMessage>>;
  options: TSchema;
  severity: Severity;
};
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
    opts: ExecParams<TMessage, TSchema>
  ) => ExecReturn | Promise<ExecReturn>;
}
