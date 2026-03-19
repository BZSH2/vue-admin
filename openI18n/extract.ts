import fs from 'fs'
import path from 'path'
import { parse } from '@vue/compiler-sfc'
import * as glob from 'glob'
import { translate as googleTranslate } from 'google-translate-api-x'
import { translate as bingTranslate } from 'bing-translate-api'
import { langDict } from '../src/config/lang'

interface I18nKey {
  key: string
  value: string
  file: string
  line: number
}

export class I18nExtractor {
  private keys: Map<string, I18nKey> = new Map()

  private regex = {
    // 匹配 $t('key')
    functionCall: /\$t\(\s*['"]([^'"]+)['"]\s*\)/g,
    // 匹配 t('key') 或 I18n.t('key')
    tCall: /(?:^|\s|\W)(?:t|I18n\.t)\(\s*['"]([^'"]+)['"]\s*\)/g,
    // 匹配 v-t="'key'"
    directive: /v-t="['"]([^'"]+)['"]/g,
    // 匹配 {{ $t('key') }}
    interpolation: /\{\{\s*\$t\(\s*['"]([^'"]+)['"]\s*\)\s*\}\}/g,
    // 路由 meta.title: 'key'（跨行）
    routeMetaTitle: /meta\s*:\s*\{[\s\S]*?title\s*:\s*['"]([^'"]+)['"]/g,
  }

  // 扫描Vue文件
  scanVueFiles(pattern: string = 'src/**/*.vue'): I18nKey[] {
    const files = glob.sync(pattern)

    files.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8')
      this.extractFromVueFile(content, file)
    })

    return Array.from(this.keys.values())
  }

