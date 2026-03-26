/* eslint-disable */
import request from '@/utils/request'

/** 分页查询角色列表 GET /api/roles */
export function roleControllerFindAll(params?: RoleModule.QueryRoleDto, options?: { [key: string]: any }) {
  return request<RoleModule.RoleListResult>({
    url: '/api/roles',
    method: 'GET',
    params,
    ...(options || {}),
  })
}

/** 创建角色 POST /api/roles */
export function roleControllerCreate(body: RoleModule.CreateRoleDto, options?: { [key: string]: any }) {
  return request<RoleModule.RoleDetailDto>({
    url: '/api/roles',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

/** 获取角色详情 GET /api/roles/${id} */
export function roleControllerFindOne(id: string, options?: { [key: string]: any }) {
  return request<RoleModule.RoleDetailDto>({
    url: `/api/roles/${id}`,
    method: 'GET',
    ...(options || {}),
  })
}

/** 更新角色 PATCH /api/roles/${id} */
export function roleControllerUpdate(
  id: string,
  body: RoleModule.UpdateRoleDto,
  options?: { [key: string]: any }
) {
  return request<RoleModule.RoleDetailDto>({
    url: `/api/roles/${id}`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

/** 更新角色状态 PATCH /api/roles/${id}/status */
export function roleControllerUpdateStatus(
  id: string,
  body: RoleModule.UpdateRoleStatusDto,
  options?: { [key: string]: any }
) {
  return request<RoleModule.RoleDetailDto>({
    url: `/api/roles/${id}/status`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

/** 删除角色 DELETE /api/roles/${id} */
export function roleControllerRemove(id: string, options?: { [key: string]: any }) {
  return request<RoleModule.OperationMessageDto>({
    url: `/api/roles/${id}`,
    method: 'DELETE',
    ...(options || {}),
  })
}

/** 查询角色成员 GET /api/roles/${id}/users */
export function roleControllerFindUsers(
  id: string,
  params?: RoleModule.QueryRoleDto,
  options?: { [key: string]: any }
) {
  return request<RoleModule.RoleMemberListResult>({
    url: `/api/roles/${id}/users`,
    method: 'GET',
    params,
    ...(options || {}),
  })
}

/** 为角色添加成员 POST /api/roles/${id}/users */
export function roleControllerAddUser(
  id: string,
  body: RoleModule.CreateRoleUserDto,
  options?: { [key: string]: any }
) {
  return request<RoleModule.OperationMessageDto>({
    url: `/api/roles/${id}/users`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

/** 从角色移除成员 DELETE /api/roles/${id}/users/${userId} */
export function roleControllerRemoveUser(id: string, userId: string, options?: { [key: string]: any }) {
  return request<RoleModule.OperationMessageDto>({
    url: `/api/roles/${id}/users/${userId}`,
    method: 'DELETE',
    ...(options || {}),
  })
}

/** 获取角色选项 GET /api/roles/options */
export function roleControllerGetOptions(options?: { [key: string]: any }) {
  return request<RoleModule.RoleOptionDto[]>({
    url: '/api/roles/options',
    method: 'GET',
    ...(options || {}),
  })
}
