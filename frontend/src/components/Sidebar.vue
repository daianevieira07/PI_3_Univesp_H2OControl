<script setup>

import logo from '@/assets/logo.svg';

import router from '@/router';
import { ref } from 'vue';

const logoutButton = ref(true);
const user = ref(localStorage.getItem('user') || 'Usuário');

const logout = () => {
    localStorage.clear();
    router.push({ name: 'home' })
    .then(() => {
        window.location.reload();
    })
}
</script>

<template>
        <BCol class="sidebar vh-100">
        <div class="d-flex flex-column h-100">
            <div 
            class="ms-auto m-2 bg-light rounded-circle sidebar-icon" 
            v-b-toggle.collapse-1 
            role="button"
            @click="logoutButton = !logoutButton"
            >
                <IMynauiSidebar width="20" height="20" />
            </div>
            
                <BCollapse id="collapse-1" visible horizontal>
                    <BNavbarBrand class="d-flex mb-4 justify-content-center" href="#">
                    <BImg
                        :src="logo"
                        width="40"
                        height="40"
                        class="logo me-2"
                        alt="Logo H2OControl"   
                    />
                    <h3 class="align-self-center p-0 m-0">H2OControl</h3>
                    </BNavbarBrand>
                    <div class="align-items-center text-center mt-2 mb-4" id="user-info">
                        <span class="ms-2">Bem-vindo {{ user }}</span>
                    </div>
                    <BNav vertical class="flex-grow-1 text-center nav-guide">
                        <RouterLink to="/dashboard/resumo" class="nav-item" active-class="active-link">resumo</RouterLink>
                        <RouterLink to="/dashboard/estoque" class="nav-item" active-class="active-link">estoque</RouterLink>
                        <RouterLink to="/dashboard/compras" class="nav-item" active-class="active-link">compras</RouterLink>
                        <RouterLink to="/dashboard/pedidos" class="nav-item" active-class="active-link">pedidos</RouterLink>
                        <RouterLink to="/dashboard/vendas" class="nav-item" active-class="active-link">vendas</RouterLink>
                        <RouterLink to="/dashboard/clientes" class="nav-item" active-class="active-link">clientes</RouterLink>
                    </BNav>
                </BCollapse>
                <div class="d-flex align-items-center justify-content-end mt-auto m-2" role="button" @click="logout()">
                    <div class="ms-auto bg-light rounded-circle sidebar-icon">
                        <IMaterialSymbolsLogout width="20" height="20" />
                    </div>
                    <span v-show="logoutButton" id="logout-button" class="ms-2">Sair</span>
                </div>
        </div>
      </BCol>
</template>

<style>
.sidebar{
    background-color: #365d7e;
}
.sidebar .navbar-brand{
    color: #fff;
    height: 60px;
    padding: 10px 20px;
}
.sidebar .navbar-brand img{
    background-color: #EAECE2;
    border-radius: 32%;
    padding: 3px;
}
.sidebar-icon{
    justify-content: center;
    padding: 2.5px 0 0 6.5px;
    width: 33px;
    height: 33px;
}
.sidebar h3{
    font-family: var(--font-primary);
    font-size: 1.7rem;
}
.nav-guide a{
    text-decoration: none;
    color: #fff;
    text-transform: uppercase;
    padding: 0.5rem 4.375rem;
}
.active-link{
    background-color:#66A8E0;
    color: #fff;
}
#user-info{
    background-color: #203B51;
    padding: 0.5rem 1.5rem;
    color: #fff;
    font-size: 1.1rem;
}
#logout-button{
    color: #fff;
    font-size: 1.1rem;
}
#logout-button:hover{
    cursor: pointer;
    color: var(--hover-bg-color);
}

</style>
