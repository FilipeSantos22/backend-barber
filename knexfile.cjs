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
      directory: path.resolve(__dirname, 'migrations'),
      extension: 'js',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'seeds'),
      extension: 'js'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME ?? 'my_db',
      user: process.env.DB_USER ?? 'username',
      password: process.env.DB_PASS ?? 'password'
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
      extension: 'js',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'seeds'),
      extension: 'js'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
      extension: 'js',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'seeds'),
      extension: 'js'
    }
  }
};