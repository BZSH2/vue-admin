export const ESLINT_SHARED_IGNORES = [
  'dist/*',
  'node_modules/*',
  '**/openApi/modules/generated/*',
  '**/src/assets/*',
  '**/src/api/*',
  '**/public/*',
  '**/src/plugins/vxeTable/*',
  '**/ylwiconfont/*',
  '**/auto-imports.d.ts',
  '**/components.d.ts',
]

const LINT_STAGED_IGNORED_SEGMENTS = ['/src/api/', '/openApi/modules/generated/']
const LINT_STAGED_IGNORED_SUFFIXES = [
  '/src/types/auto-imports.d.ts',
  '/src/types/components.d.ts',
]

export function isLintStagedEslintTarget(file) {
  return (
    !LINT_STAGED_IGNORED_SEGMENTS.some((segment) => file.includes(segment)) &&
    !LINT_STAGED_IGNORED_SUFFIXES.some((suffix) => file.endsWith(suffix))
  )
}
