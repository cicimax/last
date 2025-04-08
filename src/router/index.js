import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/loGin.vue')
  },
  {
    path: '/movie',
    name: 'Movie',
    component: () => import('../pages/MoIve.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../pages/User.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 这里可以添加登录状态检查
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 