<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/http';
import { useMainStore } from '@/stores/session';
import ModalSignup from './ModalSignup.vue';
import { validateEmail, validatePassword } from '@/utils/validateFields';
import { userChecker } from '@/utils/userChecker';
import logo from '@/assets/logo.svg'; // Importando a imagem do logo

const emit = defineEmits(['success', 'error', 'successSignup', 'errorSignup']);
const router = useRouter();
const auth = useMainStore();

const email = ref('');
const password = ref('');
const modal = ref(null);

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
    if (!validateEmail(email.value) || !validatePassword(password.value)) {
        return;
    }
        const success = await obterToken();
        if (success) {
            emit('success'); 
            userChecker();
            setTimeout(() => {
                auth.toggleValue(true);
                router.push({ name: 'dashboard.resumo' }); 
            }, 2000);
        }
    }

    const closeModal = () => {
        modal.value = false; // Fecha o modal
    }

    //Toast de feedback para o usuário após o cadastro
    const signupFeedback = (feedback) => {
        if (feedback === 'success') {
            emit('successSignup');
        } else {
            emit('errorSignup'); 
        }
    };

    // Auto-preenchimento dos campos de e-mail e senha após o cadastro ser realizado
    const handleFormData = (formData) => {
        email.value = formData.email; 
        password.value = formData.password;
    };
</script>

<template>
    <BForm id="login" @submit.prevent="acceptLogin" novalidate>
        <BRow class="mb-3" align-h="center" align-v="center">
            <BCol sm="auto" class="p-0 text-center" md="2">
                <BImg
                    :src="logo"
                    width="50"
                    height="50"
                    lazy
                    class="logo"
                    fluid                    
                />
            </BCol>
            <BCol sm="auto" md="auto" class="text-center">
                <h1 class="mb-0">H2OControl</h1>
            </BCol>
        </BRow>

        <BRow class="mb-2">
            <BFormGroup
                label="Email"
                label-for="email"
                content-cols-md="12"
                label-cols-md="3"
            >
                <BFormInput 
                    id="email"
                    class="login-form-input"
                    v-model="email"
                    type="email"
                    placeholder="seu@email.com"
                    :state="validateEmail(email) ? null : false"
                    required
                />
                <BFormInvalidFeedback 
                    :state="validateEmail(email) ? null : false"
                    text="Email inválido"                       
                />
            </BFormGroup>
        </BRow>
        
        <BRow class="mb-5">
            <BFormGroup
                label="Senha"
                label-for="password"
                content-cols-md="12"
                label-cols-md="3"
            >
                <BFormInput 
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="*********"
                    :state="validatePassword(password) ? null : false"
                    required
                />
            </BFormGroup>
        </BRow>
        <BRow class="justify-content-between" align-h="center">
            <BCol sm="auto" class="mb-2 mb-sm-0 text-center align-self-center">
                <BLink href="#" id="forgot-password">Esqueci minha senha</BLink>
            </BCol>
            <BCol sm="auto" class="text-center align-self-center">
                <BButton type="submit" variant="primary" block>Entrar</BButton>
            </BCol>
        </BRow>
        <BRow>
            <BCol class="divider d-flex">
                <span>OU</span>
            </BCol>
        </BRow>
        <BRow class="mb-3">
            <BCol md="12" class="text-center align-self-center">
                <BButton variant="outline-primary" @click="modal = !modal" block>Criar conta</BButton>
                <BModal 
                    v-model="modal"
                    title="Criar conta" 
                    size="md" 
                    hide-footer 
                    centered 
                    scrollable 
                    no-header-close 
                    no-footer

                >
                    <ModalSignup 
                        @success="signupFeedback('success')" 
                        @error="signupFeedback('error')" 
                        @close="closeModal" 
                        @form-data="handleFormData"
                    />
                </BModal>
            </BCol>
        </BRow>
    </BForm>
</template>

<style scoped>
    #login {
        background-color: var(--background-color);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1{
        font-family: "Bellota Text", sans-serif;
    }
    #forgot-password {
        color: var(--link-color);
        text-decoration: none;
    }
    #forgot-password:hover {
        text-decoration: underline;
    }
    .divider {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .divider span {
        background-color: var(--background-color);
        padding: 0 10px;
        color: var(--text-color);
    }
    .divider::before,
    .divider::after {
        content: "";
        flex: 1;
        border-bottom: 1px solid var(--border-color);
        margin: auto;
    }
</style>