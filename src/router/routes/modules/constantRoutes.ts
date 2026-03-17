const constantRoutes: Route.RouteRecord[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '系统登录',
      hidden: true,
      breadcrumbHidden: false,
      noKeepAlive: true,
    },
  },
  {
    path: '/403',
    name: 'ErrorPage403',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '403',
      hidden: true,
    },
  },
  {
    path: '/404',
    name: 'ErrorPage404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true,
    },
  },
  {
    path: '/unapproved',
    name: 'Unapproved',
    component: () => import('@/views/error/unApproved.vue'),
    meta: {
      title: '未授权',
      hidden: true,
    },
  },
  // 兜底路由：未匹配到的路径重定向到 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true },
  },
]

export default constantRoutes
