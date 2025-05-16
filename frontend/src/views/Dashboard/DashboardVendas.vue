<script setup>
import { onMounted, ref } from 'vue';
import UpperNav from '@/components/UpperNav.vue';
import { fetchDatabase } from '@/utils/databaseCheck';
import Details from '@/components/ModalDetails.vue';

const items = ref([]); // Lista de itens do estoque
const pedidos = ref([]); // Lista de pedidos
const modalDetalhes = ref(false); // Variável para controle do modal de detalhes
const pedidoSelecionado = ref(null);


const getPedidos = async () => {
    try{
        // Chama a função para obter os itens do estoque
        items.value = await fetchDatabase('vendas', 'all', 'id_cliente', 'all');
        // console.log(items.value);
        
        pedidos.value = items.value
            .filter(pedido => pedido.status_pedido == 1)
            .map(p => {
                const data = new Date(p.data_venda);
                const dataFormatada = data.toLocaleString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                });

                return {
                ...p,
                cliente: p.cliente?.nome || 'Cliente não encontrado',
                produto: p.produto?.produto || 'Produto não encontrado',
                valor: `R$${p.valor_venda}`,
                data_da_venda: p.data_venda ? dataFormatada : 'Data não encontrada',
                };
            });

        // console.log(pedidos.value);
    } catch (error) {
        console.error('Erro ao obter pedidos:', error);
        items.value = []; // Limpa a lista de itens caso haja erro
    }
    
};

onMounted(() => {
    getPedidos(); // Chama a função para obter os itens do estoque ao montar o componente
});


const detalhes = (pedido) => {
  pedidoSelecionado.value = pedido;
  modalDetalhes.value = true;
};

</script>

<template>
    <UpperNav/>
    <BRow class="mt-4">
        <h3>Vendas concluídas</h3>
        <BCol>
            <BTable striped hover :items="pedidos" :fields="['cliente', 'produto', 'quantidade', 'valor', 'data_da_venda', 'detalhes']">
            <template #cell(detalhes)="data">
                <BButton @click="detalhes(data.item)" variant="primary" class="ms-2"><IMdiEye/></BButton>
            </template>
            </BTable>
        </BCol>
    </BRow>
    <BModal
        id="modalDetalhes"
        title="Detalhes do Pedido"
        v-model="modalDetalhes"
        hide-footer
        centered
        no-footer
        >
        <Details :pedido="pedidoSelecionado"/>
        </BModal>
</template>

<style scoped>

</style>