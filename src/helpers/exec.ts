import type { ExecaChildProcess } from 'execa';
import execa from 'execa';

export function exec(
  command: string,
  options?: execa.Options
): ExecaChildProcess<string> {
  return execa.command(command, options);
}