  // 扫描TS/TSX文件（路由等）
  scanTsFiles(pattern: string = 'src/**/*.{ts,tsx}'): I18nKey[] {
    const files = glob.sync(pattern, { dot: false, nodir: true })
    files.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8')
      this.extractFromTsFile(content, file)
    })
    return Array.from(this.keys.values())
  }

  private extractFromVueFile(content: string, filePath: string) {
    const { descriptor } = parse(content)

    // 提取template
    if (descriptor.template?.content) {
      this.extractFromTemplate(descriptor.template.content, filePath)
    }

    // 提取script
    if (descriptor.script?.content) {
      this.extractFromScript(descriptor.script.content, filePath)
    }

    // 提取scriptSetup
    if (descriptor.scriptSetup?.content) {
      this.extractFromScript(descriptor.scriptSetup.content, filePath)
    }

    // 提取SFC自定义块
    if (descriptor.customBlocks) {
      descriptor.customBlocks.forEach((block) => {
        if (block.type === 'i18n') {
          this.extractFromCustomBlock(block.content, filePath)
        }
      })
    }
  }

  private addKey(key: string, filePath: string, line = 0) {
    if (!key || this.keys.has(key)) {
      return
    }
    this.keys.set(key, {
      key,
      value: key,
      file: filePath,
      line,
    })
  }

  private extractFromTsFile(content: string, filePath: string) {
    // 1) 匹配 $t('key') / t('key') / I18n.t('key')
    const matches = [
      ...content.matchAll(this.regex.functionCall),
      ...content.matchAll(this.regex.tCall),
    ]
    matches.forEach((m) => this.addKey(m[1], filePath, 0))

    // 2) 匹配路由 meta.title: 'key'
    const routeMatches = [...content.matchAll(this.regex.routeMetaTitle)]
    routeMatches.forEach((m) => this.addKey(m[1], filePath, 0))
  }

  private extractFromScript(content: string, filePath: string) {
    // 匹配 t('key') 或 $t('key') 或 i18n.t('key')
    const scriptRegex = /(?:^|\s|\W)(?:\$t|t|I18n\.t)\(\s*['"]([^'"]+)['"]\s*\)/g
    const matches = [...content.matchAll(scriptRegex)]

    matches.forEach((match) => {
      const key = match[1]
      if (key && !this.keys.has(key)) {
        this.keys.set(key, {
          key,
          value: key,
          file: filePath,
          line: 0, // 脚本行号暂不精确计算
        })
      }
    })
  }

  private extractFromCustomBlock(content: string, filePath: string) {
    try {
      const data = JSON.parse(content)
      // 假设第一层是 locale key，如 "en", "zh-CN"
      // 我们遍历所有 locale，提取其中的 key
      Object.keys(data).forEach((locale) => {
        const localeData = data[locale]
        if (typeof localeData === 'object' && localeData !== null) {
          this.traverseObject(localeData, filePath)
        }
      })
    } catch (e) {
      // 忽略非JSON格式的自定义块
      console.warn(
        `Failed to parse i18n custom block in ${filePath}: ${e instanceof Error ? e.message : 'Unknown error'}`
      )
      // 忽略非JSON格式的自定义块
    }
  }

  private traverseObject(obj: any, filePath: string, prefix = '') {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        const value = obj[key]
        const currentKey = prefix ? `${prefix}.${key}` : key
        if (typeof value === 'object' && value !== null) {
          this.traverseObject(value, filePath, currentKey)
        } else {
          // 添加到 keys 集合中
          if (!this.keys.has(currentKey)) {
            this.keys.set(currentKey, {
              key: currentKey,
              value: String(value), // 使用找到的值作为默认值（虽然不同locale值不同，这里取其中一个即可）
              file: filePath,
              line: 0,
            })
          }
        }
      })
    }
  }

  private extractFromTemplate(content: string, filePath: string) {
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      // 匹配各种使用方式
      const matches = [
        ...line.matchAll(this.regex.functionCall),
        ...line.matchAll(this.regex.directive),
        ...line.matchAll(this.regex.interpolation),
      ]

      matches.forEach((match) => {
        const key = match[1]
        if (key && !this.keys.has(key)) {
          this.keys.set(key, {
            key,
            value: key, // 初始值设为key本身
            file: filePath,
            line: index + 1,
          })
        }
      })
    })
  }

  // 生成语言文件
  async generateLangFile(lang: string, outputDir: string) {
    // 1. 创建输出目录
    try {
      fs.mkdirSync(outputDir, { recursive: true })
    } catch (e) {
      console.error(`Error creating directory ${outputDir}:`, e)
    }

    const outputPath = path.join(outputDir, `${lang}.json`)
    let existingData: Record<string, any> = {}

    // 2. 构建新数据
    const newData: Record<string, any> = {}

    // 遍历所有key
    for (const { key } of this.keys.values()) {
      // 检查key是否已存在于现有翻译中
      if (this.hasKey(existingData, key)) {
        continue
      }

      const keys = key.split('.')
      let current = newData

      const translatedText = await this.getTranslation(key, lang)

      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          current[k] = translatedText
        } else {
          if (!current[k]) {
            current[k] = {}
          }
          current = current[k]
        }
      })
    }

    // 合并数据（保留已有翻译）
    // 注意：这里我们将newData合并到existingData中，但deepMerge逻辑需要调整以确保newData（新翻译）被添加
    // 其实上面我们只收集了*不存在*的key到newData，所以直接合并即可
    const mergedData = this.deepMerge(existingData, newData)

    fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), 'utf-8')
    console.log(`Generated ${lang} file at ${outputPath}`)
  }

  private hasKey(obj: any, key: string): boolean {
    const keys = key.split('.')
    let current = obj
    for (const k of keys) {
      if (current === undefined || current === null) {
        return false
      }
      current = current[k]
    }
    return current !== undefined
  }

  // 深度合并对象
  private deepMerge(target: any, source: any): any {
    if (
      typeof target !== 'object' ||
      target === null ||
      typeof source !== 'object' ||
      source === null
    ) {
      return source
    }

    const result = { ...target }

    Object.keys(source).forEach((key) => {
      if (key in target) {
        result[key] = this.deepMerge(target[key], source[key])
      } else {
        result[key] = source[key]
      }
    })

    return result
  }

  // 提取带有多级降级的翻译逻辑
  private async getTranslation(key: string, lang: string): Promise<string> {
    const hasChinese = /[\u4e00-\u9fa5]/.test(key)
    if (!hasChinese || lang === 'zh-CN') {
      return key
    }

    let translatedText = key

    // 1. 优先尝试使用 Google 翻译
    const googleSuccess = await this.tryGoogleTranslate(key, lang, (text) => {
      translatedText = text
    })

    // 2. 如果 Google 翻译失败，尝试使用 Bing 翻译作为降级
    if (!googleSuccess) {
      await this.tryBingTranslate(key, lang, (text) => {
        translatedText = text
      })
    }

    return translatedText
  }

  private async tryGoogleTranslate(
    key: string,
    lang: string,
    onSuccess: (text: string) => void
  ): Promise<boolean> {
    try {
      const googleRes = await googleTranslate(key, { to: lang })
      if (googleRes && googleRes.text) {
        onSuccess(googleRes.text)
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 500)
        })
        return true
      }
    } catch (e) {
      console.warn(
        `Google translation failed for ${key} to ${lang}: ${e instanceof Error ? e.message : 'Unknown error'}. Trying Bing Translate...`
      )
    }
    return false
  }

  private async tryBingTranslate(
    key: string,
    lang: string,
    onSuccess: (text: string) => void
  ): Promise<boolean> {
    try {
      const langConfig = langDict.find((item) => item.code === lang)
      const targetLang = langConfig?.bingCode || lang

      const bingRes = await bingTranslate(key, null, targetLang)
      if (bingRes && bingRes.translation) {
        onSuccess(bingRes.translation)
      }
      // 适度增加延迟，避免触发必应的反爬限制
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 800)
      })
      return true
    } catch (e) {
      console.warn(
        `Bing translation also failed for ${key} to ${lang}: ${e instanceof Error ? e.message : 'Unknown error'}. Falling back to original key.`
      )
      return false
    }
  }
}
