import path from 'path';

import chalk from 'chalk';
import yargs from 'yargs';

import { RepoLinterError } from './Error';
import { Reporter } from './Reporter';
import { Runner } from './Runner';
import { FILENAME } from './constants';
import { FS } from './fs';

const argv = yargs
  .usage('Lint a repository')
  .example([
    ['repo-linter -c ~/.repolinterrc.json -r ~/my-repository', ''],
    ['repo-linter --fix', ''],
  ])
  .strict(true)
  .option('config', {
    description: 'Path of the ".repolinterrc.json"',
    requiresArg: true,
    demandOption: false,
    string: true,
    alias: 'c',
  })
  .option('repo', {
    description: 'Path of the repository to fix',
    requiresArg: true,
    demandOption: false,
    string: true,
    alias: 'r',
  })
  .option('fix', {
    description: 'Automatically fix problems',
    requiresArg: false,
    demandOption: false,
    boolean: true,
  }).argv;

(async (): Promise<void> => {
  const reporter = new Reporter();
  const folder = argv.repo ? argv.repo : path.join(__dirname, '..');
  const runner = new Runner({
    rcPath: argv.config ? argv.config : path.join(__dirname, '..', FILENAME),
    reporter,
    fs: new FS({ base: folder }),
    fix: argv.fix === true,
  });

  try {
    await runner.run();
  } catch (err) {
    if (err instanceof RepoLinterError) {
      // eslint-disable-next-line no-console
      console.log(chalk.redBright('[ERROR]'), err.message);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
  }

  const passed = reporter.toCli(runner);

  // eslint-disable-next-line no-process-exit
  process.exit(passed ? 0 : 1);
})();
