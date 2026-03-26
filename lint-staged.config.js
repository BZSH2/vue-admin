import { isLintStagedEslintTarget } from './scripts/lint/shared-ignores.js'

const quote = (file) => `'${file.replace(/'/g, `'\"'\"'`)}'`

const toCommand = (command, files) =>
  files.length ? `${command} ${files.map((file) => quote(file)).join(' ')}` : null

// 分批执行，避免暂存文件较多时 pre-commit 占用过高导致进程被系统终止。
const chunk = (files, size = 8) => {
  const chunks = []
  for (let index = 0; index < files.length; index += size) {
    chunks.push(files.slice(index, index + size))
  }
  return chunks
}

export default {
  '*.{js,jsx,ts,tsx,vue}': (files) => {
    // 统一路径分隔符，保证本地执行和 git hook 场景下的过滤结果一致。
    const normalizedFiles = files.map((file) => file.replace(/\\/g, '/'))
    // 复用与 eslint.config.ts 同源的忽略规则，避免提交校验与全量校验口径漂移。
    const eslintFiles = normalizedFiles.filter(isLintStagedEslintTarget)

    return [
      toCommand('prettier --write', normalizedFiles),
      // Oxlint 和 ESLint 都按批次执行，降低 hook 阶段的内存压力。
      ...chunk(normalizedFiles, 12)
        .map((group) => toCommand('oxlint --fix', group))
        .filter(Boolean),
      ...chunk(eslintFiles, 8)
        .map((group) => toCommand('eslint --fix --no-warn-ignored', group))
        .filter(Boolean),
    ].filter(Boolean)
  },
  '!(package)*.json': ['prettier --write --parser json'],
  'package.json': ['prettier --write'],
  '*.{css,scss,less,styl,html}': ['prettier --write', 'stylelint --fix --allow-empty-input'],
  '*.vue': ['stylelint --fix --allow-empty-input'],
  '*.md': ['prettier --write'],
}
