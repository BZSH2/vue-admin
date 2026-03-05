const constantRoutes: Route.RouteRecord[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
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
      hidden: true,
    },
  },
  {
    path: '/404',
    name: 'ErrorPage404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/unapproved',
    name: 'Unapproved',
    component: () => import('@/views/error/unApproved.vue'),
    meta: {
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
