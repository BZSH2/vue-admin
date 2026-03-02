// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 创建用户 POST /apiPets/users */
export function createUser(body: user.User, options?: { [key: string]: any }) {
  return request<any>({
    url: `/apiPets/users`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 获取用户 GET /apiPets/users/{username} */
export function getUserByName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 用户名。 */
    username: string
  },
  options?: { [key: string]: any }
) {
  const { username, ...queryParams } = params
  return request<user.User>({
    url: `/apiPets/users/${username}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新用户 PUT /apiPets/users/{username} */
export function updateUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 用户名。 */
    username: string
  },
  body: user.User,
  options?: { [key: string]: any }
) {
  const { username, ...queryParams } = params
  return request<any>({
    url: `/apiPets/users/${username}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  })
}
/** 删除用户 DELETE /apiPets/users/{username} */
export function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 用户名。 */
    username: string
  },
  options?: { [key: string]: any }
) {
  const { username, ...queryParams } = params
  return request<any>({
    url: `/apiPets/users/${username}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 登录 GET /apiPets/login */
export function loginUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 登录用户名。 */
    username: string
    /** 明文密码。 */
    password: string
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<string>({
    url: `/apiPets/login`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 登出 GET /apiPets/logout */
export function logoutUser(options?: { [key: string]: any }) {
  return request<any>({
    url: `/apiPets/logout`,
    method: 'GET',
    ...(options || {}),
  })
}
