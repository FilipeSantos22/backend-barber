export type Agendamento = {
    idAgendamento?: number;
    idUsuario: number;
    idBarbeiro: number;
    idServico: number;
    idBarbearia: number;
    data_hora: string;
    descricao?: string | null;
    status: 'pendente' | 'confirmado' | 'cancelado' | 'finalizado';
    data_criacao?: string;
    data_atualizacao?: string;
    excluido?: boolean;
};