<script setup>
import { reactive, watch, computed, ref } from 'vue';
import { fetchDatabase } from '@/utils/databaseCheck';

const props = defineProps({
  pedido: Object
});

const cliente = ref('');
const produto = ref('');
const quantidade = ref(0);
const valor = ref(0);
const endereco = ref({});
const pagamento = ref('');
const observacoes = ref('');
const venda = ref('');


const camposEndereco = ['Logradouro', 'Número', 'Bairro', 'Complemento', 'CEP'];
const isLoading = ref(false);

const getDetails = async (id_cliente, id_venda) => {
  try {
    isLoading.value = true;

    const data = await fetchDatabase('vendas', 'all', 'id_cliente', 'all');

    if (data && data.length > 0) {
      // Use find para retornar apenas um pedido
      const pedido = data.find(
        p => String(p.id_cliente) === String(id_cliente) && String(p.id_venda) === String(id_venda)
      );

      if (pedido) {
        cliente.value = pedido.cliente?.nome || '';
        produto.value = pedido.produto?.produto || '';
        quantidade.value = pedido.quantidade || 0;
        valor.value = pedido.valor_venda || 0;
        endereco.value = pedido.cliente?.endereco || {};
        pagamento.value = pedido.tipo_pagamento || '';
        observacoes.value = pedido.observacoes || '';
        venda.value = pedido.id_venda || '';
      } else {
        console.warn('Pedido não encontrado com os IDs fornecidos.');
      }
    }
  } catch (error) {
    console.error('Erro ao obter detalhes do cliente:', error);
  } finally {
    console.log('resultado do getDetails:', cliente.value, 'venda: ', venda.value);
    isLoading.value = false;
  }
};


// Atualiza os dados quando o pedido muda
watch( () => props.pedido, (novoPedido) => {
  if (novoPedido?.id_cliente) {
    console.log('cliente do Novo pedido:', novoPedido.cliente, 'Venda :', novoPedido.id_venda); //Console citado;
    getDetails(novoPedido.id_cliente, novoPedido.id_venda);
}});

const enderecoFormatado = computed(() => {
  if (!endereco.value || typeof endereco.value !== 'object') return [];
  
  return camposEndereco.map((label, index) => {
    const valor = Object.values(endereco.value)[index+1] || '';
    return {
      label,
      valor
    };
  });
});

const pagamentoFormatado = computed(() => {
  if (!pagamento) return '';
  return pagamento.value.charAt(0).toUpperCase() + pagamento.value.slice(1);
});
</script>

<template>
  <BRow sm="auto" class="mt-2">
    <BCol>
      <BForm v-if="!isLoading">
        <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Cliente:">
          <BFormInput v-model="cliente" disabled />
        </BFormGroup>

        <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Produto:">
          <BFormInput v-model="produto" disabled />
        </BFormGroup>

        <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Quantidade:">
          <BFormInput v-model="quantidade" disabled />
        </BFormGroup>

        <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Valor:">
          <BFormInput v-model="valor" disabled />
        </BFormGroup>

        <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Endereço:">
            <BCol>
                <div v-for="(campo, index) in enderecoFormatado" :key="index" class="mb-2">
                <BInputGroup>
                    <BInputGroupText>{{ campo.label }}</BInputGroupText>
                    <BFormInput v-model="campo.valor" disabled />
                </BInputGroup>
                </div>
            </BCol>
        </BFormGroup>


        <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Método de Pagamento:">
          <BFormInput v-model="pagamentoFormatado" disabled />
        </BFormGroup>

        <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Observações:">
          <BFormInput v-model="observacoes" disabled />
        </BFormGroup>
      </BForm>
      <div v-else class="d-flex justify-content-center">
        <BSpinner label="Carregando detalhes do pedido..." />
      </div>
    </BCol>
  </BRow>
</template>

<style scoped>
</style>