module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
  ],
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx"] }],
    "import/prefer-default-export": "off",
    "react/state-in-constructor": ["error", "never"],
    "react/jsx-props-no-spreading": "off",
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
  },
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.ts', '.tsx'] },
    },
  },
  overrides: [
    {
      files: ['**.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
