import api from '@/services/http';

export const fetchDatabase = async (dbname, limit, order, fields) => {
  try {
    const token = localStorage.getItem('token');

    const params = new URLSearchParams({
      limit,
      order,
      fields,
    });

    const response = await api.get(`api/${dbname}/custom/?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    return (data);
  } catch (error) {
    console.error(`Erro ao buscar ${dbname}:`, error);
    return [];
  }
};


export const updatePedidoStatus = async (id, status) => {
  const token = localStorage.getItem('token');

  const response = await api.post(`api/vendas/${id}/update_status/`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log('Status atualizado com sucesso:', response.data);
  return response.data;
};