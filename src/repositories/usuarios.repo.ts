import type { Usuario } from '../models/usuario';
import db from '../database/knex';
import type { Knex } from 'knex';

export const UsuariosRepo = {
    async findAll(): Promise<Usuario[]> {
        return db<Usuario>('users').select('*').where({ excluido: false });
    },

    async findById(id: number) {
        return db<Usuario>('users').where({ id, excluido: false }).first();
    },

    async create(payload: Partial<Usuario>) {
        const [row] = await db<Usuario>('users').insert(payload).returning('*');
        return row;
    },

    async update(id: number, payload: Partial<Usuario>) {
        const [row] = await db<Usuario>('users').where({ id, excluido: false }).update(payload).returning('*');
        return row;
    },

    async deleteById(id: number, trx?: Knex.Transaction) {
        const q = trx ?? db;
        return q('users')
            .where({ id })
            .update({
            excluido: true
        });
    },

    async findByEmail(email: string) {
        return db<Usuario>('users').where({ email, excluido: false }).first();
    },

    // --- métodos simplificados sem bcrypt ---
    // compara strings (apenas para desenvolvimento temporário)
    async comparePasswords(plainPassword: string, storedPassword: string): Promise<boolean> {
        // WARNING: comparação em texto plano. Trocar por bcrypt/hash depois.
        return plainPassword === storedPassword;
    },

    // atualiza a senha diretamente (texto plano)
    async updatePassword(id: number, newPassword: string): Promise<void> {
        await db<Usuario>('users').where({ id }).update({ password: newPassword });
    },

    async findBarbeirosByBarbearia(idBarbearia: number): Promise<Usuario[]> {
        return db<Usuario>('users').where({ idBarbearia, excluido: false });
    }
};