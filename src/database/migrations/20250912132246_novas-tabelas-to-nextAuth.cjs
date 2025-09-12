exports.up = async function(knex) {
  // Adiciona colunas que faltam na tabela usuarios
  const hasEmailVerificado = await knex.schema.hasColumn('usuarios', 'emailVerificado');
  if (!hasEmailVerificado) {
    await knex.schema.alterTable('usuarios', table => {
        table.timestamp('emailVerificado').nullable();
    });
  }
  const hasImage = await knex.schema.hasColumn('usuarios', 'image');
  if (!hasImage) {
    await knex.schema.alterTable('usuarios', table => {
      table.string('image', 2048).nullable();
    });
  }

  // Tabela accounts
  await knex.schema.createTable('accounts', table => {
    table.integer('idUsuario').notNullable(); // <-- integer!
    table.string('type').notNullable();
    table.string('provider').notNullable();
    table.string('providerAccountId').notNullable();
    table.string('refresh_token', 2048);
    table.string('access_token', 2048);
    table.integer('expires_at');
    table.string('token_type', 128);
    table.string('scope', 256);
    table.string('id_token', 2048);
    table.string('session_state', 256);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    table.primary(['provider', 'providerAccountId']);
    table.foreign('idUsuario').references('idUsuario').inTable('usuarios').onDelete('CASCADE');
  });

  // Tabela sessions
  await knex.schema.createTable('sessions', table => {
    table.string('sessionToken').primary();
    table.integer('idUsuario').notNullable(); // <-- integer!
    table.timestamp('expires').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    table.foreign('idUsuario').references('idUsuario').inTable('usuarios').onDelete('CASCADE');
  });

  // Tabela verification_tokens
  await knex.schema.createTable('verification_tokens', table => {
    table.string('identifier').notNullable();
    table.string('token').notNullable();
    table.timestamp('expires').notNullable();

    table.primary(['identifier', 'token']);
  });

  // Tabela authenticators (opcional para WebAuthn)
  await knex.schema.createTable('authenticators', table => {
    table.string('credentialID').notNullable().unique();
    table.integer('idUsuario').notNullable(); // <-- integer!
    table.string('providerAccountId').notNullable();
    table.string('credentialPublicKey', 2048).notNullable();
    table.integer('counter').notNullable();
    table.string('credentialDeviceType', 128).notNullable();
    table.boolean('credentialBackedUp').notNullable();
    table.string('transports', 256);

    table.primary(['idUsuario', 'credentialID']);
    table.foreign('idUsuario').references('idUsuario').inTable('usuarios').onDelete('CASCADE');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('authenticators');
  await knex.schema.dropTableIfExists('verification_tokens');
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('accounts');

  // Remover colunas adicionadas em usuarios
  const colunas = ['emailVerificado', 'image'];
  for (const coluna of colunas) {
    const hasCol = await knex.schema.hasColumn('usuarios', coluna);
    if (hasCol) {
      await knex.schema.alterTable('usuarios', table => {
        table.dropColumn(coluna);
      });
    }
  }
};
