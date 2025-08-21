import knex from 'knex';
import dotenv from 'dotenv';
import type { Knex } from 'knex';
dotenv.config();

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? 'app-barber',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? '1234'
  },
  pool: { min: 2, max: 10 },
  // migrations/seeds ficam no knexfile.cjs para o CLI
};

const db = knex(config);

export default db;