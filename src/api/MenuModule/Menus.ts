// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 查询菜单树列表 GET /api/menus */
export function menusControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    page?: number

    pageSize?: number

    keyword?: string
    /** 所属产品ID */
    productId?: string

    type?: 'directory' | 'menu' | 'button'

    enabled?: boolean
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<MenuModule.MenuListResponseDto>({
    url: `/api/menus`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 创建菜单 POST /api/menus */
export function menusControllerCreate(
  body: MenuModule.CreateMenuDto,
  options?: { [key: string]: any }
) {
  return request<MenuModule.MenuDetailResponseDto>({
    url: `/api/menus`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 查询菜单树 GET /api/menus/tree */
export function menusControllerFindTree(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    page?: number

    pageSize?: number

    keyword?: string
    /** 所属产品ID */
    productId?: string

    type?: 'directory' | 'menu' | 'button'

    enabled?: boolean
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<MenuModule.MenuTreeResponseDto>({
    url: `/api/menus/tree`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 获取菜单详情 GET /api/menus/{id} */
export function menusControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<MenuModule.MenuDetailResponseDto>({
    url: `/api/menus/${id}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 删除菜单 DELETE /api/menus/{id} */
export function menusControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<MenuModule.OperationMessageResponseDto>({
    url: `/api/menus/${id}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新菜单 PATCH /api/menus/{id} */
export function menusControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  body: MenuModule.UpdateMenuDto,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<MenuModule.MenuDetailResponseDto>({
    url: `/api/menus/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  })
}
