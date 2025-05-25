import { api } from './api';
import { Paciente } from '@/types/Paciente';

export const getTodosPacientes = async (): Promise<Paciente[]> => {
  const response = await api.get<Paciente[]>('/pacientes');
  return response.data;
};

export const getPacientePorId = async (id: number): Promise<Paciente> => {
  const response = await api.get<Paciente>(`/pacientes/${id}`);
  return response.data;
};

export const criarPaciente = async (dados: Paciente) => {
  const response = await api.post('/pacientes', dados);
  return response.data;
};

export const atualizarPaciente = async (
  id: number,
  dados: Partial<Paciente>
): Promise<Paciente> => {
  const response = await api.put(`/pacientes/${id}`, dados);
  return response.data;
};

export const deletarPaciente = async (id: number): Promise<void> => {
  await api.delete(`/pacientes/${id}`);
};