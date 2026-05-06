// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 分页查询系统参数 GET /api/configs */
export function systemConfigsControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    page?: number

    pageSize?: number

    keyword?: string

    groupName?: string
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<Request.UnwrapApiResponse<any>>({
    url: `/api/configs`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 创建系统参数 POST /api/configs */
export function systemConfigsControllerCreate(
  body: SystemConfigModule.CreateSystemConfigDto,
  options?: { [key: string]: any }
) {
  return request<Request.UnwrapApiResponse<SystemConfigModule.SystemConfig>>({
    url: `/api/configs`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 按配置键查询系统参数 GET /api/configs/key/{key} */
export function systemConfigsControllerFindByKey(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    key: string
  },
  options?: { [key: string]: any }
) {
  const { key, ...queryParams } = params
  return request<Request.UnwrapApiResponse<SystemConfigModule.SystemConfig>>({
    url: `/api/configs/key/${key}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 查询系统参数详情 GET /api/configs/{id} */
export function systemConfigsControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<SystemConfigModule.SystemConfig>>({
    url: `/api/configs/${id}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 删除系统参数 DELETE /api/configs/{id} */
export function systemConfigsControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<any>>({
    url: `/api/configs/${id}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新系统参数 PATCH /api/configs/{id} */
export function systemConfigsControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  body: SystemConfigModule.UpdateSystemConfigDto,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<any>>({
    url: `/api/configs/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  })
}
