import { ServicoBarbeiroRepo } from '../repositories/servico_barbeiro.repo';
import { ServicosRepo } from '../repositories/servicos.repo';
import { UsuariosRepo } from '../repositories/usuarios.repo';
import { HttpError } from '../utils/httpError';
import type { Servico_barbeiro } from '../models/servico_barbeiro';
import type { Servico } from '../models/servico';

export const ServicoBarbeiroService = {
    async criar(payload: Partial<Servico_barbeiro>): Promise<void> {
        const idServico = Number(payload.idServico);
        const idBarbeiro = Number(payload.idBarbeiro);

        if (!Number.isFinite(idServico) || !Number.isFinite(idBarbeiro)) {
            throw new HttpError(400, 'idServico e idBarbeiro devem ser números válidos');
        }

        const servico = await ServicosRepo.findById(idServico);
        if (!servico) {
            throw new HttpError(404, 'Serviço não encontrado');
        }

        const barbeiro = await UsuariosRepo.findById(idBarbeiro);
        if (!barbeiro) {
            throw new HttpError(404, 'Barbeiro não encontrado');
        }

        // opcional: checar se já existe relação
        const existentes = await ServicoBarbeiroRepo.findByServicoId(idServico);
        const already = existentes.some((r: any) => Number(r.idBarbeiro) === idBarbeiro);
        if (already) {
            throw new HttpError(409, 'Relação já existe');
        }

        await ServicoBarbeiroRepo.addRelation(idServico, idBarbeiro);
    },

    async listarServicosDoBarbeiro(idUsuario: number): Promise<Servico[]> {
        const usuario = await UsuariosRepo.findById(idUsuario);
        if (!usuario) {
            throw new HttpError(404, 'Barbeiro não encontrado');
        }
        // opcional: validar tipo do usuário (barbeiro)
        if (usuario.tipo !== 'barbeiro' && usuario.tipo !== 'admin') {
            throw new HttpError(400, 'Usuário não é barbeiro');
        }
        let servicos = await ServicoBarbeiroRepo.findByBarbeiroId(idUsuario);

        return servicos;
    },

    async listarServicosPorServico(id: number): Promise<any[]> {

        return await ServicoBarbeiroRepo.findByServicoId(id);
    },

    async listar(): Promise<Servico_barbeiro[]> {
        return await ServicoBarbeiroRepo.findAll();
    },

    async removerPorBarbeiro(id: number): Promise<void> {
        const existente = await ServicoBarbeiroRepo.findByBarbeiroId(id);
        if (!existente) {
            throw new HttpError(404, 'Relação não encontrada');
        }

        await ServicoBarbeiroRepo.removeRelationByBarber(id);
    },

    async removerPorServico(id: number): Promise<void> {
        const existente = await ServicoBarbeiroRepo.findByServicoId(id);
        if (!existente) {
            throw new HttpError(404, 'Relação não encontrada');
        }

        await ServicoBarbeiroRepo.removeRelationByServico(id);
    },

};