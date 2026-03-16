import { request } from './instance'
import { setRefreshTokenHandler, setRequestErrorHandler } from './state'

/** 注入刷新 token 的处理函数 */
export { setRefreshTokenHandler }
/** 注入 request 层错误处理（例如 UI 弹窗提示） */
export { setRequestErrorHandler }

/** 默认导出请求方法 */
export default request
