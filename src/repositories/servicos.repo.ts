import type { Servico } from '../models/servico';
import db from '../database/knex';

export const ServicosRepo = {
    async findAll(): Promise<Servico[]> {
        return db<Servico>('servico').select('*');
    },

  async findById(id: number): Promise<Servico | undefined> {
        return db<Servico>('servico').where({ idServico: id }).first();
    },

  async findByBarbearia(idBarbearia: number): Promise<Servico[]> {
        return db<Servico>('servico').where({ idBarbearia }).select('*');
    },

  async create(payload: Partial<Servico>): Promise<Servico> {
        const [row] = await db<Servico>('servico').insert(payload).returning('*');
        if (!row) {
            throw new Error('Erro ao criar novo serviço');
        }
        return row;
    },

  async update(id: number, payload: Partial<Servico>): Promise<Servico | undefined> {
        const [row] = await db<Servico>('servico').where({ idServico: id }).update(payload).returning('*');
        return row;
    },

  async deleteById(id: number): Promise<void> {
        await db('servico').where({ idServico: id }).del();
    }
};