import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Category } from '../entities/Category';

const categoryRepository = AppDataSource.getRepository(Category);

export class CategoryController {
    //CREATE /api/categories - Create a new category
    static async createCategory(req: Request, res: Response) {
        try {
            const { name } = req.body;
            if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

            const category = categoryRepository.create({ name });
            const savedCategory = await categoryRepository.save(category);
            
            res.status(201).json({ success: true, data: savedCategory });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to create category' });
        }
    }

// GET /api/categories - Retrieve all categories
    static async getAll(req: Request, res: Response) {
        try {
            // Fetches all records from the categories table
            const categories = await categoryRepository.find();
            
            return res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            return res.status(500).json({
                success: false,
                error: { 
                    code: 'INTERNAL_ERROR', 
                    message: 'Failed to retrieve categories' 
                }
            });
        }
    }
}