<script setup>
import { ref, computed } from 'vue';
import NewOrder from './ModalNewOrder.vue';
import ToastMessages from './ToastMessages.vue';
import api from '@/services/http';

const emit = defineEmits(['success']); // Emissão de eventos para o componente pai

const NewOrderModal = ref(false); // Modal para novo pedido
const toastNewOrder = ref(false); // Toast para novo pedido
const search = ref(false); // Variável para controle do campo de busca
const searchTerm = ref(''); // Termo de busca
const searchResults = ref([]); // Resultados da busca
const showResults = ref(false); // Controle de exibição dos resultados

// Computed para verificar se estamos na página de clientes
const isClientesPage = computed(() => {
  return window.location.pathname === '/dashboard/clientes';
});

const closeModal = () => {
  NewOrderModal.value = false; // Fecha o modal
}

const handleNewOrder = () => {
  toastNewOrder.value = true
  setTimeout(() => {
    emit('success') // Emite o evento de sucesso
    toastNewOrder.value = false
    if (window.location.pathname !== '/dashboard/resumo') {
      window.location.reload() // Recarrega a página se não estiver no dashboard
    }
  }, 1500)
}

const buscarClientes = async () => {
  if (!searchTerm.value) {
    searchResults.value = [];
    showResults.value = false;
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`api/clientes/buscar/`, {
      params: { termo: searchTerm.value },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    searchResults.value = response.data;
    showResults.value = true;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    searchResults.value = [];
  }
};

const selecionarCliente = (cliente) => {
  // Emite evento com o cliente selecionado
  emit('cliente-selecionado', cliente);
  searchTerm.value = '';
  searchResults.value = [];
  showResults.value = false;
  search.value = false;
};
</script>

<template>
    <BRow no-gutters>
        <BNav class="mb-2 mt-2">
            <BNavItem variant="dark" @click="NewOrderModal = !NewOrderModal"><IMdiPlus/>Novo Pedido</BNavItem>
            <BNavItem v-if="isClientesPage" variant="dark" @click="search = !search"><IMdiAccountSearch/>Buscar Cliente</BNavItem>
            <BInputGroup v-show="search" sm="auto" class="mb-2">
                <BFormInput 
                    v-model="searchTerm" 
                    placeholder="Digite o nome, CPF ou telefone do cliente"
                    @input="buscarClientes"
                />
                <BButton variant="outline-secondary"><IMdiMagnify/></BButton>
            </BInputGroup>
            <BModal
                v-model="NewOrderModal"
                title="Novo Pedido" 
                size="md" 
                hide-footer 
                centered 
                scrollable 
                no-header-close 
                no-footer
            >
                <NewOrder
                    @success="handleNewOrder" 
                    @close="closeModal"
                />
            </BModal>
        </BNav>
        <hr>
    </BRow>

    <!-- Resultados da busca -->
    <div v-if="showResults && searchResults.length > 0" class="search-results">
        <BListGroup>
            <BListGroupItem 
                v-for="cliente in searchResults" 
                :key="cliente.id_cliente"
                @click="selecionarCliente(cliente)"
                button
            >
                {{ cliente.nome }} - CPF: {{ cliente.cpf }} - Tel: {{ cliente.telefone }}
            </BListGroupItem>
        </BListGroup>
    </div>

    <ToastMessages 
        :show-new-order="toastNewOrder"
        @update:show-new-order="(val) => toastNewOrder = val"
    />
</template>

<style scoped>
.search-results {
    position: absolute;
    z-index: 1000;
    width: 100%;
    max-width: 500px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-results .list-group-item {
    cursor: pointer;
}

.search-results .list-group-item:hover {
    background-color: #f8f9fa;
}
</style>