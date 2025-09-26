import { HttpError } from '../utils/httpError';
//service para lidar com tokens de verificação
import { VerificationTokensRepo } from '../repositories/verification_tokens.repo';

export const VerificationTokensService = {
    createVerificationToken: async (data: any) => {
        await VerificationTokensRepo.create(data);
        return data;
    },

    getVerificationTokens: async () => {
        try {
            const tokens = await VerificationTokensRepo.findAll();
            return tokens;
        } catch (error) {
            throw new HttpError(500, 'Error fetching verification tokens');
        }
    },

    getVerificationTokenById: async (id: string) => {
        try {
            const token = await VerificationTokensRepo.findById(id);
            if (!token) {
                throw new HttpError(404, 'Verification token not found');
            }
            return token;
        } catch (error) {
            throw new HttpError(500, 'Error fetching verification token');
        }
    },

    updateVerificationToken: async (id: string, data: any) => {
        try {
            const token = await VerificationTokensRepo.update(id, data);
            if (!token) {
                throw new HttpError(404, 'Verification token not found');
            }
            return token;
        } catch (error) {
            throw new HttpError(500, 'Error updating verification token');
        }
    },

    deleteVerificationToken: async (id: string) => {
        try {
            const result = await VerificationTokensRepo.delete(id);
            if (result == null) {
                throw new HttpError(404, 'Verification token not found');
            }
        } catch (error) {
            throw new HttpError(500, 'Error deleting verification token');
        }
    },
    useVerificationToken: async (identifier: string, token: string) => {
        try {
            const vt = await VerificationTokensRepo.findByIdentifierAndToken(identifier, token);
            if (!vt) {
                throw new HttpError(404, 'Verification token not found');
            }
            return vt;
        } catch (error) {
            throw new HttpError(500, 'Error using verification token');
        }
    },
};
