import api from '@/services/http';

const token = localStorage.getItem('token'); // Ou como você armazena

export const createCliente = async (clienteData) => {
  try {
    const response = await api.post('api/clientes/', clienteData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cliente:', error.response?.data || error.message);
    throw error;
  }
};
