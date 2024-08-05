import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const dbConnection = new DataSource({
  type: 'mysql',
  host: process.env.db_host,
  port: Number(process.env.db_port),
  username: process.env.db_user,
  password: process.env.db_password,
  database: process.env.database,
  entities: [join(__dirname, '/entities/', '**{.ts,.js}')],
  synchronize: false,
  logging: process.env.orm_logging
    ? JSON.parse(process.env.orm_logging)
    : false,
  migrations: [join(__dirname, '/migrations/', '**/*{.ts,.js}')],
  timezone: 'Z',
  extra: {
    connectionLimit: 60,
  },
});
