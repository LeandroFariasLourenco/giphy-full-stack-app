import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
}