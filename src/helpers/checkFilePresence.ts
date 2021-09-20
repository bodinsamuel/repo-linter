import type { ExecReturn, RuleWrapper } from '../rule';

export async function checkFilePresence(
  params: RuleWrapper<'presence', any>,
  { baseName, getContent }: { baseName: string; getContent: () => string }
): Promise<ExecReturn> {
  const exists = await params.fs.fileExists(baseName);
  if (exists) {
    return;
  }

  params.report('presence');

  if (!getContent) {
    return;
  }

  // We can create if we have a content
  return async (): Promise<void> => {
    await params.fs.fileWrite(`./${baseName}`, getContent());
  };
}
