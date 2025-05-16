import * as jwt_decode from 'jwt-decode';
import api from '@/services/http';
import { useMainStore } from '@/stores/session';
import { useRouter } from 'vue-router';

export const validarToken = async () => {
  const token = localStorage.getItem('token');
  const auth = useMainStore();
  const router = useRouter();

  if (!token) {
    auth.toggleValue(false);
    return false;
  }

  try {
    // Validação local do token
    const decoded = jwt_decode.jwtDecode(token);
    const now = Date.now() / 1000;
    
    if (decoded.exp < now) {
      throw new Error("Token expirado");
    }

    // Validação com a API
    await api.post('api/token/verify/', { token });
    auth.toggleValue(true);
    return true;

  } catch (error) {
    console.error("Erro na validação do token:", error);

    // Se o erro for 401 (não autorizado), tenta renovar com o refresh token
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error("Refresh token não encontrado");
        }

        // Renova o token
        const response = await api.post('api/token/refresh/', { 
          refresh: refreshToken 
        });

        // Atualiza tokens no localStorage
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        auth.toggleValue(true); // Mantém o usuário logado
        return true;

      } catch (refreshError) {
        console.error("Erro ao renovar token:", refreshError);
        // Se falhar, faz logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        auth.toggleValue(false);
        alert('Sessão expirada. Faça login novamente.');
        router.push('/');
        return false;
      }
    }

    // Outros erros (ex.: rede, token inválido)
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    auth.toggleValue(false);
    router.push('/');
    return false;
  }
};