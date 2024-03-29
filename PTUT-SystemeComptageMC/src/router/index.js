// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/HomeView.vue'),
      },
    ],
  },
  {
    path: '/historique',
    component: () => import('@/layouts/default/HistoriqueLayout.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/layouts/default/AccountLayout.vue'),
    meta: {
      auth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
