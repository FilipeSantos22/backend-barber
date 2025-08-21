export type Usuario = {
  id: number; // ou string se for UUID
  nome: string;
  email: string;
  telefone?: string;
  tipo?: 'admin' | 'barbeiro' | 'cliente';
  data_criacao?: string;
  data_atualizacao?: string;
};