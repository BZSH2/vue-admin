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
          icon: 'menus-orangeCat',
        },
      },
      {
        path: '/system',
        name: 'System',
        redirect: '/system/users',
        meta: {
          title: '系统管理',
          noClosable: true,
          isLevel1: true,
          noKeepAlive: false,
          icon: 'menus-tibetanMastiff',
        },
        children: [
          {
            path: '/system/users',
            name: 'UserManagement',
            component: () => import('@/views/system/userManagement/index.vue'),
            meta: {
              title: '用户管理',
              noClosable: true,
              isLevel1: true,
              noKeepAlive: false,
            },
          },
          {
            path: '/system/roleManagement',
            name: 'RoleManagement',
            component: () => import('@/views/system/roleManagement/index.vue'),
            meta: {
              title: '角色管理',
              noClosable: true,
              isLevel1: true,
              noKeepAlive: false,
            },
          },
          {
            path: '/system/menus',
            name: 'MenuManagement',
            component: () => import('@/views/system/menuManagement/index.vue'),
            meta: {
              title: '菜单管理',
              noClosable: true,
              isLevel1: true,
              noKeepAlive: false,
            },
          },
          {
            path: '/system/configs',
            name: 'SystemConfig',
            component: () => import('@/views/system/systemConfig/index.vue'),
            meta: {
              title: '系统参数',
              noClosable: true,
              isLevel1: true,
              noKeepAlive: false,
            },
          },
          {
            path: '/system/loginLogs',
            name: 'LoginLog',
            component: () => import('@/views/system/loginLog/index.vue'),
            meta: {
              title: '登录日志',
              noClosable: true,
              isLevel1: true,
              noKeepAlive: false,
            },
          },
          {
            path: '/system/operationLogs',
            name: 'OperationLog',
            component: () => import('@/views/system/operationLog/index.vue'),
            meta: {
              title: '操作日志',
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
