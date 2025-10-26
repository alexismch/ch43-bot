import { defineConfig, globalIgnores } from 'eslint/config';
import nrwlNx from '@nx/eslint-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
   baseDirectory: __dirname,
   recommendedConfig: js.configs.recommended,
   allConfig: js.configs.all,
});

export default defineConfig([
   globalIgnores(['libs/prisma/src/client', 'apps/front/dist', 'node_modules']),
   {
      plugins: {
         '@nrwl/nx': nrwlNx,
      },
   },
   {
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

      rules: {
         '@nrwl/nx/enforce-module-boundaries': [
            'error',
            {
               enforceBuildableLibDependency: true,
               allow: [],

               depConstraints: [
                  {
                     sourceTag: '*',
                     onlyDependOnLibsWithTags: ['*'],
                  },
               ],
            },
         ],
      },
   },
   {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [...compat.extends('plugin:@nx/typescript')],
      rules: {},
   },
   {
      files: ['**/*.js', '**/*.jsx'],
      extends: [...compat.extends('plugin:@nx/javascript')],
      rules: {},
   },
]);
