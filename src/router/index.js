import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    redirect: '/main',
    component: () => import('@/layouts/default/DefaultView.vue'),
    children: [
      {
        path: '/main',
        component: () => import('../views/MainView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/cabinet',
        component: () => import('../views/CabinetView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/manager',
        name: 'manager',
        component: () => import('../views/roles/ManagerView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/roles/AdminView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/director',
        name: 'director',
        component: () => import('../views/roles/DirectorView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/tehnologist',
        name: 'tehnologist',
        component: () => import('../views/roles/TehnologistView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/design',
        name: 'design',
        component: () => import('../views/roles/DesignView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/metrings',
        name: 'metrings',
        component: () => import('../views/roles/MetringsView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/page/:id', // :id is the route parameter
        name: 'PageDetail',
        component: () => import('@/views/orders/PageDetail.vue') // Create this component
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/layouts/general/GeneralView.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('../views/login/LoginView.vue')
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router
