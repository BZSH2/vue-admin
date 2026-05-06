// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 修改密码 POST /api/auth/change-password */
export function authControllerChangePassword(
  body: ProfileModule.ChangePasswordDto,
  options?: { [key: string]: any }
) {
  return request<Request.UnwrapApiResponse<ProfileModule.OperationMessageResponseDto>>({
    url: `/api/auth/change-password`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 获取个人信息 GET /api/auth/profile */
export function authControllerGetProfile(options?: { [key: string]: any }) {
  return request<Request.UnwrapApiResponse<ProfileModule.AuthProfileResponseDto>>({
    url: `/api/auth/profile`,
    method: 'GET',
    ...(options || {}),
  })
}
