<script setup>
import { onMounted, ref, computed } from 'vue';
import SubNav from '@/components/SubNav.vue';
import UpperNav from '@/components/UpperNav.vue';
import { fetchDatabase } from '@/utils/databaseCheck';

const items = ref([]); // Lista de itens do estoque
const Compras = ref([]); // Lista de compras

onMounted(() => {
    getCompras(); // Chama a função para obter os itens do estoque ao montar o componente
});


const getCompras = async () => {
    try{
        // Chama a função para obter os itens do estoque
        items.value = await fetchDatabase('movimentacoes', 'all', '-data_movimentacao', 'all');
        Compras.value = items.value.filter(compra => {return compra.tipo_movimentacao == 1});
        console.log('dentro do try '+Compras.value);
    } catch (error) {
        console.error('Erro ao obter movimentações:', error);
        items.value = []; // Limpa a lista de itens caso haja erro
    }
        
};




const tabela = computed(() => {
    return Compras.value.map(p => {
        const data = new Date(p.data_movimentacao);
        const dataFormatada = data.toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        });

        return {
            produto: p.nome_produto ? p.nome_produto : 'Produto não encontrado',
            quantidade: p.quantidade,
            "Valor da compra": "R$"+p.valor,
            fornecedor: p.fornecedor ? p.fornecedor : 'Fornecedor não encontrado',
            usuario: p.usuario.nome ? p.usuario.nome : 'Usuário não encontrado',
            "descrição": p.observacoes ? p.observacoes : 'Sem descrição',
            "data de entrada": p.data_movimentacao ? dataFormatada : 'Data não encontrada',
        };
    });
});

const currentPage = ref(1);
const perPage = ref(10); // itens por página

const totalPages = computed(() => Math.ceil(Compras.value.length / perPage.value));

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return tabela.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

</script>

<template>
    <UpperNav/>
    <SubNav/>
    <BRow class="mt-4 me-2 ms-2">
        <BCol>
            <h3>Compras</h3>
        </BCol>
        <BTable
            striped
            hover
            :items="pagedItems"
            :fields="['produto', 'quantidade', 'Valor da compra', 'fornecedor', 'descrição','usuario', 'data de entrada']"
        />

        <div class="mt-2 d-flex justify-content-between align-items-center">
            <b-button @click="prevPage" :disabled="currentPage === 1">Anterior</b-button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <b-button @click="nextPage" :disabled="currentPage === totalPages">Próxima</b-button>
        </div>
    </BRow>
</template>

<style scoped>

</style>