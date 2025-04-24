<script setup>
const props = defineProps({
  showError: Boolean,
  showSuccess: Boolean
})

const emit = defineEmits(['update:showError', 'update:showSuccess'])
</script>

<template>
  <BToast 
    :model-value="props.showError"
    @update:model-value="(value) => emit('update:showError', value)"
    solid class="position-fixed top-0 start-50 translate-middle-x m-3 bg-danger text-white text-center"
    no-close-button>
    <p class="m-1">Erro ao fazer login. Verifique suas credenciais.</p>
  </BToast>
  
  <BToast 
    :model-value="props.showSuccess"
    @update:model-value="(value) => emit('update:showSuccess', value)"
    solid class="position-fixed top-0 start-50 translate-middle-x m-3 bg-success text-white text-center"
    no-close-button>
    <p class="m-1">Login realizado com sucesso!</p>
  </BToast>
</template>

<style scoped></style>