export type Usuario = {
  idUsuario: number; 
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
  tipo: 'admin' | 'barbeiro' | 'cliente';
  data_criacao?: string;
  data_atualizacao?: string;
  excluido?: boolean;
  idBarbearia?: number;
};