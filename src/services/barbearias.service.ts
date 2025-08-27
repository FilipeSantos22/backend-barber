import { BarbeariasRepo } from '../repositories/barbearias.repo';
import type { Barbearia } from '../models/barbearia';
import { HttpError } from '../utils/httpError';
import db from '../database/knex';
import { ServicosRepo } from '../repositories/servicos.repo';
import { ServicoBarbeiroRepo } from '../repositories/servico_barbeiro.repo';
import { AgendamentosRepo } from '../repositories/agendamentos.repo';
import { UsuariosRepo } from '../repositories/usuarios.repo';

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
        await db.transaction(async (trx) => {
            const barbearia = await BarbeariasRepo.findById(id);
            await BarbeariasRepo.deleteById(id, trx);
            if (barbearia) {
                const servico = await ServicosRepo.findByBarbearia(barbearia.idBarbearia);
                await ServicosRepo.deleteByBarbearia(barbearia.idBarbearia, trx);
                
                if (servico && Array.isArray(servico)) {
                    for (const s of servico) {
                        await ServicoBarbeiroRepo.removeRelationByServico(s.idServico, trx);
                    }
                } else if (servico) {
                    const singleServico = servico as { idServico: number };
                    await ServicoBarbeiroRepo.removeRelationByServico(singleServico.idServico, trx);
                }
            }
        });
    },

    async listarServicos(idBarbearia: number): Promise<any[]> {
        return ServicosRepo.findByBarbearia(idBarbearia);
    },

    async listarAgendamentosBarbearia(idBarbearia: number): Promise<any[]> {
        return AgendamentosRepo.findByBarbearia(idBarbearia);
    },

    async atualizarAgendamento(idBarbearia: number, idAgendamento: number, payload: any): Promise<any> {
        // Lógica para atualizar o agendamento
        return AgendamentosRepo.update(idAgendamento, payload);
    },

    async listarBarbeiros(idBarbearia: number): Promise<any[]> {
        return UsuariosRepo.findBarbeirosByBarbearia(idBarbearia);
    }
};