/* eslint-disable */
import request from '@/utils/request'

export function usersControllerFindAll(
  params?: UserModule.QueryUserDto,
  options?: { [key: string]: any }
) {
  return request<UserModule.UserListResult>({
    url: '/api/users',
    method: 'GET',
    params,
    ...(options || {}),
  })
}

export function usersControllerCreate(
  body: UserModule.CreateUserDto,
  options?: { [key: string]: any }
) {
  return request<UserModule.UserListItem>({
    url: '/api/users',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

export function usersControllerFindOne(id: string, options?: { [key: string]: any }) {
  return request<UserModule.UserListItem>({
    url: `/api/users/${id}`,
    method: 'GET',
    ...(options || {}),
  })
}

export function usersControllerUpdate(
  id: string,
  body: UserModule.UpdateUserDto,
  options?: { [key: string]: any }
) {
  return request<UserModule.UserListItem>({
    url: `/api/users/${id}`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

export function usersControllerUpdateStatus(
  id: string,
  body: UserModule.UpdateUserStatusDto,
  options?: { [key: string]: any }
) {
  return request<UserModule.UserListItem>({
    url: `/api/users/${id}/status`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

export function usersControllerResetPassword(
  id: string,
  body: UserModule.ResetUserPasswordDto,
  options?: { [key: string]: any }
) {
  return request<UserModule.OperationMessageDto>({
    url: `/api/users/${id}/reset-password`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}
