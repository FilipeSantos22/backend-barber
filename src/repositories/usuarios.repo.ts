import type { Usuario } from '../models/usuario';
import db from '../database/knex';

export const UsuariosRepo = {
    async findAll(): Promise<Usuario[]> {
        return db<Usuario>('usuarios').select('*').where({ excluido: false });
    },

    async findById(idUsuario: number) {
        return db<Usuario>('usuarios').where({ idUsuario, excluido: false }).first();
    },

    async create(payload: Partial<Usuario>) {
        const [row] = await db<Usuario>('usuarios').insert(payload).returning('*');
        return row;
    },

    async update(idUsuario: number, payload: Partial<Usuario>) {
        const [row] = await db<Usuario>('usuarios').where({ idUsuario, excluido: false }).update(payload).returning('*');
        return row;
    },

    async deleteById(idUsuario: number) {
        const row = await db<Usuario>('usuarios').where({ idUsuario, excluido: false }).update({ excluido: true });
        return row;
    },

    async findByEmail(email: string) {
        return db<Usuario>('usuarios').where({ email, excluido: false }).first();
    },

    // --- métodos simplificados sem bcrypt ---
    // compara strings (apenas para desenvolvimento temporário)
    async comparePasswords(plainPassword: string, storedPassword: string): Promise<boolean> {
        // WARNING: comparação em texto plano. Trocar por bcrypt/hash depois.
        return plainPassword === storedPassword;
    },

    // atualiza a senha diretamente (texto plano)
    async updatePassword(idUsuario: number, newPassword: string): Promise<void> {
        await db<Usuario>('usuarios').where({ idUsuario }).update({ senha: newPassword });
    }
};