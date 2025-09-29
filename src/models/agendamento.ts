export type Agendamento = {
    idAgendamento?: number;
    id: number;
    idBarbeiro: number;
    idServico: number;
    idBarbearia: number;
    data_hora: string;
    descricao?: string | null;
    status: 'pendente' | 'confirmado' | 'cancelado' | 'finalizado';
    data_criacao?: string;
    data_atualizacao?: string;
    excluido?: boolean;
    duracao_minutos: number; // duração do serviço em minutos -> da tabela de serviços
};