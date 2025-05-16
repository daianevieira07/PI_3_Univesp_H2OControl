<script setup>

import { ref } from 'vue';

const emit = defineEmits(['removeItem', 'close']);

const quantidade = ref(''); // Variável para armazenar o item a ser removido
const handleSubmit = (e) => {
    e.preventDefault();
    if (quantidade.value <= 0) {
        emit('error', 'A quantidade deve ser maior que 0');
        return;
    }
    const data = {
        quantidade: quantidade.value,
    };
    emit('removeItem', data); // Emite o evento de remoção com os dados do item
    emit('close'); // Fecha o modal
};

</script>

<template>
    <BRow>
        <BForm @submit.prevent="handleSubmit">
            <BFormGroup label="" label-for="remove-item">
                <BFormInput id="remove-item" v-model="quantidade" placeholder="Digite a quantidade do item a ser removido" :state="quantidade>0?null:false" required />
                <BFormInvalidFeedback> A quantidade deve ser maior que 0 </BFormInvalidFeedback>
            </BFormGroup>
            <BRow class="mt-3" align-h="end">
                <BCol sm="auto">
                <BButton variant="outline-secondary" @click="emit('close')">Cancelar</BButton>
                </BCol>
                <BCol sm="auto">
                <BButton type="submit" variant="danger">Remover Produto</BButton>
                </BCol>
            </BRow>
        </BForm>
    </BRow>
</template>

<style scoped>

</style>