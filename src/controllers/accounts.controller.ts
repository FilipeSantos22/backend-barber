import type { Request, Response, NextFunction } from 'express';
import { AccountsService } from '../services/Accounts.service';

export const AccountsController = {
    createAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
        const account = await AccountsService.createAccount(req.body);
        res.status(201).json(account);
    } catch (error) {
        next(error);
    }
    },

    getAccounts: async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accounts = await AccountsService.getAccounts();
        res.status(200).json(accounts);
    } catch (error) {
        next(error);
    }
    },

    getAccountById: async (req: Request, res: Response, next: NextFunction) => {
    try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Missing account id' });
            }
            const account = await AccountsService.getAccountById(id);
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(200).json(account);
    } catch (error) {
        next(error);
    }
    },

    updateAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Missing account id' });
            }
            const account = await AccountsService.updateAccount(id, req.body);
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(200).json(account);
    } catch (error) {
        next(error);
    }
    },

    deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Missing account id' });
            }
            const success = await AccountsService.deleteAccount(id);
            if (!success) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(204).send();
    } catch (error) {
        next(error);
    }
    },
};
