import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   ManyToOne,
   JoinColumn,
   Index,
   ManyToMany,
   JoinTable,
   CreateDateColumn,
   UpdateDateColumn

} from 'typeorm';
import { User } from './User';
import { Category } from './Category'; 
import { Tag } from './Tag';


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

   @ManyToMany(() => Tag, tag => tag.tasks)

   @JoinTable()
   tags!: Tag[];


   @CreateDateColumn()
   createdAt!: Date;


   @UpdateDateColumn()
   updatedAt!: Date;

   //  Virtual Getter Method
    get isOverdue(): boolean {
        // If there is no due date, or the task is completed, it's not overdue
        if (!this.dueDate || this.status === 'completed') {
            return false;
        }

        const today = new Date();
        // Reset time to midnight comparing strict dates
        today.setHours(0, 0, 0, 0); 
        
        const due = new Date(this.dueDate);
        
        return due < today;
    }

    // Override toJSON to expose the getter to Express
    toJSON() {
        return {
            ...this,
            isOverdue: this.isOverdue // Manually append the evaluated getter
        };
    }
}
