import { AgendamentosRepo } from '../repositories/agendamentos.repo';
import { HttpError } from '../utils/httpError';
import type { Agendamento } from '../models/agendamento';

// Opcional: verificar existência de usuário/serviço/barbearia
import { UsuariosRepo } from '../repositories/usuarios.repo';
import { ServicosRepo } from '../repositories/servicos.repo';
import { BarbeariasRepo } from '../repositories/barbearias.repo';

const ALLOWED = ['pendente','confirmado','cancelado','finalizado'] as const;
type StatusType = typeof ALLOWED[number];

async function validarStatus(status: string): Promise<StatusType> {
    const s = status.toLowerCase() as StatusType;
    if (!ALLOWED.includes(s)) throw new HttpError(400, 'status inválido');
    return s;
}

export const AgendamentosService = {
    async listar(): Promise<Agendamento[]> {
        return AgendamentosRepo.findAll();
    },

    async buscarPorIdUsuario(idUsuario: number): Promise<Agendamento | null> {
        return AgendamentosRepo.findByUsuario(idUsuario) as unknown as Agendamento | null;
    },

    async buscarPorId(idAgendamento: number): Promise<Agendamento | null> {
        const row = await AgendamentosRepo.findById(idAgendamento);
        return row ?? null;
    },

    async criar(payload: Partial<Agendamento>): Promise<Agendamento[]> {
        // validações básicas
        if (!payload.id || !payload.idServico || !payload.idBarbearia || !payload.data_hora) {
            throw new HttpError(400, 'id, idServico, idBarbearia e data_hora são obrigatórios');
        }

        // validar formato da data
        if (isNaN(Date.parse(payload.data_hora))) {
            throw new HttpError(400, 'data_hora inválida, use ISO 8601');
        }

        // checar existência de referências (opcional, mas recomendado)
        const usuario = await UsuariosRepo.findById(payload.id);
        if (!usuario) {
            throw new HttpError(404, 'Usuário não encontrado');
        }

        const servico = await ServicosRepo.findById(payload.idServico);
        if (!servico) {
            throw new HttpError(404, 'Serviço não encontrado');
        }

        const barbearia = await BarbeariasRepo.findById(payload.idBarbearia);
        if (!barbearia) {
            throw new HttpError(404, 'Barbearia não encontrada');
        }

        // Cálculo dos horários ocupados
        const duracao = servico.duracao_minutos ?? 30;
        const horariosOcupados = await this.calcularHorariosOcupados(payload.data_hora, duracao);

        // Verifica se todos os horários estão livres
        for (const horario of horariosOcupados) {
            const existe = await AgendamentosRepo.findAgendamentoPorHorario({
                idBarbeiro: payload.idBarbeiro ?? payload.id,
                idServico: payload.idServico,
                idBarbearia: payload.idBarbearia,
                data_hora: horario
            });
            if (existe) {
                throw new HttpError(409, `Horário ${new Date(horario).toLocaleTimeString()} já está ocupado para este barbeiro`);
            }
        }

        // Cria um agendamento para cada horário ocupado
        const agendamentosCriados: Agendamento[] = [];
        for (const horario of horariosOcupados) {
            const agendamento = await AgendamentosRepo.create({
                id: payload.id,
                idBarbeiro: payload.idBarbeiro ?? payload.id,
                idServico: payload.idServico,
                idBarbearia: payload.idBarbearia,
                data_hora: horario,
                descricao: payload.descricao ?? null,
                status: payload.status ?? 'pendente'
            });
            agendamentosCriados.push(agendamento);
        }

        return agendamentosCriados;
    },

    async atualizar(id: number, payload: Partial<Agendamento>): Promise<Agendamento> {
        const exists = await AgendamentosRepo.findById(id);
        let body: any = payload;

        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (error) {
                throw new HttpError(400, 'Corpo da requisição inválido');
            }
        }

        if (!exists) {
            throw new HttpError(404, 'Agendamento não encontrado');
        }

        if (body.data_hora && isNaN(Date.parse(body.data_hora))) {
            throw new HttpError(400, 'data_hora inválida');
        }

        const updated = await AgendamentosRepo.update(id, body);
        return (updated as Agendamento);
    },

    async remover(id: number): Promise<void> {
        const exists = await AgendamentosRepo.findById(id);
        if (!exists) {
            throw new HttpError(404, 'Agendamento não encontrado');
        }
        await AgendamentosRepo.deleteById(id);
    },

    async atualizarStatus(id: number, statusRaw: string, descricao?: string) {
        const status = await validarStatus(statusRaw);

        const ag = await AgendamentosRepo.findById(id);
        if (!ag) throw new HttpError(404, 'Agendamento não encontrado');

        // exigir motivo ao cancelar (opcional)
        if (status === 'cancelado' && (!descricao || !String(descricao).trim())) {
            throw new HttpError(400, 'motivo é obrigatório ao cancelar');
        }

        const payload: Partial<Agendamento> = {
            status: status,
            descricao: status === 'cancelado'
                ? (descricao !== undefined ? descricao : ag.descricao ?? null)
                : (ag.descricao ?? null),
            data_atualizacao: new Date().toISOString()
        };

        const updated = await AgendamentosRepo.update(id, payload);
        return updated as Agendamento;
    },

    async listarComFiltros(filtrosHorarios: {
        idBarbeiro: number;
        idBarbearia: number;
        data: string;
    }): Promise<{ horario: string }[]> {
        // Validação simples
        if (
            !filtrosHorarios.idBarbeiro ||
            !filtrosHorarios.idBarbearia ||
            !filtrosHorarios.data
        ) {
            throw new HttpError(400, 'Todos os filtros são obrigatórios');
        }

        return await AgendamentosRepo.listarHorariosDisponiveis(filtrosHorarios);
    },

    async calcularHorariosOcupados(data_hora: string, duracao_minutos: number): Promise<string[]> {
        const horarios: string[] = [];
        let horarioAtual = new Date(data_hora);

        for (let i = 0; i < duracao_minutos; i += 30) {
            horarios.push(horarioAtual.toISOString());
            horarioAtual.setMinutes(horarioAtual.getMinutes() + 30);
        }
        return horarios;
    },

    async removerIntervalo({
        idBarbeiro,
        idServico,
        idBarbearia,
        data_hora_inicio,
        duracao_minutos
    }: {
        idBarbeiro: number;
        idServico: number;
        idBarbearia: number;
        data_hora_inicio: string;
        duracao_minutos: number;
    }): Promise<void> {
        const horariosOcupados = await this.calcularHorariosOcupados(data_hora_inicio, duracao_minutos);
        await AgendamentosRepo.excluirAgendamentosIntervalo({
            idBarbeiro,
            idServico,
            idBarbearia,
            horarios: horariosOcupados
        });
    }
};