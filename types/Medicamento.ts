export interface Medicamento {
  id: number;
  nome: string;
  intervalo: string; 
  quantidade: number;
  data_inicio: string;
  data_fim: string;
  paciente: number; 
  especialista: number;
}