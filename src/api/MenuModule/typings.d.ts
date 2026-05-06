declare namespace MenuModule {
  type MenuType = 'directory' | 'menu' | 'button'

  interface QueryMenuDto {
    page?: number
    pageSize?: number
    keyword?: string
    type?: MenuType
    enabled?: boolean
  }

  interface CreateMenuDto {
    code: string
    name: string
    parentId?: string | null
    type: MenuType
    path?: string | null
    component?: string | null
    permission?: string | null
    icon?: string | null
    sort?: number
    visible?: boolean
    enabled?: boolean
    remark?: string | null
  }

  interface UpdateMenuDto extends Partial<CreateMenuDto> {}

  interface MenuItem extends CreateMenuDto {
    id: string
    createdAt: string
    updatedAt: string
    children?: MenuItem[]
  }

  interface MenuListResult {
    items: MenuItem[]
    total: number
    page: number
    pageSize: number
  }

  interface OperationMessageDto {
    message: string
  }
}
