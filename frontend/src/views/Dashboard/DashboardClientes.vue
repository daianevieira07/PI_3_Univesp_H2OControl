<script setup>
import { ref, onMounted, computed } from 'vue';
import UpperNav from '@/components/UpperNav.vue';
import { fetchDatabase } from '@/utils/databaseCheck';
import { createCliente } from '@/utils/newClient';

const newclient = ref(false); // Controle do modal de novo cliente
const nomeCliente = ref('');
const telefoneCliente = ref('');
const emailCliente = ref('');
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

const newClient = async () => {
  try {
    const data = {
      nome: nomeCliente.value,
      cpf: cpfCliente.value,
      telefone: telefoneCliente.value,
      observacoes: observacoes.value,
      email: emailCliente.value,
      endereco: {
        logradouro: logradouro.value,
        numero: parseInt(numero.value, 10),
        bairro: bairro.value,
        complemento: complemento.value,
        cep: cep.value
      }
    };

    await createCliente(data);
    console.log('Cliente adicionado com sucesso:', data);

    await getClientes(); // Atualiza a lista
    newclient.value = false; // Fecha o modal se estiver usando
  } catch (error) {
    console.error('Erro ao adicionar cliente:', error);
  }
};

onMounted(() => {
  getClientes();
  console.log('Componente DashboardClientes montado');
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
    <UpperNav/>
    <BRow>
        <BNav class="ms-2 mb-2 mt-2" v-b-toggle.collapseNewClient>
            <BNavItem variant="dark" @click="newclient = !newclient"><IMdiPlus/>Adicionar novo cliente</BNavItem>
        </BNav>
        <BCollapse id="collapseNewClient">
        <BForm @submit.prevent="newClient" v-show="newclient" class="mb-2 mt-2">
            <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Nome">
                <BFormInput v-model="nomeCliente" required />
            </BFormGroup>
            <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Telefone">
                <BFormInput v-model="telefoneCliente" />
            </BFormGroup>
            <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="CPF">
                <BFormInput v-model="cpfCliente" />
            </BFormGroup>
            <BFormGroup content-cols-sm="12" label-cols-sm="auto" label="Endereço">
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