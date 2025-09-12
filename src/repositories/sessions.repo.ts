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

    findByToken: async (token: string) => {
        return db('sessions').select('*').where({ token }).first();
    },

    update: async (token: string, data: Partial<Session>) => {
        await db('sessions').update(data).where({ token });
        return SessionsRepo.findByToken(token);
    },

    delete: async (token: string) => {
        const result = await db('sessions').delete().where({ token });
        return result > 0;
    },
};
