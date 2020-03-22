import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  TEACHER = 'teacher',
  PUPIL = 'pupil',
}

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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PUPIL,
  })
  role: UserRole;
}
