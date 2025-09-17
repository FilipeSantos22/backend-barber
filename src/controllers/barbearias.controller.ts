import type { Request, Response, NextFunction } from 'express';
import { BarbeariasService } from '../services/barbearias.service';

export const BarbeariasController = {
    async listar(req: Request, res: Response, next: NextFunction) {
        try {
            const { search } = req.query;
            let data;
            if (search) {
                data = await BarbeariasService.buscarPorNomeOuDescricao(String(search));
            } else {
                data = await BarbeariasService.listar();
            }
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
            res.status(200).json({ message: 'Barbearia excluída com sucesso.' });
        } catch (err) {
            next(err);
        }
    },

    async listarServicos(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);

            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }

            const idBarbearia = Number(raw);
            const servicos = await BarbeariasService.listarServicos(idBarbearia);
            res.json(servicos);
        } catch (err) {
            next(err);
        }
    },

    async listarAgendamentosBarbearia(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }
            const idBarbearia = Number(raw);
            const agendamentos = await BarbeariasService.listarAgendamentosBarbearia(idBarbearia);
            res.json(agendamentos);
        } catch (err) {
            next(err);
        }
    },

    async atualizarAgendamento(req: Request, res: Response, next: NextFunction) {
        try {
            const rawBarbeariaId = String(req.params.id);
            const rawAgendamentoId = String(req.params.idAgendamento);

            if (!/^\d+$/.test(rawBarbeariaId) || !/^\d+$/.test(rawAgendamentoId)) {
                return res.status(400).json({ error: 'id inválido' });
            }

            const idBarbearia = Number(rawBarbeariaId);
            const idAgendamento = Number(rawAgendamentoId);
            const updated = await BarbeariasService.atualizarAgendamento(idBarbearia, idAgendamento, req.body);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    },

    async listarBarbeiros(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }
            const idBarbearia = Number(raw);
            const barbeiros = await BarbeariasService.listarBarbeiros(idBarbearia);
            res.json(barbeiros);
        } catch (err) {
            next(err);
        }
    }

};