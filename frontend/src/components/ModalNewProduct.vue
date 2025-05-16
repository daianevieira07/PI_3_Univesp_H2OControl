<script setup>
import { cadastrarProduto } from '@/utils/newProduct';
import { onMounted, ref } from 'vue';

const emit = defineEmits(['success', 'error', 'close']);

const productName = ref('');
const productPrice = ref(0.00);
const productSupplier = ref('');
const productQuantity = ref('');
const productDescription = ref('');
const productPriceUnitario = ref('');
const suppliers = ref([
    { value: 'Klarina', text: 'Klarina' },
]);

const corrigirSeparador = () => {
  productPrice.value = productPrice.value.replace(',', '.');
};
const corrigirSeparadorUnitario = () => {
  productPriceUnitario.value = productPriceUnitario.value.replace(',', '.');
};


const handleSubmit = async (e) => {
    e.preventDefault();
    if (productPrice.value <= 0.00 || productPriceUnitario.value === 0.00) {
        emit('error', 'O preço deve ser maior que 0');
        return;
    }
    const data = {
        produto: productName.value,
        quantidade: productQuantity.value,
        preco_unitario: parseFloat(productPriceUnitario.value.replace(',', '.')),
        id_usuario: localStorage.getItem('idUser'),
        valor: parseFloat(productPrice.value.replace(',', '.')),
        observacoes: productDescription.value,
        fornecedor: productSupplier.value,
    };
    try {
        const success = await cadastrarProduto(data);
        if(success) {
            emit('success');
            emit('close');
        };
    } catch (error) {
        emit('error', 'Erro ao criar produto');
        return;
    }
};

</script>

<template>
    <BForm @submit.prevent="handleSubmit">
        <BFormGroup label="Nome do Produto" label-for="product-name">
            <BFormInput id="product-name" v-model="productName" placeholder="Digite o nome do produto" required />  
        </BFormGroup>
        <BFormGroup label="Quantidade" label-for="product-quantity">
            <BFormInput
            type="number"
            v-model="productQuantity"
            required
          />
        </BFormGroup>
        <BFormGroup label="Preço total da compra" label-for="product-price">
            <BFormInput id="product-price" v-model="productPrice" @input="corrigirSeparador"
 placeholder="Digite o preço do produto" :state="productPrice > 0.00 ? null : false"/>
            <BFormInvalidFeedback> O preço deve ser maior que 0 </BFormInvalidFeedback>
        </BFormGroup>
        <BFormGroup label="Preço de venda (por unidade)" label-for="product-price-unitario">
            <BFormInput id="product-price-unitario" v-model="productPriceUnitario" @input="corrigirSeparadorUnitario"
 placeholder="Digite o preço do produto" :state="!productPriceUnitario || productPriceUnitario > 0.00 ? null : false"/>
            <BFormInvalidFeedback> O preço deve ser maior que 0 (Para manter o mesmo valor deixe em branco) </BFormInvalidFeedback>
        </BFormGroup>
        <BFormGroup label="Fornecedor" label-for="product-supplier">
            <BFormSelect id="product-supplier" v-model="productSupplier" :options="suppliers" placeholder="Selecione o fornecedor" />
        </BFormGroup>
        <BFormGroup label="Descrição" label-for="product-description">
            <BFormTextarea id="product-description" v-model="productDescription" placeholder="Digite a descrição do produto" />
        </BFormGroup>
        <BRow class="mt-3" align-h="end">
        <BCol sm="auto">
          <BButton variant="outline-secondary" @click="emit('close')">Cancelar</BButton>
        </BCol>
        <BCol sm="auto">
          <BButton type="submit" variant="primary">Adicionar Produto</BButton>
        </BCol>
      </BRow>
    </BForm>

</template>

<style scoped>

</style>