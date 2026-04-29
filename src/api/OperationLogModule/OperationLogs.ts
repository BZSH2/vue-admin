// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 分页查询操作日志 GET /api/operation-logs */
export function operationLogsControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    page?: number

    pageSize?: number

    keyword?: string

    method?: string
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<any>({
    url: `/api/operation-logs`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
