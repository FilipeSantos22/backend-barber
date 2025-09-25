import db from '../database/knex';
import type { Session } from '../models/session';

export const SessionsRepo = {
    create: async (data: Session) => {
        const [session] = await db('sessions').insert(data).returning('*');
        return session;
    },

    findAll: async () => {
        return db('sessions').select('*');
    },

    findByToken: async (sessionToken: string) => {
        return db('sessions').select('*').where({ sessionToken: sessionToken }).first();
    },

    update: async (sessionToken: string, data: Partial<Session>) => {
        await db('sessions').update(data).where({ sessionToken });
        return SessionsRepo.findByToken(sessionToken);
    },

    delete: async (sessionToken: string) => {
        const result = await db('sessions').delete().where({ sessionToken });
        return result > 0;
    },
};
