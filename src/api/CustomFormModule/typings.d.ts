declare namespace CustomFormModule {
  interface CustomFormOptionDetailDto {
    /** 选项文案 */
    label: string
    /** 选项值，支持 string / number / boolean */
    value: Record<string, any>
    /** 是否禁用该选项 */
    disabled?: boolean
  }

  interface CustomFormPatternDto {
    /** 正则表达式 source */
    source: string
    /** 正则 flags */
    flags?: string | null
  }

  interface CustomFormRuleDetailDto {
    /** 是否必填 */
    required?: boolean
    /** 校验失败提示文案 */
    message?: string
    /** 触发时机，可为 blur / change，或数组 */
    trigger?: 'blur' | 'change' | ('blur' | 'change')[]
    /** 正则配置；服务端存为可序列化结构 */
    pattern?: CustomFormPatternDto
    /** 最小值/最小长度 */
    min?: number
    /** 最大值/最大长度 */
    max?: number
    /** 自定义校验器的可序列化配置占位 */
    validator?: Record<string, any>
  }

  interface CustomFormItemDetailDto {
    /** 字段类型 */
    type:
      | 'input'
      | 'textarea'
      | 'number'
      | 'select'
      | 'radio'
      | 'checkbox'
      | 'switch'
      | 'date'
      | 'custom'
    /** 字段标签 */
    label: string
    /** 字段 name */
    name: string
    /** 默认值，支持 string / number / boolean / array / null */
    value?: Record<string, any>
    /** 占位提示 */
    placeholder?: string
    /** 是否必填 */
    required?: boolean
    /** 是否禁用 */
    disabled?: boolean
    /** 是否隐藏 */
    hidden?: boolean
    /** 栅格占位（24 栅格） */
    span?: number
    /** 可选项列表 */
    options?: CustomFormOptionDetailDto[]
    /** 校验规则 */
    rules?: CustomFormRuleDetailDto[]
    /** 透传组件 props */
    props?: Record<string, any>
    /** 字段唯一 id */
    id: string
  }

  interface CustomFormDetailDto {
    /** 自定义表单 ID */
    id: string
    /** 表单编码 */
    code: string
    /** 表单名称 */
    name: string
    /** 表单 Schema，单个表单按 Form.Item[] 存储 */
    schema: CustomFormItemDetailDto[]
    /** 备注 */
    remark?: string | null
    /** 创建时间 */
    createdAt: string | Date
    /** 更新时间 */
    updatedAt: string | Date
  }

  interface CustomFormListDto {
    items: CustomFormDetailDto[]
    total: number
    page: number
    pageSize: number
  }

  interface CustomFormListResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: CustomFormListDto
  }

  interface FormOptionDto {
    label: string
    /** 选项值，支持 string / number / boolean */
    value: Record<string, any>
    disabled?: boolean
  }

  interface FormRuleDto {
    required?: boolean
    message?: string
    /** 支持 blur / change，或传数组 ["blur", "change"] */
    trigger?: Record<string, any>
    /** 正则建议传 source 字符串，或 { source, flags } 的可序列化对象 */
    pattern?: Record<string, any>
    min?: number
    max?: number
    /** 自定义校验器占位。函数本身不能直接通过 JSON 传输。 */
    validator?: Record<string, any>
  }

  interface FormItemDto {
    type:
      | 'input'
      | 'textarea'
      | 'number'
      | 'select'
      | 'radio'
      | 'checkbox'
      | 'switch'
      | 'date'
      | 'custom'
    label: string
    name: string
    /** 字段默认值 */
    value?: Record<string, any>
    placeholder?: string
    required?: boolean
    disabled?: boolean
    hidden?: boolean
    span?: number
    options?: FormOptionDto[]
    rules?: FormRuleDto[]
    props?: Record<string, any>
    /** 字段唯一值；如果前端未传，服务端会自动生成。 */
    id?: string
  }

  interface CreateCustomFormDto {
    code: string
    name: string
    remark?: string | null
    /** 单个表单按 Form.Item[] 结构存储 */
    schema: FormItemDto[]
  }

  interface CustomFormDetailResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: CustomFormDetailDto
  }

  interface OperationMessageDto {
    /** 操作结果消息 */
    message: string
  }

  interface OperationMessageResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: OperationMessageDto
  }

  interface UpdateCustomFormDto {
    code?: string
    name?: string
    remark?: string | null
    /** 单个表单按 Form.Item[] 结构存储 */
    schema?: FormItemDto[]
  }
}
