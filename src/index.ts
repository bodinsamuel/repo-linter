import path from 'path';

import { Reporter } from './Reporter';
import { Runner } from './Runner';
import { FILENAME } from './constants';
import { FS } from './fs';

(async (): Promise<void> => {
  const runner = new Runner({
    filePath: path.join(__dirname, '..', FILENAME),
    reporter: new Reporter(),
    fs: new FS(path.join(__dirname, '..')),
  });
  await runner.run();
})();
