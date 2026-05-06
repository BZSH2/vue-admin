// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 分页查询自定义表单 GET /api/custom-forms */
export function customFormsControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    page?: number

    pageSize?: number

    keyword?: string
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<Request.UnwrapApiResponse<CustomFormModule.CustomFormListResponseDto>>({
    url: `/api/custom-forms`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 创建自定义表单 POST /api/custom-forms */
export function customFormsControllerCreate(
  body: CustomFormModule.CreateCustomFormDto,
  options?: { [key: string]: any }
) {
  return request<Request.UnwrapApiResponse<CustomFormModule.CustomFormDetailResponseDto>>({
    url: `/api/custom-forms`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 按编码查询自定义表单 GET /api/custom-forms/code/{code} */
export function customFormsControllerFindByCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    code: string
  },
  options?: { [key: string]: any }
) {
  const { code, ...queryParams } = params
  return request<Request.UnwrapApiResponse<CustomFormModule.CustomFormDetailResponseDto>>({
    url: `/api/custom-forms/code/${code}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 查询自定义表单详情 GET /api/custom-forms/{id} */
export function customFormsControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<CustomFormModule.CustomFormDetailResponseDto>>({
    url: `/api/custom-forms/${id}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 删除自定义表单 DELETE /api/custom-forms/{id} */
export function customFormsControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<CustomFormModule.OperationMessageResponseDto>>({
    url: `/api/custom-forms/${id}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新自定义表单 PATCH /api/custom-forms/{id} */
export function customFormsControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  body: CustomFormModule.UpdateCustomFormDto,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<CustomFormModule.CustomFormDetailResponseDto>>({
    url: `/api/custom-forms/${id}`,
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
