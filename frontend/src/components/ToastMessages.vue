<script setup>
const props = defineProps({
  showError: Boolean,
  showSuccess: Boolean,
  showSignupSuccess: Boolean,
  showSignupError: Boolean,
  showNewOrder: Boolean,
  showNewProduct: Boolean,
})

const emit = defineEmits(['update:showError', 'update:showSuccess', 'update:showSignupError', 'update:showSignupSuccess', 'update:showNewOrder', 'update:showNewProduct'])
</script>

<template>
  

<!-- ======================================TOASTS DE SUCESSO====================================== -->

  <BToast 
  :model-value="props.showSuccess"
  @update:model-value="(value) => emit('update:showSuccess', value)"
  solid class="position-fixed top-0 start-50 translate-middle-x m-3 bg-success text-white text-center"
  no-close-button>
  <p class="m-1">Login realizado com sucesso!</p>
</BToast>

<BToast 
:model-value="props.showSignupSuccess"
@update:model-value="(value) => emit('update:showSignupSuccess', value)"
solid class="position-fixed top-0 start-50 translate-middle-x m-3 bg-success text-white text-center"
no-close-button>
<p class="m-1">Usuário criado com sucesso!</p>
</BToast>

<BToast 
:model-value="props.showNewOrder"
@update:model-value="(value) => emit('update:showNewOrder', value)"
solid class="position-fixed top-0 start-50 translate-middle-x m-3 bg-success text-white text-center"
no-close-button>
<p class="m-1">Pedido adicionado com sucesso!</p>
</BToast>

<BToast 
:model-value="props.showNewProduct"
@update:model-value="(value) => emit('update:showNewProduct', value)"
solid class="position-fixed top-0 start-50 translate-middle-x m-3 bg-success text-white text-center"
no-close-button>
<p class="m-1">Produto adicionado com sucesso!</p>
</BToast>


<!-- =====================================TOASTS DE ERRO======================================= -->

<BToast 
  :model-value="props.showError"
  @update:model-value="(value) => emit('update:showError', value)"
  solid class="position-fixed top-0 start-50 translate-middle-x m-3 bg-danger text-white text-center"
  no-close-button>
  <p class="m-1">Erro ao fazer login. Verifique suas credenciais.</p>
</BToast>

<BToast 
:model-value="props.showSignupError"
@update:model-value="(value) => emit('update:showSignupError', value)"
solid class="position-fixed top-0 start-50 translate-middle-x m-3 bg-danger text-white text-center"
no-close-button>
<p class="m-1">Erro ao criar usuário. Verifique os dados.</p>
</BToast>

</template>

<style scoped></style>