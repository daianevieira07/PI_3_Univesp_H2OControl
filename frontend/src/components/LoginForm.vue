<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/http';
import { useMainStore } from '@/stores/session';

const emit = defineEmits(['success', 'error']);
const router = useRouter();
const auth = useMainStore();

const email = ref('');
const password = ref('');

// Função para obter o token de autenticação
// Faz uma requisição POST para a API com o e-mail e a senha do usuário
const obterToken = async () => {
    try {
        const response = await api.post('api/token/', {
            username: email.value,
            password: password.value
        });
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        return true;
    } catch (error) {
        console.error('Erro ao obter o token:', error);
        emit('error');
        return false;
    }
};


// Função para lidar com o envio do formulário de login
// Verifica se o e-mail e a senha estão preenchidos corretamente antes de fazer a requisição
const acceptLogin = async () => {
    if (!validateLogin(email.value, true) || !validateLogin(password.value)) {
        return;
    }
        const success = await obterToken();
        if (success) {
            emit('success'); 
            setTimeout(() => {
                auth.toggleValue(true); // Atualiza o estado de autenticação no store
                router.push({ name: 'dashboard' }); // Redireciona para a página inicial após o login
            }, 2000);
        }
    }

    
// Função de validação para verificar se os campos estão preenchidos corretamente
// e se o e-mail é válido

const validateLogin = (value, email=false) => {
    if (!value) {
        return false;
    }

    if (email && !/\S+@\S+\.\S+/.test(value)) {
        return false;
    }

    return true;
};

</script>

<template>
    <BForm @submit.prevent="acceptLogin" novalidate>
        <BRow class="mb-3">
            <BCol cols="2" align-self="center">
                <BImg
                    src="./src/assets/logo.svg"
                    width="50"
                    height="50"
                    lazy
                    class="logo"
                />
            </BCol>
            <BCol cols="10" class="text-center align-self-center">
                <h1 class="mb-0">H2OControl</h1>
            </BCol>
        </BRow>

        <BRow class="mb-2">
            <BFormGroup
                label="Email"
                label-for="email"
                content-cols="12"
                label-cols="3"
            >
                <BFormInput 
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="seu@email.com"
                    :state="validateLogin(email, true) ? null : false"
                    required
                />
                <BFormInvalidFeedback 
                    :state="validateLogin(email, true) ? null : false"
                    text="Email inválido"                       
                />
            </BFormGroup>
        </BRow>
        
        <BRow class="mb-5">
            <BFormGroup
                label="Senha"
                label-for="password"
                content-cols="12"
                label-cols="3"
            >
                <BFormInput 
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="*********"
                    :state="validateLogin(password) ? null : false"
                    required
                />
            </BFormGroup>
        </BRow>
        <BRow class="justify-content-between">
            <BCol cols="7" class="text-center align-self-center">
                <BLink href="/recuperar-senha" id="forgot-password">Esqueci minha senha</BLink>
            </BCol>
            <BCol cols="3 p-0">
                <BButton type="submit" variant="primary" block>Entrar</BButton>
            </BCol>
        </BRow>
    </BForm>
</template>

<style scoped>
    form{
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1{
        font-family: "Bellota Text", sans-serif;
    }
    #forgot-password {
        color: #007bff;
        text-decoration: none;
    }
    #forgot-password:hover {
        text-decoration: underline;
    }
</style>