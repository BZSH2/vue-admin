export const settingConfig = {
  title: 'Vue Admin',
  titleSeparator: ' - ',
  /**
   * token失效回退到登录页时是否记录本次的路由（是否记录当前tab页）
   */
  recordRoute: true,
  /**
   * 语言类型zh、en
   */
  i18n: 'zh-CN',
  /**
   * 路由模式，是否为hash模式
   */
  isHashRouterMode: false,
  /**
  /**
   * 消息框消失时间
   */
  messageDuration: 2000,
  /**
   * 黑夜模式
   */
  showDark: false,
  /**
   * 主题色
   */
  primaryColor: '#1684fc',
  /**
   * 全局文字大小档位
   */
  fontSizeLevel: 'default',
  /**
   * 白名单路由
   */
  routesWhiteList: ['/login', '/404', '/403'],
  /**
   * intelligence(前端导出路由)和 all(后端导出路由)两种方式
   */
  authentication: 'all',
}
