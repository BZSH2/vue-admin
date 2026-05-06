/**
 * Runtime Config (no rebuild needed)
 *
 * 这个文件会在页面加载时最先执行（在 /src/main.ts 之前），用于注入运行时配置：
 *
 *   window.__RUNTIME_CONFIG__
 *
 * 你可以在服务器上直接修改 dist/runtime-config.js（或挂载一个同名文件）
 * 来覆盖 API 地址，而无需重新打包前端。
 *
 * 注意：
 * - 这里的配置优先级高于 .env / import.meta.env
 * - 建议只放“运行时可变”的配置，不要放敏感信息
 */
;(function () {
  // 避免重复覆盖：如果已经被更早的脚本注入，则沿用已有值
  if (window.__RUNTIME_CONFIG__) return

  window.__RUNTIME_CONFIG__ = {
    /**
     * Axios 的 baseURL。
     *
     * 推荐：保持为 '/'，通过同域 Nginx 反代 /api -> 后端。
     * 如果你不走同域代理，也可以改成：'https://api.example.com'
     */
    apiBaseUrl: '/',
  }
})()
