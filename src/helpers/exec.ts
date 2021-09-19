import type { ExecaChildProcess } from 'execa';
import execa from 'execa';

export function exec(command: string): ExecaChildProcess<string> {
  return execa.command(command);
}
