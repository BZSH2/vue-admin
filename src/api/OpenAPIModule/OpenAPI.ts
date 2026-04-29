// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** Get OpenAPI JSON for modules POST /api/postOpenApiJson */
export function openApiControllerPostOpenApiJson(
  body: OpenAPIModule.PostOpenApiDto,
  options?: { [key: string]: any }
) {
  return request<any[]>({
    url: `/api/postOpenApiJson`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
/** Get available modules and services GET /api/getModules */
export function openApiControllerGetModules(options?: { [key: string]: any }) {
  return request<any[]>({
    url: `/api/getModules`,
    method: 'GET',
    ...(options || {}),
  })
}
/** Get OpenAPI JSON for postOpenApiJson endpoint GET /api/getPostOpenApiJsonDefinition */
export function openApiControllerGetPostOpenApiJsonDefinition(options?: { [key: string]: any }) {
  return request<any[]>({
    url: `/api/getPostOpenApiJsonDefinition`,
    method: 'GET',
    ...(options || {}),
  })
}
