import type { Rulesets } from '../types';

import * as changelog from './base/changelog';
import * as contributing from './base/contributing';
import * as envexample from './base/envexample';
import * as gitignore from './base/gitignore';
import * as license from './base/license';
import * as prettierignore from './base/prettierignore';
import * as prettierrc from './base/prettierrc';
import * as readme from './base/readme';
import * as releaserc from './base/releaserc';
import * as renovaterc from './base/renovaterc';
import * as dockerfile from './docker/dockerfile';
import * as dockerignore from './docker/dockerignore';
import * as actions from './github/actions';
import * as eslintignore from './js/eslintignore';
import * as eslintrc from './js/eslintrc';
import * as nvmrc from './js/nvmrc';
import * as packagejson from './js/packagejson';
import * as stylelintrc from './js/stylelintrc';
import * as tsconfigjson from './js/tsconfigjson';

export const rulesets: Rulesets = {
  recommended: {
    'base/changelog': ['error', { extension: 'md' }],
    'base/contributing': ['error', { extension: 'md' }],
    'base/envexample': ['error'],
    'base/gitignore': ['error'],
    'base/license': ['error', { extension: '' }],
    'base/prettierignore': ['error'],
    'base/prettierrc': ['error', { extension: 'json' }],
    'base/readme': ['error', { extension: 'md' }],
    'base/releaserc': ['error', { extension: 'json' }],
    'base/renovaterc': ['warn', { extension: 'json' }],
  },
  js: {
    'js/eslintignore': ['error'],
    'js/eslintrc': ['error', { extension: 'json' }],
    'js/nvmrc': ['error'],
    'js/packagejson': ['error'],
    'js/tsconfigjson': ['error'],
  },
  'js-front': {
    'js/stylelintrc': ['error', { extension: 'json' }],
  },
  'js-back': {
    'docker/dockerfile': ['error'],
    'docker/dockerignore': ['error'],
  },
};

export const rules = {
  changelog,
  contributing,
  envexample,
  gitignore,
  license,
  prettierignore,
  prettierrc,
  readme,
  releaserc,
  renovaterc,
  dockerfile,
  dockerignore,
  actions,
  eslintignore,
  eslintrc,
  nvmrc,
  packagejson,
  stylelintrc,
  tsconfigjson,
};
