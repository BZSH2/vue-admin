import axios from 'axios'
import path from 'path'
import url from 'url'
import genFileFromTemplate from './generate/generateTemplate'
import { resolveTypeName } from './generate/utils'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serverBase = process.env.OPENAPI_BASE_URL || 'http://localhost:3000'

/**
 * 从后端获取可生成的模块定义，并在 openApi/modules 下生成对应 TS 配置文件。
 *
 * 数据来源：
 * - GET ${serverBase}/api/getModules
 * - 返回结构：{ code: 200, message: 'success', data: Array<{ prefix: string; service: string[] }> }
 *
 * 生成规则：
 * - 文件名：基于 prefix 进行规范化（resolveTypeName）后，转为小驼峰作为文件名，例如：
 *   - 'OpenAPI' -> 'openAPI.ts'
 *   - 'Users'   -> 'users.ts'
 * - 内容：使用 openApiModule 模版渲染，service 列表项以注释形式输出，便于手动启用
 *
 * 错误处理：
 * - 保持异常抛出，让上层命令感知失败并退出
 */
async function main() {
  const { data } = await axios.get(`${serverBase}/api/getModules`)
  const list: Array<{
    prefix: string
    label?: string
    service: Array<{ value: string; label?: string }>
  }> = data?.data || []

  const outDir = path.resolve(__dirname, 'modules', 'generated')
  for (const mod of list) {
    const prefix: string = mod?.prefix || 'Module'
    const moduleLabel: string = mod?.label || prefix
    const services: Array<{ value: string; label?: string }> = Array.isArray(mod?.service)
      ? mod.service
      : []
    // 使用工具方法规范化名称，并转为小驼峰作为文件名
    const normalized = resolveTypeName(prefix)
    const fileBase = normalized ? normalized[0].toLowerCase() + normalized.slice(1) : 'module'
    const fileName = `${fileBase}.ts`
    genFileFromTemplate(fileName, 'openApiModule', outDir, {
      prefix,
      moduleLabel,
      service: services,
    })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
