/* eslint-disable no-console */
import chalk from 'chalk';

import type { RuleInterface } from './Rule';

export class Reporter {
  #messages: Array<{ rule: RuleInterface<any> }> = [];

  add(rule: RuleInterface<any>): void {
    this.#messages.push({ rule });
  }

  toCli(): void {
    if (this.#messages.length <= 0) {
      console.log('Done');
      return;
    }

    for (const msg of this.#messages) {
      const name = msg.rule.getName();
      const rep = msg.rule.getReport()!;
      const sev = msg.rule.getSeverity();

      if (sev === 'error') {
        console.log(chalk.red('error'), chalk.white(rep.message));
      } else if (sev === 'warn') {
        console.log(chalk.yellow('warn'), chalk.white(rep.message));
      }

      console.log(`       ${chalk.gray(name)}`);
    }
  }
}
