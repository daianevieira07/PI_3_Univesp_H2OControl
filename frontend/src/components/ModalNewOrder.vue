<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { fetchDatabase } from '@/utils/databaseCheck';
import { createOrder } from '@/utils/newOrder';

// Emissão de eventos
const emit = defineEmits(['success', 'error', 'form-data', 'close']);

// Dados dos produtos
const produtos = ref([]);
const produtoSelecionado = ref(null);
const quantidadeForm = ref();
const fieldsProdutos = ref('id_produto,produto,preco_unitario,quantidade,estoque_disponivel');
const pagamento = ref(null);

// Função para buscar produtos
const getProduto = async () => {
  try {
    produtos.value = await fetchDatabase('estoque', 'all', 'id_produto', fieldsProdutos.value);
  } catch {
    produtos.value = [];
  }
};

// Dados dos clientes
const clientes = ref([]);
const clienteSelecionado = ref(null);
const clienteAtual = computed(() => 
  clientes.value.find(c => c.id_cliente === clienteSelecionado.value) || null
);

// Função para buscar clientes
const getCliente = async () => {
  try {
    clientes.value = await fetchDatabase('clientes', 'all', 'id_cliente', 'all');
  } catch {
    clientes.value = [];
  }
};

// Preparação dos dados ao montar o componente
onMounted(async () => {
  await getProduto();
  await getCliente();
});

// Opções de produtos para o select
const produtosOptions = computed(() =>
  produtos.value.map(p => ({ value: p.id_produto, text: p.produto }))
);

// Opções de clientes para o select
const clientesOptions = computed(() => [
  ...clientes.value.map(c => ({ value: c.id_cliente, text: c.nome })),
  { value: 'novo', text: 'Adicionar novo cliente' },
]);

// Produto selecionado para cálculo do valor total
const produtoAtual = computed(() =>
  produtos.value.find(p => p.id_produto === produtoSelecionado.value) || null
);

// Cálculo do valor total
const valorTotal = computed(() => {
  const produto = produtoAtual.value;
  return produto && quantidadeForm.value
    ? (produto.preco_unitario * quantidadeForm.value).toFixed(2)
    : '';
});

// Dados do novo cliente (para adicionar)
const nomeCliente = ref('');
const cpfCliente = ref('');
const telefoneCliente = ref('');
const emailCliente = ref('');
const observacoesCliente = ref('');
const logradouro = ref('');
const numero = ref('');
const bairro = ref('');
const complemento = ref('');
const cep = ref('');
const observacoes = ref('');

// Watch para atualizar dados do cliente selecionado
watch(clienteAtual, cliente => {
  if (cliente) {
    nomeCliente.value = cliente.nome || '';
    cpfCliente.value = cliente.cpf || '';
    telefoneCliente.value = cliente.telefone || '';
    observacoesCliente.value = cliente.observacoes || '';
    logradouro.value = cliente.endereco?.logradouro || '';
    numero.value = cliente.endereco?.numero || '';
    bairro.value = cliente.endereco?.bairro || '';
    complemento.value = cliente.endereco?.complemento || '';
    cep.value = cliente.endereco?.cep || '';
  } else {
    // Resetando os campos do cliente quando nenhum é selecionado
    nomeCliente.value = cpfCliente.value = telefoneCliente.value = observacoesCliente.value = '';
    logradouro.value = numero.value = bairro.value = complemento.value = cep.value = '';
  }
});

// Função para adicionar pedido
const adicionarPedido = () => {
  if (!produtoSelecionado.value || !quantidadeForm.value || !clienteSelecionado.value || !pagamento.value || quantidadeForm.value <= 0 || quantidadeForm.value > (produtoAtual?.estoque_disponivel) || 0) {
    emit('error');
    return;
  }

  const pedido = {
    id_produto: produtoSelecionado.value,
    id_cliente: clienteSelecionado.value,
    id_usuario: localStorage.getItem('idUser'),
    quantidade: quantidadeForm.value,
    valor_venda: valorTotal.value,
    tipo_pagamento: pagamento.value,
  };

  createOrder(pedido);
  emit('success');
  emit('close');
};
</script>

