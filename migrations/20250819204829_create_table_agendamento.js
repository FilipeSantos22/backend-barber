/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {

  await knex.schema.createTable('agendamento', function(table) {
    table.increments('idAgendamento').primary();
    table.integer('idUsuario').notNullable().references('idUsuario').inTable('usuarios');
    table.integer('idBarbeiro').notNullable().references('idUsuario').inTable('usuarios');
    table.integer('idServico').notNullable().references('idServico').inTable('servico');
    table.integer('idBarbearia').notNullable().references('idBarbearia').inTable('barbearia');
    table.timestamp('data_hora').notNullable();
    table.text('descricao');
    table.enu('status', ['pendente', 'confirmado', 'cancelado', 'finalizado'], { useNative: true, enumName: 'agendamento_status' });
    table.timestamp('data_criacao').notNullable().defaultTo(knex.fn.now());
    table.timestamp('data_atualizacao').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('agendamento');
  await knex.raw('DROP TYPE IF EXISTS agendamento_status');
};
