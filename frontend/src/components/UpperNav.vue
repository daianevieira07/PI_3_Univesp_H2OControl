<script setup>
import { ref } from 'vue';
import NewOrder from './ModalNewOrder.vue';
import ToastMessages from './ToastMessages.vue';

const emit = defineEmits(['success']); // Emissão de eventos para o componente pai

const NewOrderModal = ref(false); // Modal para novo pedido
const toastNewOrder = ref(false); // Toast para novo pedido
const search = ref(false); // Variável para controle do campo de busca

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
</script>

<template>
    <BRow no-gutters>
        <BNav class="mb-2 mt-2">
            <BNavItem variant="dark" @click="NewOrderModal = !NewOrderModal"><IMdiPlus/>Novo Pedido</BNavItem>
            <BNavItem variant="dark" @click="search = !search" ><IMdiAccountSearch/>Buscar Cliente
            </BNavItem>
            <BInputGroup v-show="search" sm="auto" class="mb-2">
                <BFormInput placeholder="Digite o nome do cliente" />
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

    <ToastMessages 
      :show-new-order="toastNewOrder"
      @update:show-new-order="(val) => toastNewOrder = val"
    />
</template>

<style scoped>
</style>