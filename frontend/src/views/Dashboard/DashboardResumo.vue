<script setup>
import { onUpdated, ref } from 'vue';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { fetchDatabase } from '@/utils/databaseCheck';
import UpperNav from '@/components/UpperNav.vue';

const pedidosAndamento = ref(0); // Total de pedidos em andamento
const vendasHoje = ref(0); // Total de vendas hoje

const limit = ref('all'); // Limite de registros
const order = ref('-data_venda'); // Ordem de exibição (decrescente por padrão)
const fields = ref('id_cliente,valor_venda,status_pedido,data_venda'); // Campos a serem retornados
const vendas = ref([]); // Vendas a serem exibidas
const vendasTabela = ref([]); // Vendas a serem exibidas na tabela
const dados = ref([]); // Dados dos clientes a serem exibidos

const getVendas = async () => {
    try {
        // Chama a função para obter vendas
        console.log('dentro do getVendas');
        vendas.value = await fetchDatabase('vendas', limit.value, order.value, fields.value);

        vendasTabela.value = vendas.value.slice(0, 5); // Limita a exibição a 5 vendas
        
        // Obtém dados dos clientes relacionados às vendas
        dados.value = await fetchDatabase('clientes', limit.value, 'id_cliente', 'all');
        
        // Data de hoje
        const hoje = new Date().toISOString().split('T')[0]; // Obtém a data de hoje no formato "YYYY-MM-DD"

        // Filtra vendas que ocorreram hoje
        const vendasDoDia = vendas.value.filter(venda => {
            const dataVenda = venda.data_venda.split('T')[0]; // Extrai a data da venda (ajuste conforme seu formato de data)
            return dataVenda === hoje; // Compara com a data de hoje
        });

        // Calcula o número de pedidos em andamento e vendas concluídas do dia
        pedidosAndamento.value = vendasDoDia.filter(venda => venda.status_pedido === 0).length;
        vendasHoje.value = vendasDoDia.filter(venda => venda.status_pedido === 1).length;
    } catch (error) {
        vendas.value = []; // Limpa a lista de vendas caso haja erro
        pedidosAndamento.value = 0;
        vendasHoje.value = 0;
    }
};


// Chamando a função getVendas ao montar o componente
onMounted(() => {
    getVendas();
});

const items = computed(() => {
    return vendasTabela.value.map(venda => {
        // Encontrando o cliente relacionado à venda
        const cliente = dados.value.find(cliente => cliente.id_cliente === venda.id_cliente);

        return {
            cliente: cliente ? cliente.nome : 'Cliente não encontrado',
            'valor': venda.valor_venda,
            'status do pedido': venda.status_pedido === 0 ? 'Em andamento' : venda.status_pedido === 1 ? 'Concluído' : 'Cancelado',
        };
    });
});
</script>

<template>
    <UpperNav @success="getVendas"/>
    <BRow no-gutters>
        <BCardGroup class="mb-4" deck>
            <BCard header-tag="header" footer-tag="footer" footer-class="text-end">
                <template #header>
                    <h4>Pedidos em andamento</h4>
                </template>
                <BCardText>
                    <IMdiClockOutline width="40" height="40" />
                    <h3>{{ pedidosAndamento }}</h3>
                    <p>Pedidos</p>
                </BCardText>
                <template #footer>
                    <RouterLink to="/dashboard/pedidos" class="nav-footer">Pedidos &raquo;</RouterLink>
                </template>
            </BCard>
            <BCard header-tag="header" footer-tag="footer" footer-class="text-end">
                <template #header>
                    <h4>Vendas Hoje</h4>
                </template>
                <BCardText>
                    <IMdiCheck width="40" height="40" />
                    <h3>{{ vendasHoje }}</h3>
                    <p>Concluídos</p>
                </BCardText>
                <template #footer>
                    <RouterLink to="/dashboard/vendas" class="nav-footer">Vendas &raquo;</RouterLink>
                </template>
            </BCard>
        </BCardGroup>
    </BRow>
    <BRow class="mt-4">
        <BCol>
            <h3>Últimos pedidos</h3>
            <BTable striped hover :items="items" :fields="['cliente', 'valor', 'status do pedido']"/>
        </BCol>
    </BRow>
</template>

<style scoped>
    .nav-footer {
        color: var(--link-color);
        font-size: 0.8em; 
        text-decoration: none;
    }
    h4, .card-text {
        text-align: center;
    }
</style>
