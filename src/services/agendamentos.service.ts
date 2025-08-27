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

    async buscarPorId(id: number): Promise<Agendamento | null> {
        const row = await AgendamentosRepo.findById(id);
        return row ?? null;
    },

    async criar(payload: Partial<Agendamento>): Promise<Agendamento> {
        // validações básicas
        if (!payload.idUsuario || !payload.idServico || !payload.idBarbearia || !payload.data_hora) {
            throw new HttpError(400, 'idUsuario, idServico, idBarbearia e data_hora são obrigatórios');
        }

        // validar formato da data
        if (isNaN(Date.parse(payload.data_hora))) {
            throw new HttpError(400, 'data_hora inválida, use ISO 8601');
        }

        // checar existência de referências (opcional, mas recomendado)
        const usuario = await UsuariosRepo.findById(payload.idUsuario);
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

        // criar
        return AgendamentosRepo.create({
            idUsuario: payload.idUsuario,
            idBarbeiro: payload.idBarbeiro ?? payload.idUsuario, // se não informar, pode usar idUsuario (ajuste se necessário)
            idServico: payload.idServico,
            idBarbearia: payload.idBarbearia,
            data_hora: payload.data_hora,
            descricao: payload.descricao ?? null,
            status: payload.status ?? 'pendente'
        });
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
    

};