

module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  env: {  es6: true, node: true },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    'comma-dangle': ["error", "always-multiline"],
    'no-console': ["error", { allow: ["info", "warn", "error"] }]
  },
  globals: {
    artifacts: false,
  },
};

