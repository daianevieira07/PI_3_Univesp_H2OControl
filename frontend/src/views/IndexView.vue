<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { validarToken } from '@/utils/authChecker'

const router = useRouter()

onMounted(async () => {
  const isAuthenticated = await validarToken()
  // Redireciona imediatamente com base no estado de autenticação
  isAuthenticated 
    ? router.push({ name: 'dashboard' }) 
    : router.push({ name: 'login' })
})
</script>

<template>
  <div class="home-redirect">
    <h1>H2OControl</h1>
    <p>Carregando...</p>
  </div>
</template>

<style scoped>
.home-redirect {
  display: grid;
  place-items: center;
  height: 100vh;
}
</style>