<template>
  <BForm @submit.prevent="adicionarPedido" id="new-order" novalidate>
    <BRow>
      <!-- Seção de Seleção de Produto -->
      <BFormGroup content-cols-sm="12" label-cols-sm="auto">
        <BInputGroup>
          <template #prepend>
            <BInputGroupText>Produto</BInputGroupText>
          </template>
          <BFormSelect
            v-model="produtoSelecionado"
            :options="produtosOptions"
            placeholder="Selecione um produto"
            required
          />
        </BInputGroup>
      </BFormGroup>

      <!-- Seção de Quantidade -->
      <BFormGroup content-cols-sm="12" label-cols-sm="auto">
        <BInputGroup>
          <template #prepend>
            <BInputGroupText>Quantidade</BInputGroupText>
          </template>
          <BFormInput
            type="number"
            v-model="quantidadeForm"
            :disabled="!produtoSelecionado"
            :state="!quantidadeForm || quantidadeForm <= (produtoAtual?.estoque_disponivel || 0) ? null : false"
            required
          />
          <BFormInvalidFeedback> Estoque insuficiente </BFormInvalidFeedback>
        </BInputGroup>
      </BFormGroup>

      <!-- Seção de Seleção de Cliente -->
      <BFormGroup content-cols-sm="12" label-cols-sm="auto">
        <BInputGroup>
          <template #prepend>
            <BInputGroupText>Cliente:</BInputGroupText>
          </template>
          <BFormSelect
            v-model="clienteSelecionado"
            :options="clientesOptions"
            placeholder="Selecione um cliente"
            required
          />
        </BInputGroup>

        <!-- Formulário de novo cliente -->
        <div v-if="clienteSelecionado === 'novo'" class="p-3 mt-2 border rounded bg-light">
          <h5>Adicionar Novo Cliente</h5>
          <BFormGroup label="Nome">
            <BFormInput v-model="nomeCliente" required />
          </BFormGroup>
          <BFormGroup label="Email (opcional)">
            <BFormInput v-model="emailCliente" type="email" />
          </BFormGroup>
          <BFormGroup label="Telefone">
            <BFormInput v-model="telefoneCliente" />
          </BFormGroup>
          <BFormGroup label="Endereço">
            <BInputGroup>
              <template #prepend>
                <BInputGroupText>Logradouro</BInputGroupText>
              </template>
              <BFormInput v-model="logradouro" required />
            </BInputGroup>
            <BInputGroup class="mt-2">
              <template #prepend>
                <BInputGroupText>Nº</BInputGroupText>
                <BFormInput v-model="numero" required />
              </template>
              <template #append>
                <BInputGroupText>Bairro</BInputGroupText>
                <BFormInput v-model="bairro" required />
              </template>
            </BInputGroup>
            <BFormInput class="mt-2" v-model="complemento" placeholder="Sem complemento" />
            <BInputGroup class="mt-2">
              <template #prepend>
                <BInputGroupText>CEP</BInputGroupText>
              </template>
              <BFormInput v-model="cep" required />
            </BInputGroup>
          </BFormGroup>
        </div>

        <!-- Dados de cliente existente -->
        <div v-else-if="clienteAtual" class="p-3 mt-2 border rounded bg-light">
          <BFormGroup label="Endereço:" class="mt-2">
            <BFormInput v-model="logradouro" disabled />
            <BInputGroup class="mt-2">
              <template #prepend>
                <BInputGroupText>Nº</BInputGroupText>
              </template>
              <BFormInput v-model="numero" disabled />
              <template #append>
                <BInputGroupText>Bairro</BInputGroupText>
                <BFormInput v-model="bairro" disabled />
              </template>
            </BInputGroup>
            <BFormInput class="mt-2" v-model="complemento" placeholder="Sem complemento" disabled />
            <BInputGroup class="mt-2">
              <template #prepend>
                <BInputGroupText>CEP</BInputGroupText>
              </template>
              <BFormInput v-model="cep" disabled />
            </BInputGroup>
          </BFormGroup>
          <BFormGroup label="Observações" class="mt-2">
            <BFormInput v-model="observacoes" disabled />
          </BFormGroup>
        </div>
      </BFormGroup>

      <!-- Seção de Forma de Pagamento -->
      <BFormGroup content-cols-sm="12" label-cols-sm="auto">
        <BInputGroup>
          <template #prepend>
            <BInputGroupText>Forma de pagamento:</BInputGroupText>
          </template>
          <BFormSelect
            v-model="pagamento"
            :options="[{ value: 'dinheiro', text: 'Dinheiro' }, { value: 'cartao', text: 'Cartão' }, { value: 'pix', text: 'Pix' }]"
            placeholder="Selecione uma forma de pagamento"
            required
          />
        </BInputGroup>
      </BFormGroup>

      <!-- Seção do Valor Total -->
      <BFormGroup content-cols-sm="12" label-cols-sm="auto">
        <BInputGroup>
          <template #prepend>
            <BInputGroupText>Valor total da compra:</BInputGroupText>
            <BInputGroupText><b>R$</b></BInputGroupText>
          </template>
          <BFormInput
            type="text"
            :value="valorTotal"
            :disabled="true"
          />
        </BInputGroup>
      </BFormGroup>

      <!-- Botões de Ação -->
      <BRow class="mt-3" align-h="end">
        <BCol sm="auto">
          <BButton variant="outline-secondary" @click="emit('close')">Cancelar</BButton>
        </BCol>
        <BCol sm="auto">
          <BButton type="submit" variant="primary">Adicionar Pedido</BButton>
        </BCol>
      </BRow>
    </BRow>
  </BForm>
</template>

<style scoped>
.logo {
  margin: 0 auto;
}
</style>
