<script setup>
import { onMounted, ref } from 'vue';
import UpperNav from '@/components/UpperNav.vue';
import { fetchDatabase, updatePedidoStatus } from '@/utils/databaseCheck';
import { computed } from 'vue';
import Details from '@/components/ModalDetails.vue';

const items = ref([]); // Lista de itens do estoque
const pedidos = ref([]); // Lista de pedidos
const modalDetalhes = ref(false); // Variável para controle do modal de detalhes
const pedidoSelecionado = ref(null);


const getPedidos = async () => {
    try{
        // Chama a função para obter os itens do estoque
        items.value = await fetchDatabase('vendas', 'all', 'id_cliente', 'all');
        
        pedidos.value = items.value
            .filter(pedido => pedido.status_pedido == 0)
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
                selecionar: false,
                cliente: p.cliente?.nome || 'Cliente não encontrado',
                produto: p.produto?.produto || 'Produto não encontrado',
                valor: `R$${p.valor_venda}`,
                data_da_venda: p.data_venda ? dataFormatada : 'Data não encontrada',
                };
            });

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


const cancelarPedido = async () => {
  const selecionados = pedidos.value.filter(p => p.selecionar);

  const promises = selecionados.map(p =>
    updatePedidoStatus(p.id_venda, 2)
  );

  try {
    await Promise.all(promises);
    await getPedidos();
  } catch (err) {
    console.error('Erro ao cancelar pedidos:', err);
  }
};


const marcarConcluido = async () => {
  const selecionados = pedidos.value.filter(p => p.selecionar);

  const promises = selecionados.map(p =>
    updatePedidoStatus(p.id_venda, 1)
  );

  try {
    await Promise.all(promises);
    await getPedidos();
  } catch (err) {
    console.error('Erro ao concluir pedidos:', err);
  }
};
</script>

<template>
    <UpperNav/>
    <BRow class="mt-4">
        <h3>Pedidos Realizados</h3>
        <BCol>
            <BTable striped hover :items="pedidos" :fields="['selecionar', 'cliente', 'produto', 'quantidade', 'valor', 'data_da_venda', 'detalhes']">
            <template #cell(selecionar)="item">
                <BForm class="ms-4"><BFormCheckbox v-model="item.item.selecionar"/></BForm>
            </template>
            <template #cell(detalhes)="data">
                <BButton @click="detalhes(data.item)" variant="primary" class="ms-2"><IMdiEye/></BButton>
            </template>
            </BTable>
        </BCol>
    </BRow>
    <BRow class="mt-4">
        <BCol class="d-flex justify-content-end">
            <BButton @click="cancelarPedido" variant="danger" class="ms-2">Cancelar pedidos selecionados</BButton>
            <BButton @click="marcarConcluido" variant="success" class="ms-2">Marcar como concluído</BButton>
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