import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   CreateDateColumn,
   UpdateDateColumn,
   ManyToOne,
   JoinColumn,
   Index
} from 'typeorm';
import { User } from './User';
import { Category } from './Category'; 


@Entity('tasks')
@Index(['userId'])
export class Task {
   @PrimaryGeneratedColumn()
   id!: number;


   @Column({ type: 'varchar', length: 200 })
   title!: string;


   @Column({ type: 'text', nullable: true })
   description!: string | null;


   @Column({
       type: 'enum',
       enum: ['pending', 'in-progress', 'completed'],
       default: 'pending'
   })
   status!: 'pending' | 'in-progress' | 'completed';


   @Column({
       type: 'enum',
       enum: ['low', 'medium', 'high'],
       default: 'medium'
   })
   priority!: 'low' | 'medium' | 'high';


   @Column({ type: 'date', nullable: true })
   dueDate!: Date | null;

   // Many tasks can be assigned on a user 
   @ManyToOne(() => User, user => user.tasks, { onDelete: 'SET NULL' })
   @JoinColumn({ name: 'userId' })
   user!: User | null;

   // Task has categories
   @ManyToOne(() => Category, category => category.tasks, {onDelete: 'SET NULL'})
   @JoinColumn({ name: 'categoryId'})
   category!: Category | null;

   @Column({ type: 'int', nullable: true })
   categoryId!: number | null;

   @Column({ type: 'int', nullable: true })
   userId!: number | null;

   // Soft Delete
   @Column({ type: 'boolean', default: false})
   isDeleted!: boolean;


   @CreateDateColumn()
   createdAt!: Date;


   @UpdateDateColumn()
   updatedAt!: Date;
}
