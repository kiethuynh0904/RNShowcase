module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-native', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'react-native/no-inline-styles': 'off',
    'react-native/split-platform-components': 'off',
  },
};
