<script setup>
import { ref } from 'vue';
import { validateEmail } from '@/utils/validateFields';
import { validatePassword, validateConfirmPassword } from '@/utils/validateFields';
import api from '@/services/http';



const emit = defineEmits(['success', 'error', 'form-data', 'close']);

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const newUser = async () => {
    try {
        const response = await api.post('api/usuarios/', {
            nome: name.value,
            login: email.value,
            password: password.value,
            password_confirm : passwordConfirm.value
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        emit('error');
    }
    return null;
};


const acceptSignup = async () => {
    if(!email.value || !password.value || !passwordConfirm.value || !name.value) {
        return;
    } else if (!validateEmail(email.value) || !validatePassword(password.value) || !validateConfirmPassword(password.value, passwordConfirm.value)) {
        return;
    }
    const success = await newUser();
    if (success) {
        emit('success');
        emit('form-data', {
            email: email.value,
            password: password.value,
        });
        emit('close'); // Fecha o modal
        // Limpa os campos do formulário após o envio
        name.value = '';
        email.value = '';
        password.value = '';
        passwordConfirm.value = '';
    } else {
        emit('error');
    }
};

</script>


<template>
        <BForm @submit.prevent="acceptSignup" novalidate>
            <BRow class="mb-2">
                <BFormGroup
                    label="Nome"
                    label-for="name"
                    content-cols-sm="12"
                    label-cols-sm="auto"
                >
                    <BFormInput 
                        id="name"
                        v-model="name"
                        type="text"
                        placeholder="Digite seu nome completo"
                        required
                    />
                </BFormGroup>
            </BRow>
            <BRow class="mb-2">
                <BFormGroup
                    label="Email"
                    label-for="email"
                    content-cols-sm="12"
                    label-cols-sm="auto"
                >
                    <BFormInput 
                        v-model="email"
                        type="email"
                        placeholder="Digite seu email"
                        :state="validateEmail(email, true) ? null : false"
                        required
                    />
                    <BFormInvalidFeedback 
                        :state="validateEmail(email, true) ? null : false"
                        text="Email inválido"
                    />
                </BFormGroup>
            </BRow>
            <BRow class="mb-2">
                <BFormGroup
                    label="Senha"
                    label-for="password"
                    content-cols-sm="12"
                    label-cols-sm="auto"
                >
                    <BFormInput 
                        v-model="password"
                        type="password"
                        placeholder="Digite sua senha"
                        :state="validatePassword(password, true) ? null : false"
                        required
                    />
                    <BFormInvalidFeedback 
                        :state="validatePassword(password, true) ? null : false"
                        text="A senha deve conter pelo menos 8 caracteres, incluindo letras, números e símbolos especiais."
                    />
                </BFormGroup>
            </BRow>
            <BRow class="mb-2">
                <BFormGroup
                    label="Confirmação de senha"
                    label-for="passwordConfirm"
                    content-cols-sm="12"
                    label-cols-sm="auto"
                >
                    <BFormInput 
                        id="passwordConfirm"
                        v-model="passwordConfirm"
                        type="password"
                        placeholder="Confirme sua senha"
                        :state="validateConfirmPassword(password, passwordConfirm) ? null : false"
                        required
                    />
                    <BFormInvalidFeedback 
                        :state="validateConfirmPassword(password, passwordConfirm) ? null : false"
                        text="As senhas não coincidem."
                    />
                </BFormGroup>
            </BRow>
            <BRow class="mt-5" align-h="end">
                <BCol sm="auto" class="text-center align-self-center">
                    <BButton variant="outline-secondary" @click="emit('close')">Cancelar</BButton>
                </BCol>
                <BCol sm="auto" class="text-center align-self-center">
                    <BButton type="submit" variant="primary">Criar conta</BButton>
                </BCol>
            </BRow>
        </BForm>
</template>

<style scoped>
    h3 {
        font-family: Arial, Helvetica, sans-serif;
    }
</style>