import api from "@/services/http";


export const cadastrarProduto = async (formData) => {
  try {
    const token = localStorage.getItem('token');

    // 1. Verifica se já existe o produto
    let idProduto = null;
    try {
      const produtoExistente = await api.get(`api/estoque/buscar_produto/`, {
        params: { produto: formData.produto },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      idProduto = produtoExistente.data.id_produto;
    } catch (error) {
      // Se o produto não existe (404), então cria um novo
      if (error.response && error.response.status === 404) {
        const novoProduto = await api.post(
          `api/estoque/`,
          {
            produto: formData.produto,
            quantidade: formData.quantidade,
            preco_unitario: formData.preco_unitario ? formData.preco_unitario : 0,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        idProduto = novoProduto.data.id_produto;
      } else {
        throw error;
      }
    }

    // 2. Registra a movimentação
    await api.post(
      `api/movimentacoes/`,
      {
        id_produto: idProduto,
        id_usuario: formData.id_usuario,
        nome_produto: formData.produto,
        tipo_movimentacao: true,
        quantidade: formData.quantidade,
        valor: formData.valor,
        observacoes: formData.observacoes,
        fornecedor: formData.fornecedor,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
  }
};