import type { RouteRecordRaw, RouteComponent, LocationQuery } from 'vue-router'

declare global {
  namespace Route {
    /**
     * 自定义路由记录接口
     * 继承自 vue-router 的 RouteRecordRaw，并对部分字段进行覆盖或扩展
     */
    interface RouteRecord extends Omit<
      RouteRecordRaw,
      'name' | 'meta' | 'children' | 'component' | 'query'
    > {
      /** 路由名称 (必填，作为路由唯一标识) */
      name: string
      /** 路由元数据 (必填) */
      meta: RouteMeta
      /** 子路由列表 */
      children?: RouteRecord[]
      /** 子路由路径列表 (用于权限控制等) */
      childrenPathList?: string[]
      /** 父级图标 (用于折叠菜单等场景) */
      parentIcon?: string
      /** 重定向地址 */
      redirect?: string
      /** 是否隐藏 (可能用于动态权限过滤) */
      isHidden?: boolean
      /** 路由参数 */
      query?: LocationQuery
      /** 组件 (支持异步加载) */
      component?: RouteComponent | (() => Promise<RouteComponent>)
    }

    /**
     * 路由元数据接口
     * 用于配置菜单、权限、缓存等页面级特性
     */
    interface RouteMeta {
      /**
       * 菜单标题
       * @description 显示在侧边栏、面包屑、Tab栏
       */
      title?: string

      /**
       * 图标
       * @description 侧边栏菜单图标
       */
      icon?: string

      /**
       * 是否在菜单中隐藏
       * @default false
       * @description true: 不在侧边栏显示, false: 显示
       */
      hidden?: boolean

      /**
       * 权限角色/标识
       * @description 用于路由权限控制
       */
      guard?: string[]

      /**
       * 是否缓存
       * @default true (注意：noKeepAlive=true 时才不缓存)
       * @description true: 开启 keep-alive, false: 不开启
       */
      noKeepAlive?: boolean

      /**
       * 高亮指定菜单
       * @description 比如在访问详情页时，侧边栏高亮对应的列表页
       */
      activeMenu?: string

      /**
       * 是否隐藏面包屑
       * @default false
       */
      breadcrumbHidden?: boolean

      /**
       * 是否在 Tab 栏隐藏
       * @default false
       */
      tabHidden?: boolean

      /**
       * Tab 栏是否不可关闭
       * @default false
       */
      noClosable?: boolean

      /**
       * Badge 徽标内容
       * @description 显示在菜单名称右侧
       */
      badge?: string

      /**
       * 是否显示 Badge 小圆点
       * @default false
       */
      dot?: boolean

      /**
       * 是否是自定义 SVG 图标
       * @default false
       * @description true: 使用 src/icons/svg 下的图标, false: 使用 Element Plus 图标
       */
      isCustomSvg?: boolean

      /**
       * 动态路由是否新开 Tab
       * @default false
       */
      dynamicNewTab?: boolean

      /**
       * 链接打开目标
       * @description '_blank': 新窗口打开, false: 当前窗口打开
       */
      target?: '_blank' | false

      /**
       * 外链地址
       * @description 如果配置了 href，点击菜单将跳转到该地址
       */
      href?: string

      /**
       * 是否隐藏一级菜单
       * @default true
       */
      levelHidden?: boolean

      /**
       * 是否隐藏侧边栏
       * @default false
       * @description 用于某些全屏页面
       */
      noColumn?: boolean

      /**
       * 是否第二级没有子级
       * @description 用于菜单渲染优化
       */
      isLevel2?: boolean

      /**
       * 是否是第一级
       * @description 用于菜单渲染优化
       */
      isLevel1?: boolean

      /**
       * 菜单折叠后的副标题
       */
      subTitle?: string

      /**
       * 是否移除页面 Padding
       * @default false
       */
      noPadding?: boolean

      /**
       * 是否开启页面配置化账号关联
       * @deprecated 可能已废弃或特定业务相关
       */
      isCache?: boolean

      /**
       * 微前端子应用名称
       */
      microAppName?: string
    }
  }
}
