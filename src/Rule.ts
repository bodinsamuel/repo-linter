import type { JSONSchemaType } from 'ajv';
import Ajv from 'ajv';

import type { FS } from './fs';

// export interface MetaBase<TMessage extends string> {
//   docs: {
//     description: string;
//     url: string;
//   };
//   messages: Record<TMessage, string>;
// }
// export type Meta<TMessage extends string, TSchema = never> =
//   | MetaBase<TMessage>
//   | (MetaBase<TMessage> & {
//       schema: JSONSchemaType<TSchema>;
//     });

export type Severity = 'error' | 'off' | 'warn';

export type Schema = [Severity, Record<string, unknown>] | [Severity];

export type Reported = { message: string };

export type RuleConstructor<TMessage extends string, TSchema = never> = new (
  schema: Schema
) => RuleInterface<TMessage, TSchema>;

export interface RuleInterface<TMessage extends string, TSchema = never> {
  name: string;
  docs: {
    description: string;
    url: string;
  };
  messages: Record<TMessage, string>;
  schema: JSONSchemaType<TSchema>;

  report: (message: TMessage) => void;
  validate: () => void;
  exec: (fs: FS) => Promise<void>;

  // getMeta: () => Meta<TMessage, TSchema>;
  // getName: () => string;
  // getReport: () => Reported | undefined;
  // hasReport: () => boolean;
  // getSeverity: () => Severity;
}

const ajv = new Ajv();

export class Rule {
  #options: Record<string, unknown> | undefined;
  #reported?: Reported;
  #severity: Severity;

  constructor(options: Schema) {
    this.#severity = options[0];
    this.#options = options[1] || {};
  }

  validate(): void {
    const meta = this.getMeta();
    if (!('schema' in meta)) {
      if (this.#options && Object.keys(this.#options).length > 0) {
        throw new Error(
          `Passed options for rule "${this.getName()}", but no options are allowed.`
        );
      }
      return;
    }

    const validate = ajv.compile(meta.schema);
    const isValid = validate(this.#options || {});
    if (!isValid) {
      throw new Error(
        `Given options for rule "${this.getName()}" are invalid:
        - schema: ${JSON.stringify(meta.schema)}
        - options: ${JSON.stringify(this.#options)}
        - errors: ${JSON.stringify(validate.errors)}`
      );
    }
  }

  report(name: TMessage): void {
    const message = this.getMeta().messages[name];
    this.#reported = { message };
  }

  hasReport(): boolean {
    return Boolean(this.#reported);
  }

  getReport(): Reported | undefined {
    return this.#reported;
  }

  getSeverity(): Severity {
    return this.#severity;
  }
}
