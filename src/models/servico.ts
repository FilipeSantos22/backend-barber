export type Servico = {
    idServico: number;
    nome: string;
    duracao_minutos?: number | null;
    preco?: number | null;
    idBarbearia: number; // FK
    data_criacao?: string | null;
    data_atualizacao?: string | null;
};