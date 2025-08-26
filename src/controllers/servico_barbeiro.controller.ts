import type { Request, Response, NextFunction } from 'express';
import { ServicoBarbeiroService } from '../services/servico_barbeiro.service';

export const ServicoBarbeiroController = {
    async criar(req: Request, res: Response, next: NextFunction) {
        try {
            await ServicoBarbeiroService.criar(req.body);
            res.status(201).json({ message: 'Relação criada' });
        } catch (err) {
            next(err);
        }
    },

    async listar(req: Request, res: Response, next: NextFunction) {
        try {
            const servicos = await ServicoBarbeiroService.listar();
            res.json(servicos);
        } catch (err) {
            next(err);
        }
    },

    async listarServicosPorBarbeiro(req: Request, res: Response, next: NextFunction) {
          try {
              const raw = String(req.params.id ?? '');
              if (!/^\d+$/.test(raw)) {
                  return res.status(400).json({ error: 'id inválido. Deve conter apenas números.' });
              }
              const id = Number(raw);
              const servicos = await ServicoBarbeiroService.listarServicosDoBarbeiro(id);
              if (!servicos || servicos.length === 0) {
                  return res.status(404).json({ message: 'Esse barbeiro não possui serviços cadastrados', servicos: [] });
              }
              res.json(servicos);
          } catch (err) {
              next(err);
          }
    },

    async removerPorBarbeiro(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id ?? '');
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido. Deve conter apenas números.' });
            }
            const id = Number(raw);
            await ServicoBarbeiroService.removerPorBarbeiro(id);
            res.status(200).json({ message: 'Removido com sucesso.' });
        } catch (err) {
            next(err);
        }
    },

    async removerPorServico(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id ?? '');
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido. Deve conter apenas números.' });
            }
            const id = Number(raw);
            await ServicoBarbeiroService.removerPorServico(id);
            res.status(200).json({ message: 'Removido com sucesso.' });
        } catch (err) {
            next(err);
        }
    },

    async listarServicosPorServico(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id ?? '');
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido. Deve conter apenas números.' });
            }
            const id = Number(raw);
            const servicos = await ServicoBarbeiroService.listarServicosPorServico(id);
            if (!servicos || servicos.length === 0) {
                return res.status(404).json({ message: 'Esse serviço não possui barbeiros cadastrados', servicos: [] });
            }
            res.json(servicos);
        } catch (err) {
            next(err);
        }
    },

};