import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   ManyToMany,
   CreateDateColumn,
   UpdateDateColumn

} from 'typeorm';
import { Task } from './Task';

@Entity ()
export class Tag {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column ({ type: 'varchar', unique: true, length: 100 })
    name!: string; 

    @ManyToMany(() => Task, task => task.tags)
    tasks!: Task[];

    @CreateDateColumn()
   createdAt!: Date;

    @UpdateDateColumn()
   updatedAt!: Date;
}