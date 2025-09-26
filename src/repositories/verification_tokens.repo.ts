import db from '../database/knex';
import type { VerificationToken } from '../models/verification_token';

export const VerificationTokensRepo = {
    create: async (data: Omit<VerificationToken, 'id'>) => {
        return await db('verification_token').insert(data);
    },

    findAll: async () => {
        return db('verification_token').select('*');
    },

    findById: async (id: string) => {
        return db('verification_token').select('*').where({ id }).first();
    },

    update: async (id: string, data: Partial<VerificationToken>) => {
        await db('verification_token').update(data).where({ id });
        return { id, ...data };
    },

    delete: async (id: string) => {
        await db('verification_token').delete().where({ id });
    },

    findByIdentifierAndToken: async (identifier: string, token: string) => {
        return db('verification_token')
            .select('*')
            .where({ identifier, token })
            .first();
    }
};
