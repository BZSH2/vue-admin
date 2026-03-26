/* eslint-disable */
import request from '@/utils/request'

/** 分页查询用户列表 GET /api/users */
export function usersControllerFindAll(params?: UserModule.QueryUserDto, options?: { [key: string]: any }) {
  return request<UserModule.UserListResult>({
    url: '/api/users',
    method: 'GET',
    params,
    ...(options || {}),
  })
}
