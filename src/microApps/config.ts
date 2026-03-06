import type { RegistrableApp } from 'qiankun'

/**
 * qiankun 子应用配置
 * 在这里集中描述每一个微应用的 name / entry / activeRule 等信息
 * 使用类型别名与 RegistrableApp 组合，避免接口继承非纯对象类型导致的 TS 报错
 */
export type MicroAppConfig = RegistrableApp<any> & {
  /**
   * 子应用激活规则
   * 通常为路由前缀，例如 '/sub-app'，当路径以该前缀开头时加载对应子应用
   */
  activeRule: string
}

/**
 * 当前注册的所有子应用列表
 * 如需接入新的微应用，在此数组中追加配置项
 */
export const microApps: MicroAppConfig[] = [
  {
    name: 'vue-photo-shop',
    entry: '',
    container: '#micro-app-photo-shop',
    activeRule: '/photo-shop',
  },
]
