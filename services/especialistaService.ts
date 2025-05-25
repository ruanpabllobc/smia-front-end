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