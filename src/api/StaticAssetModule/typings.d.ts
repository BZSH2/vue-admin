declare namespace StaticAssetModule {
  interface StaticAssetDetailDto {
    /** 静态资源ID */
    id: string
    /** 资源名称 */
    name: string
    /** 原始文件名 */
    originalName: string
    /** 资源类型 */
    fileType: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other'
    /** 文件扩展名 */
    extension: string
    /** MIME 类型 */
    mimeType: string
    /** 文件大小（字节） */
    size: number
    /** 资源目录/分组 */
    folder?: string | null
    /** 存储相对路径 */
    storagePath: string
    /** 资源访问路径 */
    accessPath: string
    /** 资源访问 URL，未配置公网前缀时与 accessPath 一致 */
    accessUrl: string
    /** 文件哈希（SHA-256） */
    hash: string
    /** 备注 */
    remark?: string | null
    /** 创建时间 */
    createdAt: string | Date
    /** 更新时间 */
    updatedAt: string | Date
  }

  interface StaticAssetListDto {
    items: StaticAssetDetailDto[]
    total: number
    page: number
    pageSize: number
  }

  interface StaticAssetListResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: StaticAssetListDto
  }

  interface StaticAssetFolderOptionDto {
    /** 资源目录值；未分组时为 null */
    folder?: string | null
    /** 前端展示标签 */
    label: string
    /** 是否属于未分组资源 */
    uncategorized: boolean
    /** 该目录下资源数量 */
    count: number
  }

  interface StaticAssetFolderOptionsResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: StaticAssetFolderOptionDto[]
  }

  interface StaticAssetDetailResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: StaticAssetDetailDto
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

  interface UpdateStaticAssetDto {
    /** 资源名称，不传时默认使用原始文件名（去扩展名） */
    name?: string
    /** 资源目录/分组，例如 branding、docs、banners */
    folder?: string
    /** 备注 */
    remark?: string
  }

  interface BatchDeleteStaticAssetsDto {
    /** 待批量删除的静态资源 ID 列表 */
    ids: string[]
  }

  interface BatchDeleteStaticAssetsResultDto {
    /** 本次批量删除结果说明 */
    message: string
    /** 请求删除的 ID 数量 */
    requestedCount: number
    /** 实际删除成功的数量 */
    deletedCount: number
    /** 实际删除成功的资源 ID 列表 */
    ids: string[]
    /** 本次请求中未找到的资源 ID 列表 */
    missingIds: string[]
  }

  interface BatchDeleteStaticAssetsResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: BatchDeleteStaticAssetsResultDto
  }
}
