import { UsuariosRepo } from '../repositories/usuarios.repo';

export const UsuariosService = {

    async findAll() { 
        return UsuariosRepo.findAll(); 
    },

    async create(payload: any) {
        // validações simples aqui
        if (!payload.email) {
            throw new Error('email obrigatório');
        }
            return UsuariosRepo.create(payload);
    },

    async update(id: number, payload: any) {
        // validações simples aqui
        if (!payload.email) {
            throw new Error('email obrigatório');
        }

        return UsuariosRepo.update(id, payload);
    },

    async findById(idUsuario: number) {
        return UsuariosRepo.findById(idUsuario);
    }


};