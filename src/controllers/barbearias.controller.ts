import type { Request, Response, NextFunction } from 'express';
import { BarbeariasService } from '../services/barbearias.service';

export const BarbeariasController = {
    async listar(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await BarbeariasService.listar();
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
        const idBarbearia = Number(raw);
        const item = await BarbeariasService.buscarPorId(idBarbearia);
        if (!item) {
            return res.status(404).json({ error: 'Barbearia não encontrada' });
        }
        res.json(item);
    } catch (err) {
        next(err);
    }
  },

  async criar(req: Request, res: Response, next: NextFunction) {
      try {
          const created = await BarbeariasService.criar(req.body);
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
        const idBarbearia = Number(raw);
        const updated = await BarbeariasService.atualizar(idBarbearia, req.body);
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
        const idBarbearia = Number(raw);
        await BarbeariasService.remover(idBarbearia);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
  }
};