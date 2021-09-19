export const rulesets = {
  recommended: {
    'base/require-changelog': ['error', { extension: 'md' }],
    'base/require-contributing': ['error', { extension: 'md' }],
    'base/require-envexample': ['error'],
    'base/require-gitignore': ['error'],
    'base/require-license': ['error', { extension: '' }],
    'base/require-prettierignore': ['error'],
    'base/require-prettierrc': ['error', { extension: 'json' }],
    'base/require-readme': ['error', { extension: 'md' }],
    'base/require-renovaterc': ['error', { extension: 'json' }],
  },
  js: {
    'base/require-nvmrc': ['error'],
    'base/require-packagejson': ['error'],
    'base/require-releaserc': ['error', { extension: 'json' }],
    'base/require-tsconfigjson': ['error'],
    'base/require-eslintignore': ['error'],
    'base/require-eslintrc': ['error', { extension: 'json' }],
  },
  'js-front': {
    'base/require-stylelintrc': ['error', { extension: 'json' }],
  },
  'js-back': {
    'base/require-dockerfile': ['error'],
    'base/require-dockerignore': ['error'],
  },
};
