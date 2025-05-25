export interface Paciente {
  id?: number;
  nome: string;
  cpf: number;       
  email: string;
  data_nascimento: string;
  peso: number;
  altura: number;
  especialista: number
}

export type NovoPaciente = Omit<Paciente, 'id'>;  // Tipo específico para criação
