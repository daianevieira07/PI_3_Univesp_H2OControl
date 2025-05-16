<script setup>
import SubNav from '@/components/SubNav.vue';
import { fetchDatabase } from '@/utils/databaseCheck';
import { onMounted, ref, computed, reactive } from 'vue';
import RemoveItem from '@/components/ModalRemoveItem.vue';
import { removeItemEstoque } from '@/utils/removeItem';

const modalRemove = ref(false); // Variável para controle do modal de remoção
const removeConfirm = ref(false); // Variável para controle do modal de confirmação de remoção
const tempFormData = reactive({quantidade:0});
// Armzena o item a ser removido
const itemToRemove = reactive({
  id_produto: null,
  nome: '',
  quantidade_atual: 0,
});

const items = ref([]); // Lista de itens do estoque

const vendasEmAndamento = ref([]);

const getVendasEmAndamento = async () => {
  try {
    const vendas = await fetchDatabase('vendas', 'all', 'id_venda', 'all');
    vendasEmAndamento.value = vendas.filter(v => v.status_pedido === 0);
  } catch (error) {
    console.error('Erro ao buscar vendas em andamento:', error);
    vendasEmAndamento.value = [];
  }
};


const getEstoque = async () => {
  try {
    await getVendasEmAndamento();

    const estoque = await fetchDatabase('estoque', 'all', 'id_produto', 'all');

    // Para cada item no estoque, calcula o total reservado em pedidos em andamento
    estoque.forEach(item => {
      const totalReservado = vendasEmAndamento.value
        .filter(v => v.id_produto === item.id_produto)
        .reduce((soma, v) => soma + v.quantidade, 0);

      item.estoque_disponivel = item.quantidade - totalReservado;
    });

    items.value = estoque;
    console.log('get do estoque: ', items.value);
  } catch (error) {
    console.error('Erro ao obter estoque:', error);
    items.value = [];
  }
};


const handleConfirmRemoveItem = async (formData) => {

    if(formData.quantidade >= itemToRemove.quantidade_atual){
        removeConfirm.value = true; // Abre o modal de confirmação
        return tempFormData.quantidade = itemToRemove.quantidade_atual; 
    } else {
        handleRemoveItem(formData); // Chama a função para remover o item
    }
}

const handleRemoveItem = async (formData) => {
    try {
            // console.log('antes de excluir '+formData.quantidade);
        const data = {
                        "id_produto": itemToRemove.id_produto,
                        "id_usuario": localStorage.getItem('idUser'),
                        "nome_produto": itemToRemove.nome,
                        "tipo_movimentacao": false,
                        "quantidade": formData.quantidade,
                        "valor": 0.00,
                        "observacoes": "",
                        "fornecedor": ""
                    }

        // Chama a função para remover o item do estoque
        await removeItemEstoque(data);
        closeModal(); // Fecha o modal de remoção
        removeConfirm.value = false; // Fecha o modal de confirmação
        getEstoque(); // Atualiza a lista de itens após a remoção
    } catch (error) {
        console.error('Erro ao remover item:', error);
    }
};

const tabela = computed(() => {
    return items.value.map(p => {
        console.log(p);
        return {
            id_produto: p.id_produto,
            produto: p.produto ? p.produto : 'Produto não encontrado',
            quantidade_total: p.quantidade,
            quantidade_disponivel: p.estoque_disponivel,
            "Valor da unidade": "R$"+p.preco_unitario,
            remover: '',
        };
    });
});


const modalRemoveItem = (item) => {
    itemToRemove.id_produto = item.id_produto;
    itemToRemove.nome = item.produto;
    itemToRemove.quantidade_atual = item.quantidade;
    // console.log(itemToRemove);
    modalRemove.value = true; // Abre o modal de remoção
};

const modalTitle = computed(() => `Remover ${itemToRemove.nome}?`);

// Chamando a função getEstoque ao montar o componente
onMounted(() => {
    getEstoque();
});

const closeModal = () => {
    modalRemove.value = false; // Fecha o modal de remoção
};

</script>

<template>
    <UpperNav/>
        <SubNav @success="getEstoque"/>
        <BRow class="mt-4">
        <BCol>
            <h3>Estoque</h3>
            <BTable striped hover :items="tabela" :fields="['produto', 'quantidade_total','quantidade_disponivel', 'Valor da unidade', 'remover']">
                <template #cell(remover)="data">
                    <template v-if="data.item.quantidade_disponivel < data.item.quantidade_total">
                        <BTooltip>
                            <template #target>
                            <span>
                                <BButton
                                class="disabled ms-2"
                                @click="() => {}"
                                variant="danger"
                                size="sm"
                                >
                                <IMdiClose />
                                </BButton>
                            </span>
                            </template>
                            Existe um pedido em andamento com esse produto
                        </BTooltip>
                        </template>

                        <template v-else>
                        <BButton
                            class="ms-2"
                            @click="modalRemoveItem(data.item)"
                            variant="danger"
                            size="sm"
                        >
                            <IMdiClose />
                        </BButton>
                        </template>
                </template>
            </BTable>
        </BCol>
        <BModal
            v-model="modalRemove"
            :title="modalTitle"
            size="md"
            hide-footer
            centered
            scrollable
            no-header-close
            no-footer>
            <RemoveItem @close="closeModal" @removeItem="handleConfirmRemoveItem"/>
        </BModal>
        <BModal
            v-model="removeConfirm"
            title="Excluir Produto"
            size="md"
            hide-footer
            centered
            scrollable
            no-header-close
            no-footer>
            <BRow>
                <BRow>
                    <h4>Você tem certeza que deseja remover o produto {{ itemToRemove.nome }}?</h4>
                </BRow>
                <BRow class="mt-3" align-h="end">
                    <BCol sm="auto">
                        <BButton @click="removeConfirm = !removeConfirm" variant="secondary">Cancelar</BButton>
                    </BCol>
                    <BCol sm="auto">
                        <BButton @click="handleRemoveItem(tempFormData)" variant="danger">Remover</BButton>
                    </BCol>
                </BRow>
            </BRow>
        </BModal>
    </BRow>
</template>

<style scoped>

</style>