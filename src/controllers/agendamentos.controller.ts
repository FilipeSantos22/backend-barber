import type { Request, Response, NextFunction } from 'express';
import { AgendamentosService } from '../services/agendamentos.service';

export const AgendamentosController = {

    async listar(_req: Request, res: Response, next: NextFunction) {
        try {
            const { idBarbearia, idServico, data_hora, idBarbeiro } = _req.query;
            let result;

            // Só chama se todos os filtros obrigatórios existirem
            if (idBarbeiro && idServico && idBarbearia && data_hora) {
                const filters = {
                    idBarbeiro: Number(idBarbeiro),
                    idServico: Number(idServico),
                    idBarbearia: Number(idBarbearia),
                    data: String(data_hora).slice(0, 10),
                };

                result = await AgendamentosService.listarComFiltros(filters);

            } else if (idBarbeiro || idServico || idBarbearia || data_hora) {
                // Se faltar algum filtro, retorne erro ou trate conforme sua regra
                return res.status(400).json({ error: 'Todos os filtros são obrigatórios para buscar horários disponíveis.' });
            } else {
                result = await AgendamentosService.listar();
            }
            res.json(result);
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
            const idAgendamento = Number(raw);
            const item = await AgendamentosService.buscarPorId(idAgendamento);
            if (!item) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }
            res.json(item);
        } catch (err) {
            next(err);
        }
    },

    async criar(req: Request, res: Response, next: NextFunction) {
        try {
            const created = await AgendamentosService.criar(req.body);
            res.status(201).json(created);
        } catch (err) {
            next(err);
        }
    },

    async atualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            const id = Number(raw);
            let statusPermitido = true;

            if (req.body.status !== undefined) {
                const raw = String(req.body.status).trim();
                req.body.status = raw.toLowerCase();
                statusPermitido = await AgendamentosController.checkStatus(req.body.status);
            }
            if (!statusPermitido) {
                throw new Error('Status inválido para este agendamento');
            }
        
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }
            const updated = await AgendamentosService.atualizar(id, req.body);
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
            await AgendamentosService.remover(id);
            res.status(200).json({ message: 'Agendamento excluído com sucesso.' });
        } catch (err) {
            next(err);
        }
    },
     
    async checkStatus(status: string): Promise<boolean> {

        status = status.toLowerCase();
        const allowedStatuses = ['pendente', 'confirmado', 'cancelado', 'finalizado'];
        return allowedStatuses.includes(status);
    },

    async atualizarStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }

            const id = Number(raw);
            const { status } = req.body;
            if (!status) {
                return res.status(400).json({ error: 'Status é obrigatório' });
            }
            
            const statusValido = await AgendamentosController.checkStatus(status);
            if (!statusValido) {
                return res.status(400).json({ error: 'Status inválido' });
            }

            const updated = await AgendamentosService.atualizarStatus(id, status);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }
};