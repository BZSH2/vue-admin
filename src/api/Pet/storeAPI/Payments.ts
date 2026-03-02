// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 支付订单 POST /apiPets/orders/{orderId}/payment */
export function createOrderPayment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    orderId: string
  },
  body: storeAPI.OrderPayment,
  options?: { [key: string]: any }
) {
  const { orderId, ...queryParams } = params
  return request<any>({
    url: `/apiPets/orders/${orderId}/payment`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  })
}
