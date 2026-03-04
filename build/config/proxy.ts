import type { ProxyOptions } from 'vite'

/**
 * 创建用于Vite开发服务器的代理配置。
 * 此配置将本地请求代理到指定的后端API服务，用于解决开发时的跨域问题。
 *
 * @returns {Record<string, string | ProxyOptions> | undefined} 返回Vite格式的代理配置对象。
 *          如果无需代理，可返回 undefined。
 */
export function createViteProxy(): Record<string, ProxyOptions> | undefined {
  return {
    'https://m1.apifoxmock.com/m1/7814952-7562684-default': {
      // 代理目标地址，请替换为实际的后端服务地址
      target: 'https://m1.apifoxmock.com/m1/7815334-7563082-default',
      changeOrigin: true, // 如果target是域名，建议开启此选项
      secure: false, // 如果目标服务使用自签名证书，需设置为false
      rewrite: (path: string) => path.replace(/^\/apiPets/, ''), // 重写路径，移除请求前缀
    },
    '/openApi': {
      // 示例中的目标地址不完整，已替换为可工作的示例地址
      target: 'https://m1.apifoxmock.com/m1/7827428-7575526-default',
      changeOrigin: true,
      secure: false,
      rewrite: (path: string) => path.replace(/^\/openApi/, ''),
    },
  }
}

/**
 * 从代理配置中提取并生成一个反向映射表。
 * 此函数将 `createViteProxy` 生成的配置（路径前缀到代理选项的映射）转换为
 * **代理目标地址（target）到路径前缀** 的映射，方便在其他逻辑中通过API地址查找对应的代理前缀。
 *
 * @example
 * // 假设代理配置为 { ‘/api’: { target: ‘https://api.example.com‘ } }
 * // 则返回 { ‘https://api.example.com‘: ‘/api’ }
 *
 * @returns {Record<string, string>} 一个对象，其键（key）为代理目标地址（target），
 *          值（value）为配置中对应的请求路径前缀。
 */
export function getProxyApi(): Record<string, string> {
  const proxyConfig = createViteProxy()
  const reverseMap: Record<string, string> = {}

  // 如果未配置代理，返回空对象
  if (!proxyConfig) {
    return reverseMap
  }

  for (const [prefix, options] of Object.entries(proxyConfig)) {
    // 确保配置项是ProxyOptions对象且包含target
    if (options && typeof options === 'object' && 'target' in options) {
      const target = (options as ProxyOptions).target as string
      // 确保target是有效的非空字符串，再将其作为键
      if (target && typeof target === 'string' && target.trim() !== '') {
        reverseMap[target] = prefix
      } else {
        console.warn(`代理前缀 "${prefix}" 的 target 为空或无效，已跳过。`)
      }
    }
  }

  return reverseMap
}
