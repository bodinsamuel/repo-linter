import type { ExecReturn, RuleWrapper } from '../rule';

type Schema = {
  required?: boolean;
  preferred?: string;
  [key: string]: any | undefined;
};

type Rule = RuleWrapper<'preferred' | 'presence', Schema>;
type Params = {
  names: string[];
  defaultName: string;
  getContent: () => string;
};

export async function checkFileName(
  rule: Rule,
  params: Params
): Promise<ExecReturn> {
  const list = await rule.fs.listFiles('./');
  const { getContent } = params;
  const { preferred, required }: Rule['options'] = {
    required: false,
    preferred: params.defaultName,
    ...(rule.options || {}),
  };

  let exists = false;
  for (const file of list) {
    if (file === preferred) {
      exists = true;
      continue;
    }

    if (params.names.includes(file)) {
      rule.report('preferred', { fileName: file, preferred });
    }
  }

  if (exists) {
    return;
  }

  const reported = rule.reports;

  // If it does not exists but one file matched, we just rename
  if (reported.length === 1) {
    return async (): Promise<void> => {
      await rule.fs.fileRename(reported[0]!.data.fileName, preferred);
    };
  }

  if (!required) {
    return;
  }

  rule.report('presence', { fileName: preferred });

  if (reported.length === 1) {
    // If it matched no other file we just create it
    return async (): Promise<void> => {
      await rule.fs.fileWrite(`./${preferred}`, getContent());
    };
  }
}
