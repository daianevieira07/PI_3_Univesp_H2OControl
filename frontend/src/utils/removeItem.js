import api from '@/services/http';

export const removeItemEstoque = async (data) => {
    try {
        const token = localStorage.getItem('token');
        // 1. Remove o produto
        await api.post(`api/movimentacoes/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error) {
        console.error('Erro ao remover:', error);
    }
}