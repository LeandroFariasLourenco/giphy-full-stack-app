import { DataSource } from 'typeorm';
import "reflect-metadata"
import { History, User } from '../../entities';

export const database = new DataSource({
  type: 'sqlite',
  database: './database.sqlite',
  synchronize: true,
  entities: [User, History],
});
