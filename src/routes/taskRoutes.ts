import { Router } from 'express';
import { TaskController } from '../controllers/taskController';


export const taskRoutes = Router();

// Overdue tasks
taskRoutes.get('/tasks/overdue', TaskController.getOverdue);

// Nested routes under users
taskRoutes.get('/users/:userId/tasks', TaskController.getUserTasks);
taskRoutes.get('/users/:userId/stats', TaskController.getUserStats);
taskRoutes.post('/users/:userId/tasks', TaskController.createTask);


// Direct task routes
taskRoutes.delete('/tasks/:id', TaskController.deleteTask);
