/* eslint-disable */
import request from '@/utils/request'

export function systemConfigsControllerFindAll(
  params?: SystemConfigModule.QuerySystemConfigDto,
  options?: { [key: string]: any }
) {
  return request<SystemConfigModule.SystemConfigListResult>({
    url: '/api/configs',
    method: 'GET',
    params,
    ...(options || {}),
  })
}

export function systemConfigsControllerCreate(
  body: SystemConfigModule.CreateSystemConfigDto,
  options?: { [key: string]: any }
) {
  return request<SystemConfigModule.SystemConfigItem>({
    url: '/api/configs',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

export function systemConfigsControllerUpdate(
  id: string,
  body: SystemConfigModule.UpdateSystemConfigDto,
  options?: { [key: string]: any }
) {
  return request<SystemConfigModule.SystemConfigItem>({
    url: `/api/configs/${id}`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: body,
    ...(options || {}),
  })
}

export function systemConfigsControllerRemove(id: string, options?: { [key: string]: any }) {
  return request<SystemConfigModule.OperationMessageDto>({
    url: `/api/configs/${id}`,
    method: 'DELETE',
    ...(options || {}),
  })
}
