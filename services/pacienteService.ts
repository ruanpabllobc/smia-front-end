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

export const criarPaciente = async (dados: Omit<Paciente, 'id'>): Promise<Paciente> => {
  const response = await api.post<Paciente>('/pacientes', dados);
  return response.data;
};

export const atualizarPaciente = async (
  id: number,
  dados: Omit<Paciente, 'id'>  // Garante que todos os campos necessários estão presentes
): Promise<Paciente> => {
  const response = await api.put<Paciente>(`/pacientes/${id}`, dados);
  return response.data;
};

export const deletarPaciente = async (id: number): Promise<void> => {
  await api.delete(`/pacientes/${id}`);
};