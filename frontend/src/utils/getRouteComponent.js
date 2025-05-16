import { defineAsyncComponent } from 'vue';

const pages = {
  resumo: defineAsyncComponent(() => import('@/views/Dashboard/DashboardResumo.vue')),
  estoque: defineAsyncComponent(() => import('@/views/Dashboard/DashboardEstoque.vue')),
  compras: defineAsyncComponent(() => import('@/views/Dashboard/DashboardCompras.vue')),
  pedidos: defineAsyncComponent(() => import('@/views/Dashboard/DashboardPedidos.vue')),
  vendas: defineAsyncComponent(() => import('@/views/Dashboard/DashboardVendas.vue')),
  clientes: defineAsyncComponent(() => import('@/views/Dashboard/DashboardClientes.vue')),
};

export function getRouteComponent(pathname = window.location.pathname) {
  const path = pathname.split('/')[2];
  return pages[path] || pages.resumo;
}
