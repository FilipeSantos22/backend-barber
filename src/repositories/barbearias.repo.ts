import type { Barbearia } from '../models/barbearia';
import db from '../database/knex';
import type { Knex } from 'knex';

export const BarbeariasRepo = {
    async findAll(): Promise<Barbearia[]> {
        return db<Barbearia>('barbearia').select('*').where({ excluido: false });
    },

    async findById(idBarbearia: number): Promise<Barbearia | undefined> {
        return db<Barbearia>('barbearia').where({ idBarbearia, excluido: false }).first();
    },

    async create(payload: Partial<Barbearia>): Promise<Barbearia> {
        const [row] = await db<Barbearia>('barbearia').insert(payload).returning('*');
        if (!row) {
            throw new Error('Erro ao criar nova barbearia');
        }
        return row;
    },

    async update(idBarbearia: number, payload: Partial<Barbearia>): Promise<Barbearia | undefined> {
        const [row] = await db<Barbearia>('barbearia').where({ idBarbearia, excluido: false }).update(payload).returning('*');
        return row;
    },

    async deleteById(idBarbearia: number, trx?: Knex.Transaction): Promise<void> {
        const q = trx ?? db;
        await q('barbearia').where({ idBarbearia }).update({ excluido: true });
    },

    async findByName(nome: string): Promise<Barbearia | undefined> {
        return db<Barbearia>('barbearia').where({ nome, excluido: false }).first();
    },

    async buscarPorNomeOuDescricao(search: string): Promise<Barbearia[]> {
        return db('barbearia')
            .whereILike('nome', `%${search}%`);
    }
};