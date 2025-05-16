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
      component: () => import('../views/Dashboard/DashboardView.vue'),
      redirect: { name: 'dashboard.resumo' },
      meta: {
        title: 'H2OControl - Dashboard',
        requiresAuth: true,
      },
      children: [
        {
          path: 'resumo',
          name: 'dashboard.resumo',
          component: () => import('../views/Dashboard/DashboardResumo.vue'),
        },
        {
          path: 'estoque',
          name: 'dashboard.estoque',
          component: () => import('../views/Dashboard/DashboardEstoque.vue'),
        },
        {
          path: 'compras',
          name: 'dashboard.compras',
          component: () => import('../views/Dashboard/DashboardCompras.vue'),
        },
        {
          path: 'pedidos',
          name: 'dashboard.pedidos',
          component: () => import('../views/Dashboard/DashboardPedidos.vue'),
        },
        {
          path: 'vendas',
          name: 'dashboard.vendas',
          component: () => import('../views/Dashboard/DashboardVendas.vue'),
        },
        {
          path: 'clientes',
          name: 'dashboard.clientes',
          component: () => import('../views/Dashboard/DashboardClientes.vue'),
        },
      ]
    }
  ],
})

router.beforeEach((to) => {
  const auth = useMainStore();

  if (to.meta.requiresAuth && !auth.sessionActive) {
    return { name: 'login' }
  }
  if (to.meta.public && auth.sessionActive) {
    return { name: 'dashboard.resumo' } // Redireciona logados para dashboard
  }
});


export default router
