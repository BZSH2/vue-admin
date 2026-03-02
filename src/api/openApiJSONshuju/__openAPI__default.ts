// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 获取openApi JSON数据 POST /openApi/postOpenApiJson */
export function postdefaultpostOpenApiJson(
  body?: { [key: string]: any },
  options?: { [key: string]: any }
) {
  return request<any>({
    url: `/openApi/postOpenApiJson`,
    method: 'POST',
    data: body,
    ...(options || {}),
  })
}
