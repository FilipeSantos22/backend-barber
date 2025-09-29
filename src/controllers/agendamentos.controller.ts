import type { Request, Response, NextFunction } from 'express';
import { AgendamentosService } from '../services/agendamentos.service';
import { ServicosRepo } from '../repositories/servicos.repo';

export const AgendamentosController = {

    async listar(_req: Request, res: Response, next: NextFunction) {
        try {
            const { idBarbearia, data_hora, idBarbeiro } = _req.query;
            let result;

            // Só chama se todos os filtros obrigatórios existirem
            if (idBarbeiro && idBarbearia && data_hora) {
                const filters = {
                    idBarbeiro: Number(idBarbeiro),
                    idBarbearia: Number(idBarbearia),
                    data: String(data_hora).slice(0, 10),
                };

                result = await AgendamentosService.listarComFiltros(filters);

            } else if (idBarbeiro || idBarbearia || data_hora) {
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
            const id = Number(raw);
            const item = await AgendamentosService.buscarPorId(id);
            if (!item) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }
            res.json(item);
        } catch (err) {
            next(err);
        }
    },

    async buscarPorIdUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const raw = String(req.params.id);
            if (!/^\d+$/.test(raw)) {
                return res.status(400).json({ error: 'id inválido' });
            }
            const id = Number(raw);
            const item = await AgendamentosService.buscarPorIdUsuario(id);
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

            const agendamento = await AgendamentosService.buscarPorId(id);
            if (!agendamento) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }

            const servico = await ServicosRepo.findById(agendamento.idServico);
            if (!servico) {
                return res.status(404).json({ error: 'Serviço não encontrado' });
            }

            await AgendamentosService.removerIntervalo({
                idBarbeiro: agendamento.idBarbeiro,
                idServico: agendamento.idServico,
                idBarbearia: agendamento.idBarbearia,
                data_hora_inicio: agendamento.data_hora,
                duracao_minutos: servico.duracao_minutos?? 30
            });

            res.status(200).json({ message: 'Agendamento(s) excluído(s) com sucesso.' });
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