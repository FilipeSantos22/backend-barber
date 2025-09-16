import db from '../database/knex';
import type { Account } from '../models/account';

export const AccountsRepo = {
    async create(payload: Partial<Account>): Promise<Account> {
        const [row] = await db<Account>('accounts').insert(payload).returning('*');

        if (!row) {
            throw new Error('Erro ao criar novo account');
        }
        return row;
    },

    async findAll(): Promise<Account[]> {
        return db<Account>('accounts').select('*');
    },

    async findById(id: string): Promise<Account | null> {
        const [row] = await db<Account>('accounts').where('id', id).select('*');
        return row || null;
    },

    async update(id: string, payload: Partial<Account>): Promise<Account | null> {
        const [row] = await db<Account>('accounts').where('id', id).update(payload).returning('*');
        return row || null;
    },

    async delete(id: string): Promise<boolean> {
        const count = await db<Account>('accounts').where('id', id).delete();
        return count > 0;
    },

    async findByProvider(provider: string, providerAccountId: string): Promise<Account | null> {
        const [row] = await db<Account>('accounts')
            .where({ provider, providerAccountId })
            .select('*');
        return row || null;
    }
};
