import { UsuariosRepo } from '../repositories/usuarios.repo';
import { HttpError } from '../utils/httpError';
import { ServicoBarbeiroRepo } from '../repositories/servico_barbeiro.repo';
import type { Servico } from '../models/servico';

export const UsuariosService = {

    async listarTodos() { 
        return UsuariosRepo.findAll(); 
    },

    async criar(payload: any) {
        // validações simples aqui
        if (!payload.email) {
            throw new Error('email obrigatório');
        }
        return UsuariosRepo.create(payload);
    },

    async atualizar(id: number, payload: any) {
        // validações simples aqui
        if (!payload.email) {
            throw new Error('email obrigatório');
        }

        return UsuariosRepo.update(id, payload);
    },

    async buscarPorId(idUsuario: number) {
        return UsuariosRepo.findById(idUsuario);
    },

    async deletarPorId(idUsuario: number) {
        return UsuariosRepo.deleteById(idUsuario);
    },

    async buscarPorEmail(email: string) {
        return UsuariosRepo.findByEmail(email);
    },

    async compararSenhas(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return UsuariosRepo.comparePasswords(plainPassword, hashedPassword);
    },

    async atualizarSenha(id: number, newPassword: string): Promise<void> {
        return UsuariosRepo.updatePassword(id, newPassword);
    },

    async listarServicosDoBarbeiro(idUsuario: number): Promise<Servico[]> {
        const usuario = await UsuariosRepo.findById(idUsuario);
        if (!usuario) {
            throw new HttpError(404, 'Usuário não encontrado');
        }
        // opcional: validar tipo do usuário (barbeiro)
        if (usuario.tipo !== 'barbeiro' && usuario.tipo !== 'admin') {
            throw new HttpError(400, 'Usuário não é barbeiro');
        }
        let servicos = await ServicoBarbeiroRepo.findByBarbeiroId(idUsuario);

        return servicos;
    }

};