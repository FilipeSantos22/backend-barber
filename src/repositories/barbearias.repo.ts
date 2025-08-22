import type { Barbearia } from '../models/barbearia';
import db from '../database/knex';

export const BarbeariasRepo = {
    async findAll(): Promise<Barbearia[]> {
        return db<Barbearia>('barbearias').select('*');
    },

    async findById(idBarbearia: number): Promise<Barbearia | undefined> {
        return db<Barbearia>('barbearias').where({ idBarbearia }).first();
    },

    async create(payload: Partial<Barbearia>): Promise<Barbearia> {
        const [row] = await db<Barbearia>('barbearias').insert(payload).returning('*');
        if (!row) {
            throw new Error('Erro ao criar nova barbearia');
        }
        return row;
    },

    async update(idBarbearia: number, payload: Partial<Barbearia>): Promise<Barbearia | undefined> {
        const [row] = await db<Barbearia>('barbearias').where({ idBarbearia }).update(payload).returning('*');
        return row;
    },

    async deleteById(idBarbearia: number): Promise<void> {
        await db('barbearias').where({ idBarbearia }).del();
    },

    async findByName(nome: string): Promise<Barbearia | undefined> {
        return db<Barbearia>('barbearias').where({ nome }).first();
    }
};