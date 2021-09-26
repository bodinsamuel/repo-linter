import type { ExecReturn, RuleWrapper } from '../rule';

export async function checkFileNameWithExtension(
  rule: RuleWrapper<
    'extension' | 'presence',
    { required?: boolean; extension?: string; [key: string]: any | undefined }
  >,
  {
    baseName,
    getContent,
  }: {
    baseName: string;
    getContent: () => string;
  }
): Promise<ExecReturn> {
  const list = await rule.fs.listFiles('./');

  const { extension, required } = rule.options || {};
  const fullName = `${baseName}${extension ? `.${extension}` : ''}`;

  let exists = false;
  for (const file of list) {
    if (!file.startsWith(baseName)) {
      continue;
    }

    if (fullName !== file) {
      rule.report('extension', { fileName: file, extension });
      continue;
    }
    exists = true;
  }

  if (exists) {
    return;
  }

  const reported = rule.reports;

  // If it does not exists but one file matched, we just change the extension
  if (reported.length === 1) {
    return async (): Promise<void> => {
      await rule.fs.fileRename(reported[0]!.data.fileName, fullName);
    };
  }
  if (!required) {
    return;
  }

  rule.report('presence', { fullName });

  if (reported.length === 1) {
    // If it matched no other file we just create it
    return async (): Promise<void> => {
      await rule.fs.fileWrite(`./${fullName}`, getContent());
    };
  }
}
