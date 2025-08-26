import { UsuariosRepo } from '../repositories/usuarios.repo';
import { HttpError } from '../utils/httpError';
import { ServicoBarbeiroRepo } from '../repositories/servico_barbeiro.repo';
import db from '../database/knex';

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

    async remover(id: number): Promise<void> {
        const usuario = await UsuariosRepo.findById(id);
        if (!usuario) {
            throw new HttpError(404, 'Usuário não encontrado');
        }

        if (usuario.excluido) {
            throw new HttpError(404, 'Usuário já excluído');
        }

        await db.transaction(async (trx) => {
            await UsuariosRepo.deleteById(id, trx);
            await ServicoBarbeiroRepo.removeRelationByBarber(id, trx);
        });
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

};