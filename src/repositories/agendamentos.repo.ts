import type { Agendamento } from '../models/agendamento';
import db from '../database/knex';

export const AgendamentosRepo = {
    async findAll(): Promise<Agendamento[]> {
        return db<Agendamento>('agendamento').select('*').where({ excluido: false });
    },

    async findById(id: number): Promise<Agendamento | undefined> {
        return db<Agendamento>('agendamento').where({ idAgendamento: id, excluido: false }).first();
    },

    async findByUsuario(id: number): Promise<Agendamento[]> {
        return db<Agendamento>('agendamento').where({ id: id, excluido: false }).select('*');
    },

    async findByBarbeiro(idBarbeiro: number): Promise<Agendamento[]> {
        return db<Agendamento>('agendamento').where({ idBarbeiro, excluido: false }).select('*');
    },

    async findByBarbearia(idBarbearia: number): Promise<Agendamento[]> {
        return db<Agendamento>('agendamento').where({ idBarbearia, excluido: false }).select('*');
    },

    async create(payload: Partial<Agendamento>): Promise<Agendamento> {
        const [row] = await db<Agendamento>('agendamento').insert(payload).returning('*');
        if (!row) {
            throw new Error('Erro ao criar novo agendamento');
        }
        return row;
    },

    async update(id: number, payload: Partial<Agendamento>): Promise<Agendamento | undefined> {
        const [row] = await db<Agendamento>('agendamento').where({ idAgendamento: id }).update(payload).returning('*');
        return row;
    },

    async deleteById(id: number): Promise<void> {
        await db('agendamento').where({ idAgendamento: id }).update({ excluido: true });
    },

    async listarHorariosDisponiveis({
        idBarbeiro,
        idServico,
        idBarbearia,
        data // formato 'YYYY-MM-DD'
    }: {
        idBarbeiro: number;
        idServico: number;
        idBarbearia: number;
        data: string;
    }): Promise<{ horario: string }[]> {
        const horarios = await db.raw(
            `
            SELECT h::time AS horario
            FROM generate_series(
                (? || ' 08:00')::timestamp,
                (? || ' 19:30')::timestamp,
                interval '30 minutes'
            ) h
            WHERE NOT EXISTS (
                SELECT 1
                FROM agendamento a
                WHERE a."idBarbeiro" = ?
                AND a."idServico" = ?
                AND a."idBarbearia" = ?
                AND a."data_hora"::time = h::time
                AND a."data_hora"::date = ?::date
                AND a."excluido" = false
                AND (a."status" IS NOT NULL AND a."status" <> 'cancelado')
            )
            ORDER BY horario
            `,
            [data, data, idBarbeiro, idServico, idBarbearia, data]
        );
        return horarios.rows;
    }

};