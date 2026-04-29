// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 分页查询 DNS 关联 GET /api/dns-relations */
export function dnsRelationsControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    page?: number

    pageSize?: number

    keyword?: string

    environment?: 'dev' | 'test' | 'staging' | 'uat' | 'prod'

    enabled?: boolean
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<any>({
    url: `/api/dns-relations`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 创建 DNS 关联 POST /api/dns-relations */
export function dnsRelationsControllerCreate(
  body: DnsRelationModule.CreateDnsRelationDto,
  options?: { [key: string]: any }
) {
  return request<DnsRelationModule.DnsRelation>({
    url: `/api/dns-relations`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 查询 DNS 关联详情 GET /api/dns-relations/{id} */
export function dnsRelationsControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<DnsRelationModule.DnsRelation>({
    url: `/api/dns-relations/${id}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 删除 DNS 关联 DELETE /api/dns-relations/{id} */
export function dnsRelationsControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<any>({
    url: `/api/dns-relations/${id}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新 DNS 关联 PATCH /api/dns-relations/{id} */
export function dnsRelationsControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  body: DnsRelationModule.UpdateDnsRelationDto,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<any>({
    url: `/api/dns-relations/${id}`,
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
