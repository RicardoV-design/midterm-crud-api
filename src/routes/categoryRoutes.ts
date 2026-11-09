import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';

const router = Router();

router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getAll);

export const categoryRoutes = router;