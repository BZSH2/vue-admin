/* eslint-disable */
import request from '@/utils/request'

export function menusControllerFindAll(
  params?: MenuModule.QueryMenuDto,
  options?: { [key: string]: any }
) {
  return request<MenuModule.MenuListResult>({
    url: '/api/menus',
    method: 'GET',
    params,
    ...(options || {}),
  })
}

export function menusControllerFindTree(options?: { [key: string]: any }) {
  return request<MenuModule.MenuItem[]>({
    url: '/api/menus/tree',
    method: 'GET',
    ...(options || {}),
  })
}

export function menusControllerCreate(
  body: MenuModule.CreateMenuDto,
  options?: { [key: string]: any }
) {
  return request<MenuModule.MenuItem>({
    url: '/api/menus',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

export function menusControllerUpdate(
  id: string,
  body: MenuModule.UpdateMenuDto,
  options?: { [key: string]: any }
) {
  return request<MenuModule.MenuItem>({
    url: `/api/menus/${id}`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

export function menusControllerRemove(id: string, options?: { [key: string]: any }) {
  return request<MenuModule.OperationMessageDto>({
    url: `/api/menus/${id}`,
    method: 'DELETE',
    ...(options || {}),
  })
}
