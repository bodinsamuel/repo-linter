import type { ExecReturn, RuleWrapper } from '../rule';

export async function checkFileNameWithExtension(
  params: RuleWrapper<'extension' | 'presence', any>,
  {
    extension,
    baseName,
    getContent,
  }: { extension: string; baseName: string; getContent: () => string }
): Promise<ExecReturn> {
  const list = await params.fs.listFiles('./');
  const fullName = `${baseName}${extension ? `.${extension}` : ''}`;

  let exists = false;
  for (const file of list) {
    if (!file.startsWith(baseName)) {
      continue;
    }

    if (fullName !== file) {
      params.report('extension', { fileName: file, extension });
      continue;
    }
    exists = true;
  }

  if (exists) {
    return;
  }

  const reported = params.reports;

  // If it does not exists but one file matched, we just change the extension
  if (reported.length === 1) {
    return async (): Promise<void> => {
      await params.fs.fileRename(reported[0]!.data.fileName, fullName);
    };
  }

  params.report('presence', { fullName });

  if (reported.length === 1) {
    // If it matched no other file we just create it
    return async (): Promise<void> => {
      await params.fs.fileWrite(`./${fullName}`, getContent());
    };
  }
}
