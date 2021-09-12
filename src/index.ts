import path from 'path';

import { Reporter } from './Reporter';
import { Runner } from './Runner';
import { FILENAME } from './constants';

(async (): Promise<void> => {
  const runner = new Runner({
    filePath: path.join(__dirname, '..', FILENAME),
    reporter: new Reporter(),
  });
  await runner.run();
})();
