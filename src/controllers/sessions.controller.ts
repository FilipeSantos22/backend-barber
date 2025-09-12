import type { Request, Response, NextFunction } from 'express';
import { SessionsService } from '../services/sessions.service';

export const SessionsController = {
    createSession: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await SessionsService.createSession(req.body);
            res.status(201).json(session);
        } catch (error) {
            next(error);
        }
    },

    getSessions: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessions = await SessionsService.getSessions();
            res.status(200).json(sessions);
        } catch (error) {
            next(error);
        }
    },

    getSessionByToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.params;
            if (!token) {
                res.status(400).json({ message: 'token is required' });
                return;
            }
            const session = await SessionsService.getSessionByToken(token);
            res.status(200).json(session);
        } catch (error) {
            next(error);
        }
    },

    updateSession: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: 'id is required' });
                return;
            }
            const session = await SessionsService.updateSession(id, req.body);
            res.status(200).json(session);
        } catch (error) {
            next(error);
        }
    },

    deleteSession: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: 'id is required' });
                return;
            }
            await SessionsService.deleteSession(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
};
