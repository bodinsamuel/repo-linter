/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';

import type { Reporter } from './Reporter';
import type { RuleConstructor, Schema } from './Rule';
import type { FS } from './fs';

export interface Config {
  plugins?: string[];
  rules?: Record<string, Schema>;
  extends?: string[];
}

export class Runner {
  filePath;

  #rc?: string | void;
  #config?: Config;
  #registry = new Map<string, RuleConstructor<any>>();
  #reporter: Reporter;
  #fs: FS;

  constructor(opts: { filePath: string; reporter: Reporter; fs: FS }) {
    this.filePath = opts.filePath;
    this.#reporter = opts.reporter;
    this.#fs = opts.fs;
  }

  async run(): Promise<void> {
    await this.loadConfig();
    this.parseConfig();
    await this.autoRegister();
    await this.exec();
    this.#reporter.toCli();
  }

  async loadConfig(): Promise<void> {
    this.#rc = await this.#fs.fileLoad(this.filePath);
  }

  parseConfig(): void {
    if (!this.#rc) {
      throw new Error(`No config file loaded at "${this.filePath}"`);
    }
    if (this.#config) {
      throw new Error(`Config already loaded`);
    }

    let json: Config;
    try {
      json = JSON.parse(this.#rc);
    } catch (err) {
      throw new Error(`Invalid config, ${err}`);
    }

    const is = isConfig(json);
    if (!is) {
      throw new Error('Invalid config');
    }

    this.#config = json;
  }

  register(filePath: string): void {
    const TmpRule: RuleConstructor<any> = require(filePath).default;

    const tmp = new TmpRule(['error']);
    for (const name of ['getName', 'getMeta', 'exec']) {
      if (!(name in tmp)) {
        throw new Error(`Invalid rule in "${filePath}", missing "${name}"`);
      }
    }

    const name = tmp.getName();
    if (this.#registry.has(name)) {
      throw new Error(`Rule "${name}" already defined`);
    }

    this.#registry.set(name, TmpRule);
  }

  async exec(fs): Promise<void> {
    if (
      !this.#config ||
      !this.#config.rules ||
      Object.keys(this.#config.rules).length <= 0
    ) {
      throw new Error('No rules to executes');
    }

    for await (const [name, options] of Object.entries(this.#config.rules)) {
      if (!this.#registry.has(name)) {
        const list = Array.from(this.#registry.keys());
        throw new Error(
          `No rule exists with name "${name}". (rules: ${JSON.stringify(list)})`
        );
      }
      const RuleClass = this.#registry.get(name)!;
      const rule = new RuleClass(options);
      rule.validate();
      await rule.exec(this.#fs);

      if (rule.hasReport()) {
        this.#reporter.add(rule);
      }
    }
  }

  private async autoRegister(): Promise<void> {
    // Base plugin
    const files = await this.#fs.listFiles(path.join(__dirname, 'rules'));
    for (const file of files) {
      this.register(path.join(__dirname, 'rules', file));
    }

    if (this.#config?.extends && this.#config?.extends.length > 0) {
      const { rulesets } = require(path.join(__dirname, 'ruleset'));

      for (const name of this.#config.extends) {
        const split = name.split('/');
        if (split.length <= 1) {
          throw new Error(`Unknown extends ${name}`);
        }
        const ruleset = split[1];
        if (!(split[1] in rulesets)) {
          throw new Error(
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
}

function isConfig(rc: any): rc is Config {
  return typeof rc === 'object' && ('plugins' in rc || 'rules' in rc);
}
