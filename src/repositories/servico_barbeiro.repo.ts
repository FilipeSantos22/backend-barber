import type { Knex } from 'knex';
import db from '../database/knex';
import type { Servico } from '../models/servico';

export const ServicoBarbeiroRepo = {

    async findByBarbeiroId(idBarbeiro: number): Promise<Servico[]> {
        return db('servico_barbeiro')
            .join('servico', 'servico.idServico', 'servico_barbeiro.idServico')
            .where('servico_barbeiro.idBarbeiro', idBarbeiro)
            .andWhere('servico.excluido', false)
            .select('servico.*');
    },

    async findByServicoId(idServico: number): Promise<any[]> {
        return db('servico_barbeiro').where({ idServico }).select('*');
    },

    async addRelation(idServico: number, idBarbeiro: number) {
        return db('servico_barbeiro').insert({
            idServico,
            idBarbeiro,
            data_criacao: db.fn.now()
        });
    },

    async removeRelationByBarber(idBarbeiro: number, trx?: Knex.Transaction) {
        const q = trx ?? db;
        return q('servico_barbeiro').where({ idBarbeiro }).update({ excluido: true });
    },

    async removeRelationByServico(idServico: number, trx?: Knex.Transaction) {
        const q = trx ?? db;
        return q('servico_barbeiro').where({ idServico }).update({ excluido: true });
    },

    async findAll(): Promise<any[]> {
        return db('servico_barbeiro').select('*').where({ excluido: false });
    },

};