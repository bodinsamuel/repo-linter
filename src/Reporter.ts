/* eslint-disable no-console */
import chalk from 'chalk';

import type { Runner } from './Runner';
import type { RuleWrapper } from './rule';

export class Reporter {
  #messages: Array<{ rule: RuleWrapper<any, any> }> = [];

  #rulesSuccess = 0;
  #rulesTotal = 0;
  #rulesError = 0;
  #rulesWarn = 0;

  add(rule: RuleWrapper<any, any>): void {
    this.#messages.push({ rule });
  }

  /**
   * Output to CLI.
   */
  toCli(runner: Runner): boolean {
    this.#rulesTotal = this.#messages.length;

    console.group(chalk.gray(`Linting`), chalk.dim.underline(runner.folder));
    console.log('');

    for (const msg of this.#messages) {
      const name = msg.rule.name;
      const reps = msg.rule.reports;
      const sev = msg.rule.severity;
      if (reps.length <= 0) {
        this.#rulesSuccess += 1;
        continue;
      }
      this.#rulesError += 1;

      console.group(chalk.gray(name));
      for (const rep of reps) {
        if (sev === 'error') {
          console.log(chalk.redBright('error'), chalk.white(rep.message));
        } else if (sev === 'warn') {
          this.#rulesWarn += 1;
          console.log(chalk.yellow('warn'), chalk.white(rep.message));
        }
      }
      console.groupEnd();
      console.log('');
    }
    console.groupEnd();

    console.log(chalk.bold('Rules:'), this.getRulesReport().join(', '));

    return this.#rulesError <= 0;
  }

  private getRulesReport(): string[] {
    const out = [];
    if (this.#rulesError) {
      out.push(chalk.redBright(`${this.#rulesError} failed`));
    }
    if (this.#rulesSuccess) {
      out.push(chalk.green(`${this.#rulesSuccess} passed`));
    }
    if (this.#rulesWarn) {
      out.push(chalk.yellow(`${this.#rulesWarn} warned`));
    }
    out.push(chalk.gray(`${this.#rulesTotal} total`));

    return out;
  }
}
