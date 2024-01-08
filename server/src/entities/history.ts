import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity({ name: 'history' })
export class History {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  term: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}