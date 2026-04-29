// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 分页查询角色列表 GET /api/roles */
export function rolesControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 页码 */
    page?: number
    /** 每页数量 */
    pageSize?: number
    /** 搜索关键字（角色名称/编码） */
    keyword?: string
    /** 是否启用 */
    enabled?: boolean
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<RoleModule.RoleListResponseDto>({
    url: `/api/roles`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 创建角色 POST /api/roles */
export function rolesControllerCreate(
  body: RoleModule.CreateRoleDto,
  options?: { [key: string]: any }
) {
  return request<RoleModule.RoleDetailResponseDto>({
    url: `/api/roles`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 获取可分配角色选项列表 GET /api/roles/options */
export function rolesControllerGetOptions(options?: { [key: string]: any }) {
  return request<RoleModule.RoleOptionsResponseDto>({
    url: `/api/roles/options`,
    method: 'GET',
    ...(options || {}),
  })
}
/** 获取角色详情 GET /api/roles/{id} */
export function rolesControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<RoleModule.RoleDetailResponseDto>({
    url: `/api/roles/${id}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 删除角色 DELETE /api/roles/{id} */
export function rolesControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<RoleModule.OperationMessageResponseDto>({
    url: `/api/roles/${id}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新角色基础信息 PATCH /api/roles/{id} */
export function rolesControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  body: RoleModule.UpdateRoleDto,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<RoleModule.RoleDetailResponseDto>({
    url: `/api/roles/${id}`,
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
/** 更新角色启用状态 PATCH /api/roles/{id}/status */
export function rolesControllerUpdateStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  body: RoleModule.UpdateRoleStatusDto,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<RoleModule.RoleDetailResponseDto>({
    url: `/api/roles/${id}/status`,
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
/** 分页查询角色成员列表 GET /api/roles/{id}/users */
export function rolesControllerFindUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
    /** 页码 */
    page?: number
    /** 每页数量 */
    pageSize?: number
    /** 搜索关键字（角色名称/编码） */
    keyword?: string
    /** 是否启用 */
    enabled?: boolean
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<RoleModule.RoleMemberListResponseDto>({
    url: `/api/roles/${id}/users`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 为角色添加成员 POST /api/roles/{id}/users */
export function rolesControllerAddUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  body: RoleModule.CreateRoleUserDto,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<RoleModule.OperationMessageResponseDto>({
    url: `/api/roles/${id}/users`,
    method: 'POST',
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
/** 从角色移除成员 DELETE /api/roles/{id}/users/{userId} */
export function rolesControllerRemoveUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string

    userId: string
  },
  options?: { [key: string]: any }
) {
  const { id, userId, ...queryParams } = params
  return request<RoleModule.OperationMessageResponseDto>({
    url: `/api/roles/${id}/users/${userId}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 获取指定用户角色信息 GET /api/roles/users/{userId} */
export function rolesControllerGetUserRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    userId: string
  },
  options?: { [key: string]: any }
) {
  const { userId, ...queryParams } = params
  return request<RoleModule.UserRoleDetailResponseDto>({
    url: `/api/roles/users/${userId}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新指定用户角色 PATCH /api/roles/users/{userId} */
export function rolesControllerUpdateUserRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    userId: string
  },
  body: RoleModule.UpdateUserRoleDto,
  options?: { [key: string]: any }
) {
  const { userId, ...queryParams } = params
  return request<RoleModule.UserRoleDetailResponseDto>({
    url: `/api/roles/users/${userId}`,
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
