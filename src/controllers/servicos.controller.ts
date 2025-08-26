import type { Request, Response, NextFunction } from 'express';
import { ServicosService } from '../services/servicos.service';

export const ServicosController = {
    async listar(_req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ServicosService.listar();
            res.json(data);
        } catch (err) {
            next(err);
        }
    },

    async buscarPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }
            const id = Number(raw);
            const item = await ServicosService.buscarPorId(id);
            if (!item) {
                return res.status(404).json({ error: 'Serviço não encontrado' });
            }
            res.json(item);
        } catch (err) {
            next(err);
        }
    },

    async criar(req: Request, res: Response, next: NextFunction) {
        try {
            const created = await ServicosService.criar(req.body);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    },

    async atualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }
            const id = Number(raw);
            const updated = await ServicosService.atualizar(id, req.body);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    },

    async remover(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }
            const id = Number(raw);
            await ServicosService.remover(id);
            res.status(200).json({ message: 'Serviço excluído com sucesso.' });
        } catch (err) {
            next(err);
        }
    }
};