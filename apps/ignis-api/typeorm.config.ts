/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DatabaseType } from 'typeorm';

const options: any = {
  type: (process.env.DATABASE_TYPE || 'mysql') as DatabaseType,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  password: process.env.DATABASE_PASSWORD || 'secret',
  username: process.env.DATABASE_USERNAME || 'user',
  database: process.env.DATABASE_NAME || 'test',
  logging: process.env.DATABASE_LOGGING === 'true',
  entities: ['apps/**/*.entity{.ts,.js}'],
  migrations: ['migrations/schemas/*{.ts,.js}'],

  seeds: ['migrations/seeds/**/*{.ts,.js}'],
  factories: ['migrations/factories/**/*{.ts,.js}'],
};

export default new DataSource(options);
