import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

export class AuthController {
    // POST /api/auth/login - Authenticate a user
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'MISSING_FIELDS',
                        message: 'Email and password are required'
                    }
                });
            }

            // Find the user by email
            const user = await userRepository.findOne({ 
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true, // Fixes the bcrypt crash
                    phoneNumber: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid email or password'
                    }
                });
            }

            // Compare the provided password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid email or password'
                    }
                });
            }

            // Remove the password before sending the response
            const { password: removedPassword, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: userWithoutPassword
            });
            
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Failed to authenticate user'
                }
            });
        }
    }
}
