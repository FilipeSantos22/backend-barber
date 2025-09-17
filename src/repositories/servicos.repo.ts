import type { Servico } from '../models/servico';
import db from '../database/knex';
import type { Knex } from 'knex';

export const ServicosRepo = {
    async findAll(): Promise<Servico[]> {
        return db<Servico>('servico').select('*').where({ excluido: false });
    },

    async buscarPorNome(search: string) {
        return db('servico')
            .whereILike('nome', `%${search}%`)
    },

    async findById(id: number): Promise<Servico | undefined> {
        return db<Servico>('servico').where({ idServico: id, excluido: false }).first();
    },

    async findByBarbearia(idBarbearia: number): Promise<Servico[]> {
        return db<Servico>('servico')
            .where({ idBarbearia, excluido: false })
            .select('*');
    },

    async create(payload: Partial<Servico>): Promise<Servico> {
        const [row] = await db<Servico>('servico').insert(payload).returning('*');
        if (!row) {
            throw new Error('Erro ao criar novo serviço');
        }
        return row;
    },

    async update(id: number, payload: Partial<Servico>): Promise<Servico | undefined> {
        const [row] = await db<Servico>('servico').where({ idServico: id, excluido: false }).update(payload).returning('*');
        return row;
    },

    async deleteById(id: number, trx?: Knex.Transaction): Promise<void> {
        const q = trx ?? db;
        await q('servico').where({ idServico: id }).update({ excluido: true });
    },

    async deleteByBarbearia(id: number, trx?: Knex.Transaction): Promise<void> {
        const q = trx ?? db;
        await q('servico').where({ idBarbearia: id }).update({ excluido: true });
    },

    async buscarPorServicos(search: string): Promise<Servico[]> {
        return db('servico as s')
            .join('barbearia as b', 's.idBarbearia', 'b.idBarbearia')
            .where('s.nome', 'ilike', `%${search}%`)
            .andWhere('s.excluido', false)
            .andWhere('b.excluido', false)
            .select('b.*')
            .distinct();
    }
};