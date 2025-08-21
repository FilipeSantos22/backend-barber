require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME ?? 'app-barber',
      user: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASS ?? '1234'
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
      extension: 'cjs',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
      extension: 'js'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
      extension: 'js',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
      extension: 'js'
    },
    pool: { min: 2, max: 10 }
  }
};