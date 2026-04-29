declare namespace MenuModule {
  interface CreateMenuDto {
    /** 菜单编码 */
    code: string
    /** 菜单名称 */
    name: string
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

  interface Menu {
    id: string
    code: string
    name: string
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

  interface UpdateMenuDto {
    /** 菜单编码 */
    code?: string
    /** 菜单名称 */
    name?: string
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
}
