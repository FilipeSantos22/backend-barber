import type { Usuario } from '../models/usuario';
import db from '../database/knex';

export const UsuariosRepo = {
    async findAll(): Promise<Usuario[]> {
        return db<Usuario>('usuarios').select('*');
    },

    async findById(idUsuario: number) {
        return db<Usuario>('usuarios').where({ idUsuario }).first();
    },
    async create(payload: Partial<Usuario>) {
        const [row] = await db<Usuario>('usuarios').insert(payload).returning('*');
        return row;
    },

    async update(idUsuario: number, payload: Partial<Usuario>) {
        const [row] = await db<Usuario>('usuarios').where({ idUsuario }).update(payload).returning('*');
        return row;
    },

    async deleteById(idUsuario: number) {
        const [row] = await db<Usuario>('usuarios').where({ idUsuario }).delete().returning('*'); 
        return row;
    },

    async findByEmail(email: string) {
        return db<Usuario>('usuarios').where({ email }).first();
    }

};