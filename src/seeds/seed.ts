import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Task } from '../entities/Task';
import bcrypt from 'bcrypt';

async function runSeed() {
    try {
        console.log('Connecting to the database...');
        await AppDataSource.initialize();
        console.log('Database connected successfully!');

        const userRepository = AppDataSource.getRepository(User);
        const taskRepository = AppDataSource.getRepository(Task);

        // Dummy hashing password to all seeders
        const saltRounds = 10;
        const defaultPassword = await bcrypt.hash('password123', saltRounds);

        const users: User[] = [];

        console.log('Inserting 5 dummy users...');
        for (let i = 1; i <= 5; i++) {
            const user = userRepository.create({
                name: `Dummy User ${i}`,
                // Appending Date.now() make sure emails are unique if running seeders multiple times
                email: `dummyuser${i}_${Date.now()}@example.com`,
                password: defaultPassword,
                phoneNumber: `+63912345678${i}`
            });
            const savedUser = await userRepository.save(user);
            users.push(savedUser);
        }

        console.log('Inserting 15 dummy tasks...');
        const statuses: ('pending' | 'in-progress' | 'completed')[] = ['pending', 'in-progress', 'completed'];
        const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

        for (let i = 1; i <= 15; i++) {
            // Distribute the 15 tasks evenly across the 5 users (3 tasks per user)
            const userIndex = (i - 1) % 5; 
            
            const task = taskRepository.create({
                title: `Dummy Task ${i}`,
                description: `This is auto-generated task number ${i}.`,
                status: statuses[i % 3],
                priority: priorities[i % 3],
                user: users[userIndex] 
            });
            await taskRepository.save(task);
        }

        console.log('Seeding completed successfully!');
        process.exit(0); // Exit the script cleanly so your terminal doesn't hang

    } catch (error) {
        console.error('Fatal Error during seeding:', error);
        process.exit(1); 
    }
}

// Execute the function
runSeed();
