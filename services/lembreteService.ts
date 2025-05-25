// src/services/lembreteService.ts
import { api } from './api';
import { Lembrete, CreateLembreteDto, UpdateLembreteDto } from '@/types/Lembrete';

export const getTodosLembretes = async () => {
  const response = await api.get<Lembrete[]>('/lembretes');
  return response.data;
};

export const getLembretesPorPaciente = async (pacienteId: number) => {
  const response = await api.get<Lembrete[]>(`/lembretes/por-paciente/${pacienteId}`);
  return response.data;
};

export const getLembretePorId = async (id: number): Promise<Lembrete> => {
  const response = await api.get(`/lembretes/${id}`);
  return {
    ...response.data,
    medicamento: response.data.medicamento || { id: 0, nome: '' },
    paciente: response.data.paciente || { id: 0, nome: '' }
  };
};

export const criarLembrete = async (dados: CreateLembreteDto) => {
  const payload = {
    data_hora: dados.data_hora,
    medicamento: dados.medicamento_id, 
    paciente: dados.paciente_id,       
    status: false                      
    };
  
  const response = await api.post('/lembretes', payload);
  return response.data;
};

export const atualizarLembrete = async (id: number, dados: UpdateLembreteDto) => {
  const payload = {
    data_hora: dados.data_hora,
    status: dados.status,
    medicamento: dados.medicamento_id,
    paciente: dados.paciente_id
  };

  console.log('Payload final enviado ao backend:', payload);

  const response = await api.put(`/lembretes/${id}`, payload);
  return response.data;
};

export const deletarLembrete = async (id: number) => {
  const response = await api.delete(`/lembretes/${id}`);
  return response.data;
};

export const marcarLembreteComoRealizado = async (id: number) => {
  const response = await api.patch(`/lembretes/${id}/realizado`);
  return response.data;
};