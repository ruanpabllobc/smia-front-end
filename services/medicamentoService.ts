import { api } from './api';
import { Medicamento } from '@/types/Medicamento';

export const getTodosMedicamentos = async () => {
  const response = await api.get<Medicamento[]>('/medicamentos');
  return response.data;
};

export const getMedicamentoPorId = async (id: number) => {
  const response = await api.get<Medicamento>(`/medicamentos/${id}`);
  return response.data;
};

export const getMedicamentosPorPaciente = async (pacienteId: number) => {
  const response = await api.get<Medicamento[]>(`/medicamentos/por-paciente/${pacienteId}`);
  return response.data;
};

export const criarMedicamento = async (dados: Omit<Medicamento, 'id'>) => {
  const response = await api.post('/medicamentos', dados);
  return response.data;
};

export const atualizarMedicamento = async (id: number, dados: Partial<Medicamento>) => {
  const response = await api.put(`/medicamentos/${id}`, dados);
  return response.data;
};

export const deletarMedicamento = async (id: number) => {
  const response = await api.delete(`/medicamentos/${id}`);
  return response.data;
};