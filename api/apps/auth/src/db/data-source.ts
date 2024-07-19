import { UserEntity } from '@app/shared';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URI,
  entities: [UserEntity],
  migrations: ['dist/apps/auth/db/migrations/*.js'],
};

/**
 * Typeorm Data source Options
 */
export const dataSource = new DataSource(dataSourceOptions);
