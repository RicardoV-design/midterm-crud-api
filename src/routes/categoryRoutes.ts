import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';

export const categoryRoutes = Router();

categoryRoutes.post('/', CategoryController.createCategory);
categoryRoutes.get('/', CategoryController.getAll);
