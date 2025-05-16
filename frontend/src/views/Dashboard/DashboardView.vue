<script setup>
import Sidebar from '@/components/Sidebar.vue';
import UpperNav from '@/components/UpperNav.vue';
import { getRouteComponent } from '@/utils/getRouteComponent';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { ref } from 'vue';

const route = useRoute();

// Atualiza automaticamente com a mudança da URL
const AtualPage = computed(() => {
  route.params.page || route.path.split('/')[2];
  return getRouteComponent();
});

</script>

<template>
    <BRow class="d-flex" no-gutters>
        <BCol sm="auto">
            <Sidebar/>                
        </BCol>
        <BCol class="content">
            <component :is="AtualPage"/>
        </BCol>
    </BRow>
</template>

<style scoped>
    h1 {
        color: #000;
        text-align: center;
        font-size: 2em;
    }
</style>