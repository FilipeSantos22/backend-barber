import db from '../database/knex';
import type { VerificationToken } from '../models/verification_token';

export const VerificationTokensRepo = {
    create: async (data: Omit<VerificationToken, 'id'>) => {
        const [id] = await db('verification_tokens').insert(data);
        return { id, ...data };
    },

    findAll: async () => {
        return db('verification_tokens').select('*');
    },

    findById: async (id: string) => {
        return db('verification_tokens').select('*').where({ id }).first();
    },

    update: async (id: string, data: Partial<VerificationToken>) => {
        await db('verification_tokens').update(data).where({ id });
        return { id, ...data };
    },

    delete: async (id: string) => {
        await db('verification_tokens').delete().where({ id });
    },
};
