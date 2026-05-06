// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 分页查询登录日志 GET /api/login-logs */
export function loginLogsControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    page?: number

    pageSize?: number

    keyword?: string

    success?: boolean
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<Request.UnwrapApiResponse<any>>({
    url: `/api/login-logs`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
