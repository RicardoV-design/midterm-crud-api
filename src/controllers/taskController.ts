import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Task } from '../entities/Task';
import { Category } from '../entities/Category';
import { Tag } from '../entities/Tag';
import { CreateTaskDto } from '../dto/task.dto';
import { customTaskRepository } from '../repositories/TaskRepository';

const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);
const categoryRepository = AppDataSource.getRepository(Category);
const tagRepository = AppDataSource.getRepository(Tag);


export class TaskController {
   // GET /api/users/:userId/tasks - Get all tasks for a user
   static async getUserTasks(req: Request<{ userId: string }>, res: Response) {
       try {
           const userId = parseInt(req.params.userId);
          
           if (isNaN(userId)) {
               return res.status(400).json({
                   success: false,
                   error: { code: 'INVALID_ID', message: 'User ID must be a number' }
               });
           }


           const user = await userRepository.findOne({ where: { id: userId } });
           if (!user) {
               return res.status(404).json({
                   success: false,
                   error: { code: 'USER_NOT_FOUND', message: 'User not found' }
               });
           }
           
            // Filtering + Soft Delete + Pagination + Sorting
            // Extract the filter values from the request URL query
            const { status, priority, page, limit, sortBy, order } = req.query;

            // Parse pagination values
            const pageNumber = parseInt(page as string) || 1;
            const limitNumber = parseInt(limit as string) || 10;

            // SQL Offset (how many rows to skip)
            const skip = (pageNumber - 1) * limitNumber;

            // Dynamic sorting
            const sortColumn = (sortBy as string) || 'createdAt';
            let sortOrder: 'ASC' | 'DESC' = 'DESC';

            if (order && (order as string).toUpperCase() === 'ASC') {
                sortOrder = 'ASC';
            }

            // Build the dynamic clause for required userId
            const whereClause: any = { userId, isDeleted: false };

            // Append filters if they exist in the URL
            if (status) {
                whereClause.status = status;
            }
            if (priority) {
                whereClause.priority = priority;
            }

            // findAndCount using skip (offset) and take (limit)
            const [tasks, total] = await taskRepository.findAndCount({
               where: whereClause,
               order: { [sortColumn]: sortOrder },
               skip: skip,
               take: limitNumber
            });

            //Total pages
            const totalPages = Math.ceil(total / limitNumber);


           res.json({
                success: true,
                data: tasks,
                meta: {
                    total: total,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: totalPages,
                    sortBy: sortColumn,
                    order:sortOrder
                }
            });

       } catch (error) {
           console.error('Error fetching tasks:', error);
           res.status(500).json({
               success: false,
               error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch tasks' }
           });
       }
   }

