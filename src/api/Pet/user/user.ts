// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 创建用户 POST https://m1.apifoxmock.com/m1/7814952-7562684-default/users */
export function createUser(body: user.User, options?: { [key: string]: any }) {
  return request<any>({
    url: `https://m1.apifoxmock.com/m1/7814952-7562684-default/users`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 获取用户 GET https://m1.apifoxmock.com/m1/7814952-7562684-default/users/{username} */
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
    url: `https://m1.apifoxmock.com/m1/7814952-7562684-default/users/${username}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新用户 PUT https://m1.apifoxmock.com/m1/7814952-7562684-default/users/{username} */
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
    url: `https://m1.apifoxmock.com/m1/7814952-7562684-default/users/${username}`,
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
/** 删除用户 DELETE https://m1.apifoxmock.com/m1/7814952-7562684-default/users/{username} */
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
    url: `https://m1.apifoxmock.com/m1/7814952-7562684-default/users/${username}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 登录 GET https://m1.apifoxmock.com/m1/7814952-7562684-default/login */
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
    url: `https://m1.apifoxmock.com/m1/7814952-7562684-default/login`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 登出 GET https://m1.apifoxmock.com/m1/7814952-7562684-default/logout */
export function logoutUser(options?: { [key: string]: any }) {
  return request<any>({
    url: `https://m1.apifoxmock.com/m1/7814952-7562684-default/logout`,
    method: 'GET',
    ...(options || {}),
  })
}
