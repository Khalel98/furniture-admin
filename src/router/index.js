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
        component: () => import('../views/director/MainView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/staff',
        component: () => import('../views/director/StaffView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/orders',
        component: () => import('../views/director/OrdersView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/client',
        component: () => import('../views/director/ClientView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/calendar',
        component: () => import('../views/director/CalendarView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/video',
        component: () => import('../views/director/VideoView.vue'),
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
        path: '/positions',
        name: 'positions',
        component: () => import('../views/admin/PositionView.vue'),
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
        path: '/technologists',
        name: 'technologists',
        component: () => import('../views/roles/TehnologistView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/page/:id', // :id is the route parameter
        name: 'PageDetail',
        component: () => import('@/views/orders/OrderPage.vue'), // Create this component,
        children: [
          {
            path: '/:id/:position', // :id is the route parameter
            name: 'files',
            component: () => import('@/views/orders/FileView.vue') // Create this component
          }
        ]
      },
      {
        path: ':id/:position', // :id is the route parameter
        name: 'files',
        component: () => import('@/views/orders/FileView.vue') // Create this component
      },

      // cheh
      {
        path: '/foreman',
        component: () => import('../views/workshop/ForemanView.vue'),
        meta: { requiresAuth: true }
      },

      {
        path: '/workshop/:position',
        name: 'workshop',
        component: () => import('../views/roles/WorkshopView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/reg-me',
        component: () => import('../views/RegMe.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

  {
    path: '/',
    component: () => import('@/layouts/general/GeneralView.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/login/LoginView.vue')
      },
      {
        path: 'tablo',
        name: 'tablo',
        component: () => import('../views/table/TabloView.vue')
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
