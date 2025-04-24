<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { validarToken } from '@/utils/authChecker';

onMounted(() => {
  validarToken(); // revalida ao carregar o app
});
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
