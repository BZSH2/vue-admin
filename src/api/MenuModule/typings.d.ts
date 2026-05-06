declare namespace MenuModule {
  interface MenuTreeItemDto {
    /** 菜单ID */
    id: string
    /** 菜单编码 */
    code: string
    /** 菜单名称 */
    name: string
    /** 所属产品ID */
    productId?: string | null
    /** 父级菜单ID */
    parentId?: string | null
    /** 菜单类型 */
    type: 'directory' | 'menu' | 'button'
    /** 路由路径 */
    path?: string | null
    /** 前端组件路径 */
    component?: string | null
    /** 权限标识 */
    permission?: string | null
    /** 图标 */
    icon?: string | null
    /** 排序 */
    sort: number
    /** 是否可见 */
    visible: boolean
    /** 是否启用 */
    enabled: boolean
    /** 备注 */
    remark?: string | null
    /** 创建时间 */
    createdAt: string | Date
    /** 更新时间 */
    updatedAt: string | Date
    /** 子菜单树 */
    children: MenuTreeItemDto[]
  }

  interface MenuListDto {
    /** 菜单树列表 */
    items: MenuTreeItemDto[]
    total: number
    page: number
    pageSize: number
  }

  interface MenuListResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: MenuListDto
  }

  interface CreateMenuDto {
    /** 菜单编码 */
    code: string
    /** 菜单名称 */
    name: string
    /** 所属产品ID */
    productId?: string | null
    /** 父级菜单ID */
    parentId?: string | null
    type: 'directory' | 'menu' | 'button'
    path?: string | null
    component?: string | null
    permission?: string | null
    icon?: string | null
    sort?: number
    visible?: boolean
    enabled?: boolean
    remark?: string | null
  }

  interface MenuDetailDto {
    /** 菜单ID */
    id: string
    /** 菜单编码 */
    code: string
    /** 菜单名称 */
    name: string
    /** 所属产品ID */
    productId?: string | null
    /** 父级菜单ID */
    parentId?: string | null
    /** 菜单类型 */
    type: 'directory' | 'menu' | 'button'
    /** 路由路径 */
    path?: string | null
    /** 前端组件路径 */
    component?: string | null
    /** 权限标识 */
    permission?: string | null
    /** 图标 */
    icon?: string | null
    /** 排序 */
    sort: number
    /** 是否可见 */
    visible: boolean
    /** 是否启用 */
    enabled: boolean
    /** 备注 */
    remark?: string | null
    /** 创建时间 */
    createdAt: string | Date
    /** 更新时间 */
    updatedAt: string | Date
  }

  interface MenuDetailResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: MenuDetailDto
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

  interface Menu {
    id: string
    code: string
    name: string
    productId: string | null
    product: Product
    parentId: string | null
    type: Record<string, any>
    path: string | null
    component: string | null
    permission: string | null
    icon: string | null
    sort: number
    visible: boolean
    enabled: boolean
    remark: string | null
    createdAt: string | Date
    updatedAt: string | Date
    deletedAt: string | Date | null
  }

  interface MenuTreeResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    /** 菜单树 */
    data: MenuTreeItemDto[]
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

  interface UpdateMenuDto {
    /** 菜单编码 */
    code?: string
    /** 菜单名称 */
    name?: string
    /** 所属产品ID */
    productId?: string | null
    /** 父级菜单ID */
    parentId?: string | null
    type?: 'directory' | 'menu' | 'button'
    path?: string | null
    component?: string | null
    permission?: string | null
    icon?: string | null
    sort?: number
    visible?: boolean
    enabled?: boolean
    remark?: string | null
  }

  interface QueryMenuDto {
    page?: number
    pageSize?: number
    keyword?: string
    productId?: string
    type?: 'directory' | 'menu' | 'button'
    enabled?: boolean
  }

  type MenuItem = MenuDetailDto & {
    children?: MenuItem[]
  }

  type MenuListResult = MenuListDto
}
