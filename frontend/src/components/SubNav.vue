<script setup>
import ModalNewProduct from './ModalNewProduct.vue';

import { ref } from 'vue';

const emit = defineEmits(['success', 'error']); // Emissão de eventos para o componente pai

const modalNewProduct = ref(false); // Estado do modal
const toastNewProduct = ref(false); // Estado do toast


const closeModal = () => {
    modalNewProduct.value = false;
};

const handleNewProductModal = (data) => {
    toastNewProduct.value = true
    // Lógica para lidar com o evento de sucesso do modal
    emit('success');
    closeModal();
    setTimeout(() => {toastNewProduct.value = false, window.location.reload()}, 2000)
};

</script>

<template>
<BRow no-gutters>
        <BNav class="mb-2 mt-2">
            <BNavItem variant="dark" @click="modalNewProduct = !modalNewProduct"><IMdiPlus/>Adicionar Produto</BNavItem>
        </BNav>
        <BModal
                v-model="modalNewProduct"
                title="Adicionar Produto" 
                size="md" 
                hide-footer 
                centered 
                scrollable 
                no-header-close 
                no-footer
            >
                <ModalNewProduct
                @close="closeModal"
                @success="handleNewProductModal"
                     />
        </BModal>
</BRow>
<ToastMessages 
      :show-new-product="toastNewProduct"
      @update:show-new-product="(val) => toastNewProduct = val"
    />
</template>

<style scoped>

</style>