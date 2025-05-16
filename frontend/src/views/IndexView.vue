<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { validarToken } from '@/utils/authChecker'
import logo from '../assets/logo.svg'
const router = useRouter()

onMounted(async () => {
  const isAuthenticated = await validarToken()
  // Redireciona imediatamente com base no estado de autenticação
  isAuthenticated 
    ? router.push({ name: 'dashboard.resumo' }) 
    : router.push({ name: 'login' })
})
</script>

<template>
  <BRow class="justify-content-center align-items-center vh-100" no-gutters>
      <BCol class="d-flex flex-column justify-content-center align-items-center">
        <BImg
          :src="logo"
          width="200"
          height="200"
          lazy
          class="logo"
          fluid />
        <p>Carregando</p>
        <ISvgSpinners3DotsScale/>
    </BCol>
  </BRow>
</template>

<style scoped>
</style>