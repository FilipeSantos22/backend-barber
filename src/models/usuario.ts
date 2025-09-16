export type Usuario = {
  id: number; 
  name: string;
  email: string;
  telefone?: string;
  senha: string;
  tipo: 'admin' | 'barbeiro' | 'cliente';
  data_criacao?: string;
  data_atualizacao?: string;
  excluido?: boolean;
  idBarbearia?: number;
};