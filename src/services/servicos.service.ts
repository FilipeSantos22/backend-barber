import { ServicosRepo } from '../repositories/servicos.repo';
import { HttpError } from '../utils/httpError';
import type { Servico } from '../models/servico';
import { ServicoBarbeiroRepo } from '../repositories/servico_barbeiro.repo';
import db from '../database/knex';

export const ServicosService = {
    async listar(): Promise<Servico[]> {
        return ServicosRepo.findAll();
    },

    async buscarPorId(id: number): Promise<Servico | null> {
        const row = await ServicosRepo.findById(id);
        return row ?? null;
    },

    async criar(payload: Partial<Servico>): Promise<Servico> {
        if (!payload.nome) {
            throw new HttpError(400, 'nome obrigatório');
        }
        if (!payload.idBarbearia) {
            throw new HttpError(400, 'idBarbearia obrigatório');
        }
        // opcional: checar existência da barbearia antes
        return ServicosRepo.create(payload);
    },

    async atualizar(id: number, payload: Partial<Servico>): Promise<Servico> {
        const exists = await ServicosRepo.findById(id);
        if (!exists) {
            throw new HttpError(404, 'serviço não encontrado');
        }
        const updated = await ServicosRepo.update(id, payload);
        return updated as Servico;
    },

    async remover(id: number): Promise<void> {
        const exists = await ServicosRepo.findById(id);
        if (!exists) {
            throw new HttpError(404, 'serviço não encontrado');
        }
        await db.transaction(async (trx) => {
            await ServicosRepo.deleteById(id, trx);
            await ServicoBarbeiroRepo.removeRelationByServico(id, trx);
        });
    },
};