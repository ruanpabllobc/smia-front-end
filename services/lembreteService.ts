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

export const getLembretePorId = async (id: number) => {
  const response = await api.get<Lembrete>(`/lembretes/${id}`);
  return response.data;
};

export const criarLembrete = async (dados: CreateLembreteDto) => {
  const response = await api.post('/lembretes', dados);
  return response.data;
};

export const atualizarLembrete = async (id: number, dados: UpdateLembreteDto) => {
  const response = await api.put(`/lembretes/${id}`, dados);
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