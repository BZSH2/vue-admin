// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取宠物 GET /apiPets/pets/{id} */
export function getPetById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 宠物的唯一标识。 */
    id: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<petsAPI.Pet>({
    url: `/apiPets/pets/${id}`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 更新宠物 PUT /apiPets/pets/{id} */
export function updatePet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 宠物的唯一标识。 */
    id: string
  },
  body: petsAPI.Pet,
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<petsAPI.Pet>({
    url: `/apiPets/pets/${id}`,
    method: 'PUT',
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
/** 删除宠物 DELETE /apiPets/pets/{id} */
export function deletePet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 宠物的唯一标识。 */
    id: string
    /** 授权所需的 API 密钥（如有）。 */
    api_key?: string
  },
  options?: { [key: string]: any }
) {
  const { id, ...queryParams } = params
  return request<any>({
    url: `/apiPets/pets/${id}`,
    method: 'DELETE',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 列出宠物 GET /apiPets/pets */
export function findPetsByStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 用于筛选宠物状态的值（接受逗号分隔值）。 */
    status?: 'available' | 'pending' | 'sold'[]
    /** 按标签筛选结果（接受逗号分隔或重复参数）。 */
    tags?: string[]
  },
  options?: { [key: string]: any }
) {
  const { ...queryParams } = params
  return request<petsAPI.Pet[]>({
    url: `/apiPets/pets`,
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
/** 创建宠物 POST /apiPets/pets */
export function addPet(body: petsAPI.Pet, options?: { [key: string]: any }) {
  return request<any>({
    url: `/apiPets/pets`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
    data: body,
    ...(options || {}),
  })
}
/** 上传宠物图片 POST /apiPets/pets/{petId}/images */
export function uploadFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: {
    /** 宠物的唯一标识。 */
    id: string

    petId: string
  },
  options?: { [key: string]: any }
) {
  const { id, petId, ...queryParams } = params
  return request<petsAPI.ApiResponse>({
    url: `/apiPets/pets/${petId}/images`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}
