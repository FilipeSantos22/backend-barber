export type Usuario = {
  idUsuario: number; 
  nome: string;
  email: string;
  telefone?: string;
  tipo?: 'admin' | 'barbeiro' | 'cliente';
  data_criacao?: string;
  data_atualizacao?: string;
};