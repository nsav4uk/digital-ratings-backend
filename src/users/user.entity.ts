import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export interface UserInterface {
  id: number;
  username: string;
  email: string;
  password?: string;
  isActive: boolean;
}

@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
