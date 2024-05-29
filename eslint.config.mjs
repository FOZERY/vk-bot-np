import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import nodePlugin from 'eslint-plugin-n';


export default [
    nodePlugin.configs['flat/recommended-script'],
    {
        rules: {
            'n/exports-style': ['error', 'module.exports'],
        },
    },
    {
        plugins: {
            prettier: prettierPlugin,
        },
    },
    {
        ignores: ['node_modules', 'dist'],
    },
    {
        files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' }, rules: {
            ...eslintConfigPrettier.rules,
        },
    },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
];