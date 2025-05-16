import api from '@/services/http';

export const createOrder = async (orderData) => {
    const token = localStorage.getItem('token');
  try {
    const response = await api.post('api/vendas/', orderData, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
}