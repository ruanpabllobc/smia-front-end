export interface Lembrete {
  id: number;
  data_hora: string;
  status: boolean;
  medicamento: {
    id: number;
    nome: string;
  };
  paciente: {
    id: number;
    nome: string;
  };
}

export interface CreateLembreteDto {
  data_hora: string;
  medicamento_id: number;
  paciente_id: number;
}

export interface UpdateLembreteDto {
  data_hora?: string;
  status?: boolean;
  medicamento_id?: number;
}