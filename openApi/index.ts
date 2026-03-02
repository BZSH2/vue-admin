// openApi/index.ts
import { fileURLToPath } from 'url'
import modules from './modules'
import axios from 'axios'
import ApiGenerator, { type OpenApiConfig } from './generate'
import { generatorFolder } from './generate/utils'

class OpenApi {
  private config: OpenApiConfig

  constructor(config: OpenApiConfig) {
    this.config = config
  }

  /**
   * 获取 openapi json 数据（使用 Apifox）
   * 在工程化的的项目 开发中 需要注意
   * 1：支持返回数据格式详情可看 入参数据结构md
   * 2: 入参的数据我采用的是 模块式的
   *    不同的项目处理可以采用不同的方式 可以根据实际情况 调整 可要是与后端沟通入参出参
   */
  private async postOpenApiJSON() {
    const {
      data: { data },
    } = await axios.post('https://m1.apifoxmock.com/m1/7827428-7575526-default/postOpenApiJson', {
      coke: JSON.stringify(modules),
    })
    return data
  }

  public async open() {
    // 1. 获取openapi数据
    const data = await this.postOpenApiJSON()

    // 2. 创建 url/api文件夹
    generatorFolder(this.config.output)

    // 3. 生成api相关
    new ApiGenerator(this.config, data).generator()

    console.log(`\n✨ OpenAPI 生成完成！输出目录: ${this.config.output}\n`)
  }
}

const openApi = new OpenApi({
  output: fileURLToPath(new URL('../src/api', import.meta.url)),
})

openApi.open().catch((err) => {
  console.error('💥 Fatal error:', err)
  process.exit(1)
})
