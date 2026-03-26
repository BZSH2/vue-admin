// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取角色选项列表 GET /api/roles/options */
export function rolesControllerGetOptions(options?: { [key: string]: any }) {
  return request<RoleModule.RoleOptionsResponseDto>({
    url: `/api/roles/options`,
    method: 'GET',
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
