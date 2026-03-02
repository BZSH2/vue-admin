// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 列出现有库存 GET /apiPets/inventories */
export function getInventory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 用于筛选库存状态的值（逗号分隔）。 */
    status?: string[]
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<any>({
    url: `/apiPets/inventories`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 创建订单 POST /apiPets/orders */
export function placeOrder(body: storeAPI.Order, options?: { [key: string]: any }) {
  return request<storeAPI.Order>({
    url: `/apiPets/orders`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 获取订单 GET /apiPets/orders/{id} */
export function getOrderById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 订单的唯一标识。 */
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<storeAPI.Order>({
    url: `/apiPets/orders/${id}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 删除订单 DELETE /apiPets/orders/{id} */
export function deleteOrder(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 订单的唯一标识。 */
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<any>({
    url: `/apiPets/orders/${id}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
