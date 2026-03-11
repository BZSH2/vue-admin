// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 用户注册 POST /api/auth/register */
export function authControllerRegister(
  body: LoginModule.RegisterDto,
  options?: { [key: string]: any }
) {
  return request<any>({
    url: `/api/auth/register`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 用户登录 POST /api/auth/login */
export function authControllerLogin(body: LoginModule.LoginDto, options?: { [key: string]: any }) {
  return request<any>({
    url: `/api/auth/login`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 用户登出 POST /api/auth/logout */
export function authControllerLogout(options?: { [key: string]: any }) {
  return request<any>({
    url: `/api/auth/logout`,
    method: 'POST',
    ...(options || {}),
  })
}
/** 刷新 Token POST /api/auth/refresh */
export function authControllerRefreshTokens(options?: { [key: string]: any }) {
  return request<any>({
    url: `/api/auth/refresh`,
    method: 'POST',
    ...(options || {}),
  })
}
