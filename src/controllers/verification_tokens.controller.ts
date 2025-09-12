import type { Request, Response, NextFunction } from 'express';
import { VerificationTokensService } from '../services/verification_tokens.service';

export const VerificationTokensController = {
    createVerificationToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await VerificationTokensService.createVerificationToken(req.body);
            res.status(201).json(token);
        } catch (error) {
            next(error);
        }
    },

    getVerificationTokens: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokens = await VerificationTokensService.getVerificationTokens();
            res.status(200).json(tokens);
        } catch (error) {
            next(error);
        }
    },

    getVerificationTokenById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: 'id is required' });
                return;
            }
            const token = await VerificationTokensService.getVerificationTokenById(id);
            res.status(200).json(token);
        } catch (error) {
            next(error);
        }
    },

    updateVerificationToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: 'id is required' });
                return;
            }
            const token = await VerificationTokensService.updateVerificationToken(id, req.body);
            res.status(200).json(token);
        } catch (error) {
            next(error);
        }
    },

    deleteVerificationToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: 'id is required' });
                return;
            }
            await VerificationTokensService.deleteVerificationToken(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
};
