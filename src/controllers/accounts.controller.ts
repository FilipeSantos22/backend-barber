import type { Request, Response, NextFunction } from 'express';
import { AccountsService } from '../services/accounts.service';

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
            const { provider, providerAccountId } = req.query;
            if (provider && providerAccountId) {
                // Buscar conta específica
                const account = await AccountsService.getByProviderAndAccountId(
                    provider as string,
                    providerAccountId as string
                );
                if (!account) return res.status(404).json({ message: 'Conta não encontrada' });
                return res.json(account);
            }
            // Listar todas as contas (opcional)
            const accounts = await AccountsService.getAccounts();
            return res.json(accounts);
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

    getAccountByProvider: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { provider, providerAccountId } = req.query;
            if (!provider || !providerAccountId) {
                return res.status(400).json({ message: 'Missing provider or providerAccountId' });
            }
            if (typeof provider !== 'string' || typeof providerAccountId !== 'string') {
                return res.status(400).json({ message: 'provider and providerAccountId must be strings' });
            }
            if ((provider && !providerAccountId) || (!provider && providerAccountId)) {
                return res.status(400).json({ message: 'provider e providerAccountId devem ser enviados juntos' });
            }
            const account = await AccountsService.getByProviderAndAccountId(provider, providerAccountId);
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.status(200).json(account);
        } catch (error) {
            next(error);
        }
    },

};
