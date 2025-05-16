import api from '@/services/http';

export const userChecker = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token não encontrado');

    const response = await api.get('api/usuarios/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.setItem('user', response.data.nome);
    localStorage.setItem('idUser', response.data.id_usuario);
    return true;
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    localStorage.removeItem('user');
    return false;
  }
};
