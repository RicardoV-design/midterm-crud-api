import {
    Entity,
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,

} from 'typeorm';
import { Task } from './Task';

@Entity('categories')
export class Category {

    @PrimaryGeneratedColumn()
    id!: number; 

    @Column ({ type: 'varchar', length: 100, unique: true})
    name!: string;

    @OneToMany (() => Task, task => task.category)
    tasks!: Task[];

    @CreateDateColumn()
    createdAt!: Date; 

    @UpdateDateColumn()
    updatedAt!: Date; 
}