import { api } from './api';
import { Especialista } from '@/types/Especialista';

export const getTodosEspecialistas = async () => {
  const response = await api.get<Especialista[]>('/especialistas');
  return response.data;
};

export const getEspecialistaPorId = async (id: number) => {
  const response = await api.get<Especialista>(`/especialistas/${id}`);
  return response.data;
};

export const criarEspecialista = async (dados: Especialista) => {
  const response = await api.post('/especialistas', dados);
  return response.data;
};

export const atualizarEspecialista = async (id: number, dados: Partial<Especialista>) => {
  const response = await api.put(`/especialistas/${id}`, dados);
  return response.data;
};

export const deletarEspecialista = async (id: number) => {
  const response = await api.delete(`/especialistas/${id}`);
  return response.data;
};

export const verificarCredenciais = async (email: string, senha: string): Promise<Especialista | null> => {
  try {
    const lista = await api.get<Especialista[]>('/especialistas');
    const especialista = lista.data.find(esp => esp.email === email);
    
    if (!especialista) return null;

    const completo = await api.get<Especialista & { senha: string }>(`/especialistas/${especialista.id}`);
    
    if (completo.data.senha === senha) {
      const { senha: _, ...dadosSeguros } = completo.data;
      return dadosSeguros;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao verificar:', error);
    return null;
  }
};