import type { Agendamento } from '../models/agendamento';
import db from '../database/knex';

export const AgendamentosRepo = {
    async findAll(): Promise<Agendamento[]> {
        return db<Agendamento>('agendamento').select('*');
    },

    async findById(id: number): Promise<Agendamento | undefined> {
        return db<Agendamento>('agendamento').where({ idAgendamento: id }).first();
    },

    async findByUsuario(idUsuario: number): Promise<Agendamento[]> {
        return db<Agendamento>('agendamento').where({ idUsuario }).select('*');
    },

    async findByBarbearia(idBarbearia: number): Promise<Agendamento[]> {
        return db<Agendamento>('agendamento').where({ idBarbearia }).select('*');
    },

    async create(payload: Partial<Agendamento>): Promise<Agendamento> {
        const [row] = await db<Agendamento>('agendamento').insert(payload).returning('*');
        if (!row) {
            throw new Error('Erro ao criar novo agendamento');
        }
        return row;
    },

    async update(id: number, payload: Partial<Agendamento>): Promise<Agendamento | undefined> {
        const [row] = await db<Agendamento>('agendamento').where({ idAgendamento: id }).update(payload).returning('*');
        return row;
    },

    async deleteById(id: number): Promise<void> {
        await db('agendamento').where({ idAgendamento: id }).del().returning('*');
    },

};