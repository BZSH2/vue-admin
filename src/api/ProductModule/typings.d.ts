declare namespace ProductModule {
  interface CreateProductDto {
    /** 产品名称 */
    name: string
    /** 产品代码，仅支持字母、数字、下划线和中划线 */
    code: string
    /** 产品描述 */
    description?: string | null
    /** 产品状态 */
    status?: boolean
  }

  interface Product {
    id: string
    name: string
    code: string
    description: string | null
    status: boolean
    createdAt: string | Date
    updatedAt: string | Date
    deletedAt: string | Date | null
  }

  interface UpdateProductDto {
    /** 产品名称 */
    name?: string
    /** 产品代码，仅支持字母、数字、下划线和中划线 */
    code?: string
    /** 产品描述 */
    description?: string | null
    /** 产品状态 */
    status?: boolean
  }
}
