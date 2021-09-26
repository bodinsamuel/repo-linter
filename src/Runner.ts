/* eslint-disable @typescript-eslint/no-var-requires */

import { RepoLinterError } from './Error';
import type { Reporter } from './Reporter';
import { RULES_PATH } from './constants';
import type { FS } from './fs';
import type { RuleInterface, Options } from './rule';
import { RuleWrapper, validateRule } from './rule';
import type { Rules, Rulesets } from './types';

export interface Config {
  plugins?: string[];
  rules?: Record<string, Options<any>>;
  extends?: string[];
}

export class Runner {
  #rcPath;
  #folder;
  #rc?: string | void;
  #config?: Config;
  #registry = new Map<string, RuleInterface<any, any>>();
  #reporter: Reporter;
  #fs: FS;
  #fix: boolean;

  constructor(opts: {
    rcPath: string;
    reporter: Reporter;
    fs: FS;
    fix: boolean;
  }) {
    this.#fs = opts.fs;
    this.#rcPath = opts.rcPath;
    this.#folder = this.#fs.base;
    this.#reporter = opts.reporter;
    this.#fix = opts.fix;
  }

  get rcPath(): string {
    return this.#rcPath;
  }

  get folder(): string {
    return this.#folder;
  }

  /**
   * Load, parse and execute.
   */
  async run(): Promise<void> {
    await this.loadConfig();
    this.parseConfig();
    await this.autoRegister();
    await this.exec();
  }

  /**
   * Load rc file.
   */
  async loadConfig(): Promise<void> {
    this.#rc = await this.#fs.fileLoad(this.#rcPath);
  }

  /**
   * Parse loaded rc file.
   */
  parseConfig(): void {
    if (!this.#rc) {
      throw new RepoLinterError(`No config file at "${this.#rcPath}"`);
    }
    if (this.#config) {
      throw new RepoLinterError(`Config already loaded.`);
    }

    let json: Config;
    try {
      json = JSON.parse(this.#rc);
    } catch (err) {
      if (err instanceof Error) {
        throw new RepoLinterError(
          `Invalid JSON ("${this.#rcPath}"): ${err.message}.`
        );
      }
      throw err;
    }

    const is = isConfig(json);
    if (!is) {
      throw new RepoLinterError(`Invalid config content "${this.#rcPath}"`);
    }

    this.#config = json;
  }

  /**
   * Execute rules against a repo.
   */
  async exec(): Promise<void> {
    if (
      !this.#config ||
      !this.#config.rules ||
      Object.keys(this.#config.rules).length <= 0
    ) {
      throw new RepoLinterError('No rules to executes.');
    }

    if (!(await this.#fs.dirExists(this.#fs.base))) {
      throw new RepoLinterError(`Folder "${this.#fs.base}" does not exist.`);
    }

    for await (const [name, options] of Object.entries(this.#config.rules)) {
      if (!this.#registry.has(name)) {
        const list = Array.from(this.#registry.keys());
        throw new RepoLinterError(
          `No rule exists with name "${name}". (rules: ${JSON.stringify(list)})`
        );
      }

      const def = this.#registry.get(name)!;
      const rule = new RuleWrapper(def, options, this.#fs);
      rule.validate();
      await rule.exec(this.#fix);

      this.#reporter.add(rule);
    }
  }

  /**
   * Register a rule file.
   */
  register(rule: RuleInterface<any, any>): void {
    if (!validateRule(rule)) {
      return;
    }

    if (this.#registry.has(rule.name)) {
      throw new RepoLinterError(`Rule "${rule.name}" already defined.`);
    }

    this.#registry.set(rule.name, rule);
  }

  private autoRegister(): void {
    const {
      rulesets,
      rules,
    }: {
      rulesets: Rulesets;
      rules: Rules;
    } = require(RULES_PATH);

    for (const file of Object.values(rules)) {
      this.register(file.def);
    }

    if (!this.#config?.extends || this.#config.extends.length <= 0) {
      return;
    }

    for (const name of this.#config.extends) {
      const split = name.split('/');
      if (split.length <= 1) {
        throw new Error(`Unknown extends ${name}`);
      }

      const ruleset = split[1]!;
      if (!(ruleset in rulesets)) {
        throw new RepoLinterError(
          `Unknown extends "${ruleset}" in plugin "${split[0]}" (${name})`
        );
      }

      this.#config.rules = {
        ...rulesets[ruleset],
        ...(this.#config?.rules || {}),
      };
    }
  }
}

function isConfig(rc: any): rc is Config {
  return typeof rc === 'object' && ('plugins' in rc || 'rules' in rc);
}
