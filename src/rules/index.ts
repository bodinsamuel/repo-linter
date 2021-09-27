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
import * as cypressjson from './js/cypressjson';
import * as eslintignore from './js/eslintignore';
import * as eslintrc from './js/eslintrc';
import * as nvmrc from './js/nvmrc';
import * as packagejson from './js/packagejson';
import * as stylelintrc from './js/stylelintrc';
import * as tsconfigjson from './js/tsconfigjson';

export const rulesets: Rulesets = {
  recommended: {
    'base/changelog': ['error', { extension: 'md', required: true }],
    'base/contributing': ['error', { extension: 'md', required: true }],
    'base/envexample': ['error'],
    'base/gitignore': ['error', { required: true }],
    'base/license': ['error', { extension: '', required: true }],
    'base/prettierignore': ['error', { required: false }],
    'base/prettierrc': [
      'error',
      { extension: 'json', required: true, dotNotation: true },
    ],
    'base/readme': ['error', { extension: 'md', required: true }],
    'base/releaserc': ['error', { extension: 'json', required: true }],
    'base/renovaterc': [
      'warn',
      { extension: 'json', required: true, dotNotation: true },
    ],
  },
  js: {
    'js/eslintignore': ['error', { required: false }],
    'js/eslintrc': ['error', { extension: 'json', required: true }],
    'js/nvmrc': ['error', { required: true }],
    'js/packagejson': ['error', { required: true }],
    'js/tsconfigjson': ['error', { required: true }],
  },
  'js-front': {
    'js/stylelintrc': ['error', { extension: 'json', required: true }],
    'js/cypressjson': ['error', { required: false }],
  },
  'js-back': {
    'docker/dockerfile': ['error', { required: true }],
    'docker/dockerignore': ['error', { required: true }],
  },
};

export const rules = {
  changelog,
  contributing,
  cypressjson,
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
