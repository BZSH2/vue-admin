export default {
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'oxlint --fix', 'eslint --fix'],
  '*.vue': [
    'prettier --write',
    'oxlint --fix',
    'eslint --fix',
    'stylelint --fix --allow-empty-input',
  ],
  '!(package)*.json': ['prettier --write --parser json'],
  'package.json': ['prettier --write'],
  '*.{css,scss,less,styl,html}': ['prettier --write', 'stylelint --fix --allow-empty-input'],
  '*.md': ['prettier --write'],
}
