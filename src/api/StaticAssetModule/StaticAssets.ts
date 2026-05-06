// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 分页查询静态资源 GET /api/static-assets */
export function staticAssetsControllerFindAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    page?: number

    pageSize?: number

    keyword?: string

    folder?: string

    fileType?: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other'
    /** 是否仅查询图片资源；为 true 时优先按 image 类型筛选 */
    imagesOnly?: boolean
    /** 是否仅查询未分组资源；为 true 时忽略 folder 精确筛选 */
    uncategorizedOnly?: boolean
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<Request.UnwrapApiResponse<StaticAssetModule.StaticAssetListResponseDto>>({
    url: `/api/static-assets`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 获取静态资源目录分组 GET /api/static-assets/folders */
export function staticAssetsControllerFindFolders(options?: { [key: string]: any }) {
  return request<Request.UnwrapApiResponse<StaticAssetModule.StaticAssetFolderOptionsResponseDto>>({
    url: `/api/static-assets/folders`,
    method: 'GET',
    ...(options || {}),
  })
}
/** 查询静态资源详情 GET /api/static-assets/{id} */
export function staticAssetsControllerFindOne(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<StaticAssetModule.StaticAssetDetailResponseDto>>({
    url: `/api/static-assets/${id}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 删除静态资源 DELETE /api/static-assets/{id} */
export function staticAssetsControllerRemove(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<StaticAssetModule.OperationMessageResponseDto>>({
    url: `/api/static-assets/${id}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新静态资源元信息 PATCH /api/static-assets/{id} */
export function staticAssetsControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    id: string
  },
  body: StaticAssetModule.UpdateStaticAssetDto,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<Request.UnwrapApiResponse<StaticAssetModule.StaticAssetDetailResponseDto>>({
    url: `/api/static-assets/${id}`,
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
/** 上传静态资源 POST /api/static-assets/upload */
export function staticAssetsControllerUpload(options?: { [key: string]: any }) {
  return request<Request.UnwrapApiResponse<StaticAssetModule.StaticAssetDetailResponseDto>>({
    url: `/api/static-assets/upload`,
    method: 'POST',
    ...(options || {}),
  })
}
/** 批量删除静态资源 DELETE /api/static-assets/batch */
export function staticAssetsControllerBatchRemove(
  body: StaticAssetModule.BatchDeleteStaticAssetsDto,
  options?: { [key: string]: any }
) {
  return request<Request.UnwrapApiResponse<StaticAssetModule.BatchDeleteStaticAssetsResponseDto>>({
    url: `/api/static-assets/batch`,
    method: 'DELETE',
    params: {
      ...(body || {}),
    },
    ...(options || {}),
  })
}
