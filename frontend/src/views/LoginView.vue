<script setup>
import LoginForm from '@/components/LoginForm.vue';
import ToastMessages from '@/components/ToastMessages.vue'
import { ref } from 'vue'

const toastLoginSuccess = ref(false)
const toastLoginError = ref(false)

// Expõe funções para o componente filho
const handleLoginSuccess = () => {
  toastLoginSuccess.value = true
  setTimeout(() => toastLoginSuccess.value = false, 3000)
}

const handleLoginError = () => {
  toastLoginError.value = true
  setTimeout(() => toastLoginError.value = false, 5000)
}
</script>

<template>
    <BContainer fluid id="loginForm" class="d-flex flex-column justify-content-center align-items-center vh-100">
        <BOverlay
            id="overlay-background"
            :show = "toastLoginSuccess"
            :opacity="0.8"
            :blur="2"
            rounded="sm"
            z-index="10"
          >
    <LoginForm @success="handleLoginSuccess" @error="handleLoginError"/>
    <ToastMessages 
      :show-error="toastLoginError"
      :show-success="toastLoginSuccess"
      @update:show-error="(val) => toastLoginError = val"
      @update:show-success="(val) => toastLoginSuccess = val"
    />
</BOverlay>
    </BContainer>
</template>


<style scoped>
    #loginForm {
        background-color: #efefef;
    }
</style>