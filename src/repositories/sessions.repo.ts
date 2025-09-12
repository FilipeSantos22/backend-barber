import db from '../database/knex';
import type { Session } from '../models/session';

export const SessionsRepo = {
    create: async (data: Session) => {
        const [id] = await db('sessions').insert(data);
        return { id, ...data };
    },

    findAll: async () => {
        return db('sessions').select('*');
    },

    findById: async (id: string) => {
        return db('sessions').select('*').where({ id }).first();
    },

    update: async (id: string, data: Partial<Session>) => {
        await db('sessions').update(data).where({ id });
        return SessionsRepo.findById(id);
    },

    delete: async (id: string) => {
        const result = await db('sessions').delete().where({ id });
        return result > 0;
    },
};
