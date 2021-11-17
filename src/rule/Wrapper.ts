import Ajv from 'ajv';
import type { ExecaChildProcess } from 'execa';
import execa from 'execa';

import { RepoLinterError } from '../Error';
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
  #fs;
  #rule: RuleInterface<TMessage, TSchema>;
  #options: TSchema;
  #reported: Array<Reported<TMessage>> = [];
  #severity: Severity;

  constructor(
    rule: RuleInterface<TMessage, TSchema>,
    options: Options<TSchema>,
    fs: FS
  ) {
    this.#rule = rule;
    this.#severity = options[0];
    this.#options = options[1]!;
    this.#fs = fs;
  }

  validate(): void {
    const { name, schema } = this.#rule;
    if (!schema) {
      if (this.#options && Object.keys(this.#options).length > 0) {
        throw new RepoLinterError(
          `Options have been specified for rule "${name}", but no options are allowed.`
        );
      }
      return;
    }

    const validate = ajv.compile(schema);
    const isValid = validate(this.#options || {});
    if (!isValid) {
      throw new RepoLinterError(
        `Given options for rule "${name}" are invalid:
        - schema: ${JSON.stringify(schema)}
        - options: ${JSON.stringify(this.#options)}
        - errors: ${JSON.stringify(validate.errors)}`
      );
    }
  }

  report(name: TMessage, data: any = {}): void {
    let message = this.#rule.messages[name];
    if (typeof message === 'function') {
      message = message(data);
    }
    this.#reported.push({ name, message, data });
  }

  exec(command: string, options?: execa.Options): ExecaChildProcess<string> {
    return execa.command(command, {
      cwd: this.#fs.base,
      ...options,
    });
  }

  async run(fix: boolean): Promise<ExecReturn | Promise<ExecReturn>> {
    const fixer = await this.#rule.exec(this as any); // I don't get it

    if (fix && fixer) {
      await fixer();

      // Clear everything
      this.#reported.splice(0);

      // Try again if there is no error anymore it's fine
      // otherwise it will report the second error
      await this.#rule.exec(this as any); // I don't get it
    }
  }

  get name(): string {
    return this.#rule.name;
  }

  get fs(): FS {
    return this.#fs;
  }

  get options(): TSchema | undefined {
    return this.#options;
  }

  get reports(): Array<Reported<TMessage>> {
    return this.#reported;
  }

  get severity(): Severity {
    return this.#severity;
  }

  hasReport(): boolean {
    return this.#reported.length > 0;
  }
}
