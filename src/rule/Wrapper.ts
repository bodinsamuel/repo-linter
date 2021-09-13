import Ajv from 'ajv';

import type { FS } from '../fs';

import type {
  RuleInterface,
  Reported,
  Severity,
  Options,
  ExecReturn,
} from './types';

const ajv = new Ajv();

export class RuleWrapper<TMessage extends string, TSchema = never> {
  #rule: RuleInterface<TMessage>;
  #options: TSchema | undefined;
  #reported: Array<Reported<TMessage>> = [];
  #severity: Severity;

  constructor(rule: RuleInterface<TMessage>, options: Options<TSchema>) {
    this.#rule = rule;
    this.#severity = options[0];
    this.#options = options[1];
  }

  validate(): void {
    const { name, schema } = this.#rule;
    if (!schema) {
      if (this.#options && Object.keys(this.#options).length > 0) {
        throw new Error(
          `Passed options for rule "${name}", but no options are allowed.`
        );
      }
      return;
    }

    const validate = ajv.compile(schema);
    const isValid = validate(this.#options || {});
    if (!isValid) {
      throw new Error(
        `Given options for rule "${name}" are invalid:
        - schema: ${JSON.stringify(schema)}
        - options: ${JSON.stringify(this.#options)}
        - errors: ${JSON.stringify(validate.errors)}`
      );
    }
  }

  report(name: TMessage, data?: any): void {
    let message = this.#rule.messages[name];
    if (typeof message === 'function') {
      message = message(data);
    }
    this.#reported.push({ name, message, data });
  }

  async exec(fs: FS, fix: boolean): Promise<ExecReturn | Promise<ExecReturn>> {
    const fixer = await this.#rule.exec({
      fs,
      report: (name, data) => this.report(name, data),
      getReport: () => this.getReport(),
      options: (this.#options || {}) as never,
      severity: this.#severity,
    });

    if (fix && fixer) {
      await fixer();
    }
  }

  getName(): string {
    return this.#rule.name;
  }

  hasReport(): boolean {
    return this.#reported.length > 0;
  }

  getReport(): Array<Reported<TMessage>> {
    return this.#reported;
  }

  getSeverity(): Severity {
    return this.#severity;
  }
}
