import type { ExecParams, ExecReturn } from '../rule';

// eslint-disable-next-line consistent-return
export async function checkFileNameWithExtension(
  params: Pick<
    ExecParams<'extension' | 'presence', any>,
    'fs' | 'getReport' | 'report'
  >,
  { allowedExt, preferredName }: { allowedExt: string; preferredName: string }
): Promise<ExecReturn> {
  const list = await params.fs.listFiles('./');
  const fileWithoutext = preferredName.split('.')[0];

  let exists = false;
  for (const file of list) {
    if (!file.startsWith(fileWithoutext)) {
      continue;
    }

    if (!file.endsWith(`.${allowedExt}`)) {
      params.report('extension', { fileName: file });
      continue;
    }
    exists = true;
  }

  if (!exists) {
    const reported = params.getReport();

    // If it does not exists but one file matched, we just change the extension
    if (reported.length === 1) {
      return async (): Promise<void> => {
        await params.fs.fileRename(reported[0].data.fileName, preferredName);
      };
    }

    params.report('presence', { preferredName });

    if (reported.length === 1) {
      // If it matched no other file we just create it
      return async (): Promise<void> => {
        await params.fs.fileWrite(`./${preferredName}`, 'TODO getContent');
      };
    }
  }
}
