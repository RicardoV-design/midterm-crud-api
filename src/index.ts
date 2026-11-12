import 'reflect-metadata';  // MUST be first import!
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/data-source';
import { userRoutes } from './routes/userRoutes';
import { taskRoutes } from './routes/taskRoutes';
import { categoryRoutes } from './routes/categoryRoutes';
import { authRoutes } from './routes/authRoutes';
import { requestLogger } from './middleware/requestLogger';
import * as dotenv from 'dotenv';


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);


// Health check endpoint
app.get('/health', (req, res) => {
   res.json({
       success: true,
       message: 'API is running',
       timestamp: new Date().toISOString()
   });
});


// V1 Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', taskRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/auth', authRoutes);

// Deprecated V0 Routes (410 Gone)

app.use('/api', (req, res, next) => {
    if (req.path.startsWith('/v1')) {
        return next();
    }

    // 410 handler, deprecated V0 old /api/ endpoint
    res.status(410).json({
        success: false,
        error: {
            code: 'GONE',
            message: 'This endpoint has moved. Please use the /api/v1/ prefix (e.g., /api/v1/users).'
        }
    });
});

// 404 handler
app.use((req, res) => {
   res.status(404).json({
       success: false,
       error: {
           code: 'ROUTE_NOT_FOUND',
           message: `Route ${req.method} ${req.url} not found`
       }
   });
});


// Initialize database connection
AppDataSource.initialize()
   .then(() => {
       console.log('✅ Database connected successfully!');
      
       // Server running
       const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
       });
      
    // Graceful Shutdown
       const gracefulShutdown = async (signal: string) => {
           console.log(`\n${signal} received. Initiating graceful shutdown...`);

           // Stop accepting new requests
           server.close(async (err) => {
               if (err) {
                   console.error('Error closing Express server:', err);
                   process.exit(1);
               }
               console.log('Express server safely closed.');

               // Close the database connection
               try {
                   if (AppDataSource.isInitialized) {
                       await AppDataSource.destroy();
                       console.log('TypeORM database connection safely destroyed.');
                   }
                   
                   console.log('Graceful shutdown complete. Goodbye!');
                   process.exit(0); // Exit cleanly
               } catch (dbError) {
                   console.error('Error during database disconnection:', dbError);
                   process.exit(1); // Exit with error
               }
           });
       };

       // Listen for system termination signals
       process.on('SIGINT', () => gracefulShutdown('SIGINT'));
       process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
   })
   .catch((error) => {
       console.error('❌ Database connection failed:', error);
   });
