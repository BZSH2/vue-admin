/* eslint-disable */
import request from '@/utils/request'

export function loginLogsControllerFindAll(
  params?: LoginLogModule.QueryLoginLogDto,
  options?: { [key: string]: any }
) {
  return request<LoginLogModule.LoginLogListResult>({
    url: '/api/login-logs',
    method: 'GET',
    params,
    ...(options || {}),
  })
}
