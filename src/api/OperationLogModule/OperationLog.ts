/* eslint-disable */
import request from '@/utils/request'

export function operationLogsControllerFindAll(
  params?: OperationLogModule.QueryOperationLogDto,
  options?: { [key: string]: any }
) {
  return request<OperationLogModule.OperationLogListResult>({
    url: '/api/operation-logs',
    method: 'GET',
    params,
    ...(options || {}),
  })
}
