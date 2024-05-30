module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{css,less,scss,sass}': ['stylelint --fix', 'prettier --write'],
  '*.vue': ['stylelint --fix', 'eslint --fix', 'prettier --write'],
};
