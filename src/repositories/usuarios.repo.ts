import type { Usuario } from '../models/usuario';
import db from '../database/knex';

export const UsuariosRepo = {
  async findAll(): Promise<Usuario[]> {
    return db<Usuario>('usuarios').select('*');
  },
  async findById(id: number) {
    return db<Usuario>('usuarios').where({ id }).first();
  },
  async create(payload: Partial<Usuario>) {
    const [row] = await db<Usuario>('usuarios').insert(payload).returning('*');
    return row;
  }
};