import Layout from '@/layout/index.vue'

const asyncRoutes: Route.RouteRecord[] = [
  {
    path: '/',
    name: 'Index',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: '首页',
      levelHidden: true,
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          noClosable: true,
          isLevel1: true,
          noKeepAlive: false,
        },
      },
      {
        path: '/icons',
        name: 'Icons',
        component: () => import('@/views/icons/index.vue'),
        meta: {
          title: '图标',
          noClosable: true,
          isLevel1: true,
          noKeepAlive: false,
        },
      },
    ],
  },
]

export default asyncRoutes
