import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import { useMainStore } from '@/stores/session';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        title: 'H2OControl - Login',
        public: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        title: 'H2OControl - Dashboard',
        requiresAuth: true
      }
    }
  ],
})

router.beforeEach((to) => {
  const auth = useMainStore();

  if (to.meta.requiresAuth && !auth.sessionActive) {
    return { name: 'login' }
  }
  if (to.meta.public && auth.sessionActive) {
    return { name: 'dashboard' } // Redireciona logados para dashboard
  }
});


export default router
