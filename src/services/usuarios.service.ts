import { UsuariosRepo } from '../repositories/usuarios.repo';

export const UsuariosService = {
  async listar() { return UsuariosRepo.findAll(); },
  async criar(payload: any) {
    // validações simples aqui
    if (!payload.email) throw new Error('email obrigatório');
    return UsuariosRepo.create(payload);
  }
};