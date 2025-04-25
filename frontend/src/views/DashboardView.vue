<script setup>
import router from '@/router';


const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push({ name: 'home' })
}
</script>

<template>
    <h1>H2OControl</h1>
    <p>Este é um texto de teste para o H2OControl.</p>
    <button @click.prevent="logout()">Logout</button>
</template>

<style scoped>
    h1 {
        color: #000;
        text-align: center;
        font-size: 2em;
        margin-top: 20px;
    }
</style>