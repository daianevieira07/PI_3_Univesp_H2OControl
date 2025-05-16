import api from '@/services/http';

export const removeItemEstoque = async (data) => {
    try {
        console.log(data);
        const token = localStorage.getItem('token');
        // 1. Remove o produto
        await api.post(`api/movimentacoes/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Produto removido com sucesso!');
    } catch (error) {
        console.error('Erro ao remover:', error);
    }
}