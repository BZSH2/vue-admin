// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 分页查询产品 GET /api/products */
export function productsControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 页码 */
    page?: number
    /** 每页数量 */
    pageSize?: number
    /** 搜索关键字（产品名称/产品代码） */
    keyword?: string
    /** 产品状态 */
    status?: boolean
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<Request.UnwrapApiResponse<any>>({
    url: `/api/products`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 创建产品 POST /api/products */
export function productsControllerCreate(
  body: ProductModule.CreateProductDto,
  options?: { [key: string]: any }
) {
  return request<Request.UnwrapApiResponse<ProductModule.Product>>({
    url: `/api/products`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 查询产品详情 GET /api/products/{id} */
export function productsControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<ProductModule.Product>>({
    url: `/api/products/${id}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 删除产品 DELETE /api/products/{id} */
export function productsControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<any>>({
    url: `/api/products/${id}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新产品 PATCH /api/products/{id} */
export function productsControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  body: ProductModule.UpdateProductDto,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<any>>({
    url: `/api/products/${id}`,
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
