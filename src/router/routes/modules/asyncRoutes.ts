/** 动态的路由配置 需与后端接口配合 才有有权限访问 */
const asyncRoutes: Route.RouteRecord[] = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/layout/index.vue'),
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
          icon: 'menus-amazed',
        },
      },
      {
        path: '/system',
        name: 'System',
        redirect: '/system/user',
        meta: {
          title: '系统管理',
          noClosable: true,
          isLevel1: true,
          noKeepAlive: false,
          icon: 'menus-blink',
        },
        children: [
          {
            path: '/system/user',
            name: 'SystemUser',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
              title: '用户管理',
              noClosable: true,
              isLevel1: true,
              noKeepAlive: false,
            },
          },
          {
            path: '/system/role',
            name: 'SystemRole',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
              title: '角色管理',
              noClosable: true,
              isLevel1: true,
              noKeepAlive: false,
            },
          },
        ],
      },
    ],
  },
]

export default asyncRoutes
