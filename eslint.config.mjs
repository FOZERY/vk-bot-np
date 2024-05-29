import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [{
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