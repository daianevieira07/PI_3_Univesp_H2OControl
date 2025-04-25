<script setup>
import LoginForm from '@/components/LoginForm.vue';
import ToastMessages from '@/components/ToastMessages.vue'
import { ref } from 'vue'

const toastLoginSuccess = ref(false)
const toastLoginError = ref(false)
const toastSignupSuccess = ref(false)
const toastSignupError = ref(false)

// Expõe funções para o componente filho
const handleLoginSuccess = () => {
  toastLoginSuccess.value = true
  setTimeout(() => toastLoginSuccess.value = false, 3000)
}

const handleLoginError = () => {
  toastLoginError.value = true
  setTimeout(() => toastLoginError.value = false, 5000)
}

const handleSignupSuccess = () => {
  toastSignupSuccess.value = true
  setTimeout(() => toastSignupSuccess.value = false, 3000)
}

const handleSignupError = () => {
  toastSignupError.value = true
  setTimeout(() => toastSignupError.value = false, 5000)
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
    <LoginForm 
      @success="handleLoginSuccess" 
      @error="handleLoginError"
      @successSignup="handleSignupSuccess"
      @errorSignup="handleSignupError"
    />
    <ToastMessages 
      :show-error="toastLoginError"
      :show-success="toastLoginSuccess"
      :show-signup-error="toastSignupError"
      :show-signup-success="toastSignupSuccess"
      @update:show-error="(val) => toastLoginError = val"
      @update:show-success="(val) => toastLoginSuccess = val"
      @update:show-signup-error="(val) => toastSignupError = val"
      @update:show-signup-success="(val) => toastSignupSuccess = val"
    />
</BOverlay>
    </BContainer>
</template>


<style scoped>
    #loginForm {
        background-color: #efefef;
    }
</style>