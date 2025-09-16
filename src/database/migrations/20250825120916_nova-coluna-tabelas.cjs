
exports.up = async function(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.boolean("excluido").defaultTo(false);
  });

  await knex.schema.alterTable("servico", (table) => {
    table.boolean("excluido").defaultTo(false);
  });

  await knex.schema.alterTable("agendamento", (table) => {
    table.boolean("excluido").defaultTo(false);
  });

  await knex.schema.alterTable("barbearia", (table) => {
    table.boolean("excluido").defaultTo(false);
  });

  await knex.schema.alterTable("servico_barbeiro", (table) => {
    table.boolean("excluido").defaultTo(false);
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("excluido");
  });

  await knex.schema.alterTable("servico", (table) => {
    table.dropColumn("excluido");
  });

  await knex.schema.alterTable("agendamento", (table) => {
    table.dropColumn("excluido");
  });

  await knex.schema.alterTable("barbearia", (table) => {
    table.dropColumn("excluido");
  });

  await knex.schema.alterTable("servico_barbeiro", (table) => {
    table.dropColumn("excluido");
  });
};
