module.exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable('usuarios');
  if (!hasTable) return;

  const hasColumn = await knex.schema.hasColumn('usuarios', 'idBarbearia');
  if (!hasColumn) {
    await knex.schema.alterTable('usuarios', (table) => {
      table
        .integer('idBarbearia')
        .unsigned()
        .nullable()
        .references('idBarbearia')
        .inTable('barbearia')
        .onDelete('SET NULL');
      table.index(['idBarbearia'], 'idx_usuario_idBarbearia');
    });
  }

  if (!hasUpdated) {
    await knex.schema.alterTable('usuarios', (table) => {
      table.timestamp('data_atualizacao').nullable().defaultTo(knex.fn.now());
    });
  }
};

module.exports.down = async function (knex) {
  const hasTable = await knex.schema.hasTable('usuarios');
  if (!hasTable) return;

  const hasColumn = await knex.schema.hasColumn('usuarios', 'idBarbearia');
  if (hasColumn) {
    await knex.schema.alterTable('usuarios', (table) => {
      table.dropIndex(['idBarbearia'], 'idx_usuario_idBarbearia');
      table.dropColumn('idBarbearia');
    });
  }
};