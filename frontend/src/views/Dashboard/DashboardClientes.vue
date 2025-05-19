<script setup>
import { ref, onMounted, computed } from 'vue';
import UpperNav from '@/components/UpperNav.vue';
import { fetchDatabase } from '@/utils/databaseCheck';
import { createCliente } from '@/utils/newClient';

const newclient = ref(false); // Controle do modal de novo cliente
const nomeCliente = ref('');
const telefoneCliente = ref('');
const logradouro = ref('');
const numero = ref('');
const observacoes = ref('');
const bairro = ref('');
const complemento = ref('');
const cpfCliente = ref('');
const cep = ref('');

const clientes = ref([]); // Lista de clientes

const getClientes = async () => {
  try {
    clientes.value = await fetchDatabase('clientes', 'all', 'id_cliente', 'all');
  } catch {
    clientes.value = [];
  }
};

const handleClienteSelecionado = (cliente) => {
  // Preenche o formulário com os dados do cliente selecionado
  nomeCliente.value = cliente.nome;
  cpfCliente.value = cliente.cpf;
  telefoneCliente.value = cliente.telefone;
  observacoes.value = cliente.observacoes || '';
  
  if (cliente.endereco) {
    logradouro.value = cliente.endereco.logradouro;
    numero.value = cliente.endereco.numero;
    bairro.value = cliente.endereco.bairro;
    complemento.value = cliente.endereco.complemento || '';
    cep.value = cliente.endereco.cep;
  }

  // Abre o formulário
  newclient.value = true;
};

const newClient = async () => {
  try {
    // Validação inicial dos campos obrigatórios
    if (!nomeCliente.value || !cpfCliente.value || !telefoneCliente.value || 
        !logradouro.value || !numero.value || !bairro.value || !cep.value) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos');
    }

    // Formata o CPF removendo caracteres não numéricos
    const cpfFormatado = cpfCliente.value.replace(/\D/g, '');
    // Formata o telefone removendo caracteres não numéricos
    const telefoneFormatado = telefoneCliente.value.replace(/\D/g, '');
    // Formata o CEP removendo caracteres não numéricos
    const cepFormatado = cep.value.replace(/\D/g, '');

    // Validação do CPF (11 dígitos)
    if (cpfFormatado.length !== 11) {
      throw new Error('CPF deve conter 11 dígitos');
    }

    // Validação do CEP (8 dígitos)
    if (cepFormatado.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }

    // Validação do número do endereço
    const numeroEndereco = parseInt(numero.value, 10);
    if (isNaN(numeroEndereco) || numeroEndereco <= 0) {
      throw new Error('Número do endereço deve ser um valor positivo');
    }

    const data = {
      nome: nomeCliente.value,
      cpf: cpfFormatado,
      telefone: telefoneFormatado,
      observacoes: observacoes.value || '',
      endereco: {
        logradouro: logradouro.value,
        numero: numeroEndereco,
        bairro: bairro.value,
        complemento: complemento.value || '',
        cep: cepFormatado
      }
    };

    await createCliente(data);

    // Limpar o formulário após o sucesso
    nomeCliente.value = '';
    cpfCliente.value = '';
    telefoneCliente.value = '';
    observacoes.value = '';
    logradouro.value = '';
    numero.value = '';
    bairro.value = '';
    complemento.value = '';
    cep.value = '';

    await getClientes(); // Atualiza a lista
    newclient.value = false; // Fecha o modal
  } catch (error) {
    console.error('Erro ao adicionar cliente:', error);
    alert(error.message || 'Erro ao adicionar cliente');
  }
};

onMounted(() => {
  getClientes();
});

const enderecoFormatado = (endereco) => {
  if (!endereco) return '';
  return `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro} -  CEP ${endereco.cep}`;
};

const items = computed(() => {
  return clientes.value.map(cliente => ({
    nome: cliente.nome,
    telefone: cliente.telefone,
    cpf: cliente.cpf,
    'endereço': enderecoFormatado(cliente.endereco),
    observacoes: cliente.observacoes
  }));
});
</script>


<template>
    <UpperNav @cliente-selecionado="handleClienteSelecionado"/>
    <BRow>
        <BNav class="ms-2 mb-2 mt-2" v-b-toggle.collapseNewClient>
            <BNavItem variant="dark" @click="newclient = !newclient"><IMdiPlus/>Adicionar novo cliente</BNavItem>
        </BNav>
        <BCollapse id="collapseNewClient">
        <BForm @submit.prevent="newClient" v-show="newclient" class="mb-2 mt-2">
            <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Nome *">
                <BFormInput v-model="nomeCliente" required maxlength="100" />
            </BFormGroup>
            <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="CPF *">
                <BFormInput v-model="cpfCliente" required maxlength="11" placeholder="Apenas números" />
            </BFormGroup>
            <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Telefone *">
                <BFormInput v-model="telefoneCliente" required maxlength="15" placeholder="Apenas números" />
            </BFormGroup>
            <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Endereço">
                <BInputGroup>
                    <template #prepend>
                        <BInputGroupText>Logradouro *</BInputGroupText>
                    </template>
                    <BFormInput v-model="logradouro" required maxlength="200" />
                </BInputGroup>
                <BInputGroup class="mt-2">
                    <template #prepend>
                        <BInputGroupText>Nº *</BInputGroupText>
                        <BFormInput v-model="numero" type="number" required min="1" />
                    </template>
                    <template #append>
                    <BInputGroupText>Bairro *</BInputGroupText>
                    <BFormInput v-model="bairro" required maxlength="100" />
                </template>
            </BInputGroup>
            <BFormInput class="mt-2" v-model="complemento" placeholder="Complemento (opcional)" maxlength="50" />
            <BInputGroup class="mt-2">
                <template #prepend>
                    <BInputGroupText>CEP *</BInputGroupText>
                </template>
                <BFormInput v-model="cep" required maxlength="8" placeholder="Apenas números" />
            </BInputGroup>
        </BFormGroup>
        <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Observações">
            <BFormTextarea v-model="observacoes" />
        </BFormGroup>
        <BRow class="mt-4">
            <BCol class="d-flex justify-content-end">
                <BButton type="reset" variant="danger" class="ms-2">Limpar</BButton>
                <BButton type="submit" variant="success" class="ms-2">Adicionar Cliente</BButton>
            </BCol>
            </BRow>
        </BForm>
        </BCollapse>
    </BRow>
    <BRow class="mt-4">
        <BCol>
            <h3>Clientes</h3>
            <BTable striped hover :items="items" :fields="['nome','endereço','telefone']"/>
        </BCol>
    </BRow>
</template>

<style scoped>

</style>