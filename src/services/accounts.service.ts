import { HttpError } from '../utils/httpError';

import type { Account } from '../models/account';
import { AccountsRepo } from '../repositories/accounts.repo';

export const AccountsService = {
    createAccount: async (data: Partial<Account>) => {
    try {
            const account = await AccountsRepo.create(data);
            return account;
    } catch (error) {
        throw new HttpError(500, 'Error creating account');
    }
    },

    getAccounts: async () => {
    try {
            const accounts = await AccountsRepo.findAll();
            return accounts;
    } catch (error) {
        throw new HttpError(500, 'Error fetching accounts');
    }
    },

    getAccountById: async (id: string) => {
    try {
            const account = await AccountsRepo.findById(id);
            if (!account) {
                throw new HttpError(404, 'Account not found');
            }
            return account;
    } catch (error) {
        throw new HttpError(500, 'Error fetching account');
    }
    },

    updateAccount: async (id: string, data: Partial<Account>) => {
    try {
            const account = await AccountsRepo.update(id, data);
            if (!account) {
                throw new HttpError(404, 'Account not found');
            }
            return account;
    } catch (error) {
        throw new HttpError(500, 'Error updating account');
    }
    },

    deleteAccount: async (id: string) => {
    try {
            const success = await AccountsRepo.delete(id);
            if (!success) {
                throw new HttpError(404, 'Account not found');
            }
            return success;
    } catch (error) {
        throw new HttpError(500, 'Error deleting account');
    }
    },
};
