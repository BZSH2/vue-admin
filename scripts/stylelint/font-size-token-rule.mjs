import stylelint from 'stylelint'
import { getThemeFontSizeTokenByPx } from '../../src/shared/theme/font-size.js'

export const ruleName = 'va/font-size-token'
export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value, replacement) =>
    `font-size "${value}" should use the shared font token "${replacement}"`,
})

const FONT_SIZE_FUNCTION_PATTERN = /(var|clamp|calc|min|max)\(/i

const isIgnorableValue = (value) =>
  FONT_SIZE_FUNCTION_PATTERN.test(value) ||
  value.includes('rem') ||
  value.includes('em') ||
  value.includes('%') ||
  ['inherit', 'initial', 'unset', 'revert', 'revert-layer'].includes(value)

const plugin = stylelint.createPlugin(ruleName, () => (root, result) => {
    root.walkDecls('font-size', (decl) => {
      const rawValue = decl.value.trim()
      if (!rawValue || isIgnorableValue(rawValue)) {
        return
      }

      const replacement = getThemeFontSizeTokenByPx(rawValue)
      if (!replacement || replacement === rawValue) {
        return
      }

      if (result.stylelint.config.fix) {
        decl.value = replacement
        return
      }

      stylelint.utils.report({
        ruleName,
        result,
        node: decl,
        message: messages.rejected(rawValue, replacement),
      })
    })
  })

plugin.ruleName = ruleName
plugin.messages = messages

export default plugin
