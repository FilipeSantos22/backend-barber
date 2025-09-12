import { HttpError } from '../utils/httpError';
import { SessionsRepo } from '../repositories/sessions.repo';

import type { Session } from '../models/session';

export const SessionsService = {
    createSession: async (data: Session) => {
        try {
            const session = await SessionsRepo.create(data);
            return session;
        } catch (error) {
            throw new HttpError(500, 'Error creating session');
        }
    },

    getSessions: async () => {
        try {
            const sessions = await SessionsRepo.findAll();
            return sessions;
        } catch (error) {
            throw new HttpError(500, 'Error fetching sessions');
        }
    },

    getSessionByToken: async (token: string) => {
        try {
            const session = await SessionsRepo.findByToken(token);
            if (!session) throw new HttpError(404, 'Session not found');
            return session;
        } catch (error) {
            throw new HttpError(500, 'Error fetching session');
        }
    },

    updateSession: async (id: string, data: Partial<Session>) => {
        try {
            const session = await SessionsRepo.update(id, data);
            if (!session) throw new HttpError(404, 'Session not found');
            return session;
        } catch (error) {
            throw new HttpError(500, 'Error updating session');
        }
    },

    deleteSession: async (id: string) => {
        try {
            const result = await SessionsRepo.delete(id);
            if (!result) throw new HttpError(404, 'Session not found');
        } catch (error) {
            throw new HttpError(500, 'Error deleting session');
        }
    },
};
