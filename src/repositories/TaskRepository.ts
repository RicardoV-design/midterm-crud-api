import { Repository } from 'typeorm';
import { Task } from '../entities/Task';
import { AppDataSource } from '../config/data-source';

export class TaskRepository extends Repository<Task> {
    constructor () {
        // Explicitly initialize the base Repository with the Task entity and current entity manager
        super(Task, AppDataSource.createEntityManager());
    }

    async findOverdueTasks () {
        // Format YYYY-MM-DD matching dueDate
        const today = new Date().toISOString().split('T')[0];

        return this.createQueryBuilder('task')
        .where('task.dueDate < :today', { today })
        .andWhere('task.status != :status', { status: 'completed' })
        .andWhere('task.isDeleted = :isDeleted', { isDeleted: false}) // For soft isDeleted
        .getMany();

    }
}
// Export a single instance used across controllers
export const customTaskRepository = new TaskRepository();