   // GET /api/users/:userId/stats - Get task statistics for a user
    static async getUserStats(req: Request<{ userId: string }>, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
           
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_ID', message: 'User ID must be a number' }
                });
            }

            // Verify user exists
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'USER_NOT_FOUND', message: 'User not found' }
                });
            }

            // Execute optimized COUNT queries
            const totalTasks = await taskRepository.count({ where: { userId, isDeleted: false } });
            const completedTasks = await taskRepository.count({ where: { userId, status: 'completed', isDeleted: false } });
            const pendingTasks = await taskRepository.count({ where: { userId, status: 'pending', isDeleted: false } });

            res.status(200).json({
                success: true,
                data: {
                    totalTasks,
                    completedTasks,
                    pendingTasks
                }
            });

        } catch (error) {
            console.error('Error fetching user stats:', error);
            res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch user stats' }
            });
        }
    }

    // GET /api/tasks/overdue - Get all overdue tasks across all users
    static async getOverdue (req: Request, res: Response) {
        try {
            // calling new custom Repository
            const overdueTasks = await customTaskRepository.findOverdueTasks ();

            res.status(200).json ({
                success: true, 
                count: overdueTasks.length,
                data:overdueTasks
            }); 

        } catch (error) {
            console.error('Error fetching overdue tasks:', error);
            res.status(500).json ({
                success: false, 
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to fetch overdue tasks'
                }
            });
        }
    }

   // POST /api/users/:userId/tasks - Create a task for a user
   static async createTask(req: Request<{ userId: string }, any, CreateTaskDto>, res: Response) {
       try {
           const userId = parseInt(req.params.userId);
           const { title, description, status, priority, dueDate, categoryId, tags } = req.body;


           if (isNaN(userId)) {
               return res.status(400).json({
                   success: false,
                   error: { code: 'INVALID_ID', message: 'User ID must be a number' }
               });
           }

           // HTML sanitization function, regex looks between <> then removes it
           const sanitize = (input: string | undefined) => {
            if (!input) return input;
            return input.replace(/<[^>]*>?/gm, '');
           };

           // Clean the inputs before validating and save
           const sanitizedTitle = sanitize(title) as string; 
           const sanitizedDescription = sanitize(description);

           // Verify user exists
           const user = await userRepository.findOne({ where: { id: userId } });
           if (!user) {
               return res.status(404).json({
                   success: false,
                   error: { code: 'USER_NOT_FOUND', message: 'User not found' }
               });
           }


           // Validate enum values
           if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
               return res.status(400).json({
                   success: false,
                   error: { code: 'INVALID_STATUS', message: 'Invalid status value' }
               });
           }


           if (priority && !['low', 'medium', 'high'].includes(priority)) {
               return res.status(400).json({
                   success: false,
                   error: { code: 'INVALID_PRIORITY', message: 'Invalid priority value' }
               });
           }

           // Verify category exists if a categoryId was provided
           if (categoryId) {
            const category = await categoryRepository.findOne({ where: { id: categoryId } });
            if (!category) {
                return res.status(404).json ({
                    success: false,
                    error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found' }
                });
            }
           }

           // Tag logic
           let taskTags: Tag[] = [];
           if(tags && Array.isArray(tags)) {
            for (const tagName of tags) {

                // Checking if tags already exists 
                let tag = await tagRepository.findOne({ where: { name: tagName } });
                    if (!tag) {
                        // Create and save new tag if it doesn't exist
                        tag = tagRepository.create({ name: tagName });
                        tag = await tagRepository.save(tag);
                    }
                    taskTags.push(tag);
                }
            }

           const task = taskRepository.create({
               title: sanitizedTitle,
               description: sanitizedDescription,
               status,
               priority,
               dueDate,
               user,
               categoryId: categoryId || null,
               tags: taskTags 
           });


           const savedTask = await taskRepository.save(task);


           res.status(201).json({
               success: true,
               message: 'Task created successfully',
               data: savedTask
           });
       } catch (error) {
           console.error('Error creating task:', error);
           res.status(500).json({
               success: false,
               error: { code: 'INTERNAL_ERROR', message: 'Failed to create task' }
           });
       }
   }


   // DELETE /api/tasks/:id - Delete a task
   static async deleteTask(req: Request<{ id: string }>, res: Response) {
       try {
           const id = parseInt(req.params.id);
          
           if (isNaN(id)) {
               return res.status(400).json({
                   success: false,
                   error: { code: 'INVALID_ID', message: 'Task ID must be a number' }
               });
           }


           const task = await taskRepository.findOne({ where: { id } });
           if (!task || task.isDeleted) { // Added isDeleted to return 404 if soft-deleted
               return res.status(404).json({
                   success: false,
                   error: { code: 'TASK_NOT_FOUND', message: 'Task not found' }
               });
           }


            task.isDeleted = true;
            await taskRepository.save(task);


           res.json({
               success: true,
               message: 'Task deleted successfully'
           });
       } catch (error) {
           console.error('Error deleting task:', error);
           res.status(500).json({
               success: false,
               error: { code: 'INTERNAL_ERROR', message: 'Failed to delete task' }
           });
       }
   }
}
