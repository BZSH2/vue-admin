import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '@/views/dashboard/index.vue'

const { BASE_URL } = import.meta.env

const router = createRouter({
  history: createWebHashHistory(BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/403',
      name: 'Page403',
      component: () => import('@/views/error/403.vue'),
      meta: {
        title: '403',
        hidden: true,
      },
    },
    {
      path: '/404',
      name: 'Page404',
      component: () => import('@/views/error/404.vue'),
      meta: {
        title: '404',
        hidden: true,
      },
    },
    // Catch-all route for 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

export default router
