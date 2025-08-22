import { BarbeariasRepo } from '../repositories/barbearias.repo';
import type { Barbearia } from '../models/barbearia';
import { HttpError } from '../utils/httpError';

export const BarbeariasService = {
    async listar(): Promise<Barbearia[]> {
        return BarbeariasRepo.findAll();
    },

    async buscarPorId(id: number): Promise<Barbearia | null> {
        const row = await BarbeariasRepo.findById(id);
        return row ?? null;
    },

    async criar(payload: Partial<Barbearia>): Promise<Barbearia> {
        if (!payload.nome) {
            throw new HttpError(400, 'nome obrigatório');
        }

        // opcional: prevenir duplicidade por nome
        const exists = await BarbeariasRepo.findByName(String(payload.nome));

        if (exists) {
            throw new HttpError(409, 'barbearia com esse nome já existe');
        }
        return BarbeariasRepo.create(payload);
    },

    async atualizar(id: number, payload: Partial<Barbearia>): Promise<Barbearia> {
        const row = await BarbeariasRepo.findById(id);
        if (!row) {
            throw new HttpError(404, 'barbearia não encontrada');
        }
        return (await BarbeariasRepo.update(id, payload)) as Barbearia;
    },

    async remover(id: number): Promise<void> {
        const row = await BarbeariasRepo.findById(id);
        if (!row) {
            throw new HttpError(404, 'barbearia não encontrada');
        }
        await BarbeariasRepo.deleteById(id);
    }
};