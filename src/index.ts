import path from 'path';

import yargs from 'yargs';

import { Reporter } from './Reporter';
import { Runner } from './Runner';
import { FILENAME } from './constants';
import { FS } from './fs';

const argv = yargs.usage('Lint a repository').options({
  config: {
    description: 'Path of the ".repolinterrc.json',
    requiresArg: false,
    demandOption: false,
    string: true,
  },
  folder: {
    description: 'Path of the repository to fix',
    requiresArg: false,
    demandOption: false,
    string: true,
  },
  fix: {
    description: 'Automatically fix problems',
    requiresArg: false,
    demandOption: false,
    boolean: true,
  },
}).argv;

(async (): Promise<void> => {
  const runner = new Runner({
    filePath: argv.config ? argv.config : path.join(__dirname, '..', FILENAME),
    reporter: new Reporter(),
    fs: new FS(argv.folder ? argv.folder : path.join(__dirname, '..')),
    fix: argv.fix === true,
  });
  await runner.run();
})();
