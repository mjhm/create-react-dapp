// From https://medium.com/@netczuk/your-last-eslint-config-9e35bace2f99

module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'prettier', 'plugin:react/recommended'],
  plugins: ['prettier', 'react'],
  env: { es6: true, browser: true },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    "react/prop-types": [2, { skipUndeclared: true }]
  },
};
