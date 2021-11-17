import type { Rulesets } from '../types';

import * as changelog from './base/changelog';
import * as contributing from './base/contributing';
import * as envexample from './base/envexample';
import * as license from './base/license';
import * as prettierignore from './base/prettierignore';
import * as prettierrc from './base/prettierrc';
import * as readme from './base/readme';
import * as releaserc from './base/releaserc';
import * as renovaterc from './base/renovaterc';
import * as circleci from './ci/circleci';
import * as codesandboxci from './ci/codesandbox';
import * as travisci from './ci/travisci';
import * as dockerfile from './docker/dockerfile';
import * as dockerignore from './docker/dockerignore';
import * as defaultbranch from './git/defaultbranch';
import * as gitignore from './git/gitignore';
import * as ghactions from './github/actions';
import * as bundlesizeconfigjson from './js/bundlesizeconfigjson';
import * as cypressjson from './js/cypressjson';
import * as eslintignore from './js/eslintignore';
import * as eslintrc from './js/eslintrc';
import * as nvmrc from './js/nvmrc';
import * as packagejson from './js/packagejson';
import * as stylelintrc from './js/stylelintrc';
import * as tsconfigjson from './js/tsconfigjson';

export const rulesets: Rulesets = {
  recommended: {
    'base/changelog': ['error', { required: true }],
    'base/contributing': ['error', { required: true }],
    'base/envexample': ['error'],
    'base/license': ['error', { required: true }],
    'base/prettierignore': ['error', { required: false }],
    'base/prettierrc': ['error', { required: true }],
    'base/readme': ['error', { required: true }],
    'base/releaserc': ['error', { required: true }],
    'base/renovaterc': ['warn', { required: true }],
    'git/gitignore': ['error', { required: true }],
    'git/defaultbranch': ['warn', { name: 'main' }],
  },
  ci: {},
  js: {
    'js/eslintignore': ['error', { required: false }],
    'js/eslintrc': ['error', { required: true }],
    'js/nvmrc': ['error', { required: true }],
    'js/packagejson': ['error', { required: true }],
    'js/tsconfigjson': ['error', { required: true }],
  },
  'js-front': {
    'js/bundlesizeconfigjson': ['error', { required: true }],
    'js/cypressjson': ['error', { required: false }],
    'js/stylelintrc': ['error', { required: true }],
  },
  'js-back': {
    'docker/dockerfile': ['error', { required: true }],
    'docker/dockerignore': ['error', { required: true }],
  },
};

export const rules = {
  bundlesizeconfigjson,
  changelog,
  circleci,
  codesandboxci,
  contributing,
  cypressjson,
  defaultbranch,
  dockerfile,
  dockerignore,
  envexample,
  eslintignore,
  eslintrc,
  ghactions,
  gitignore,
  license,
  nvmrc,
  packagejson,
  prettierignore,
  prettierrc,
  readme,
  releaserc,
  renovaterc,
  stylelintrc,
  travisci,
  tsconfigjson,
};
