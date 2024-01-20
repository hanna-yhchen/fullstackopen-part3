module.exports = {
  root: true,
  env: { browser: true, es2024: true },
  extends: [
    'standard',
    'standard-jsx',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ]
    ,
    'space-before-function-paren': 'off',
    'react/prop-types': 'off'
  },
}
