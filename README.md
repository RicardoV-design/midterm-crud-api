- Project description
- Setup instructions
- How to run the application
- API endpoints documentation
(Those are included on the Google Docs documentation of Activity 7.)

Reflection Questions and Answers:
1. What was the most challenging part of building this API?

- The most challenging part of building this API is with mapping down from the server, error handling, routing, controllers and database. 

2. How does TypeORM make database operations easier compared to raw SQL?

- The TypeORM is much easier then raw SQL as it's type safety with autocomplete, follos object-oriented querying and simplified relations using join. 

3. Why is it important to exclude the password field from API responses? How did you implement this?
- That's for security and privacy. It's to make sure that password will be free from any attacks and not exposed. 
- Under TypeORM, used this:  
    @Column({ type: 'varchar', length: 255, select: false })
    password!: string;

- Under UserControllers for creating and updating a user.  
    const { password: removedPassword, ...userWithoutPassword } = savedUser

4. Describe a scenario where you would need to use database transactions instead of individual operations.

- What directly comes into my mind is with the E-commerce systems. For example, booking a room like in Agooda App or flights because there will be an addition of entity, updates on status and with the payment receipts/tracking. 

5. What is the difference between `synchronize: true` and migrations? When should you use each?

- The synchronize: true is automatic wherein anything done on your code will reflect dirctly on the database while migrations, are manual, step-by-step blueprints considered as a version history. 

6. If you had to add a `Product` entity with a relationship to `User` (a user can have many products), how would you modify the code?

- For this will have to add Product.ts file under src/entities. Import from User Entity and added ManyToOne for user.products. This will be content. 
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne // Added this one for import
} from 'typeorm';
import { User } from './User';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 150 })
    name!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    // Establishes the Many-to-One relationship with User
    @ManyToOne(() => User, user => user.products, { onDelete: 'CASCADE' })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}  
- Then update the User.ts for User Entity to this. 
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    OneToMany // Added this one for import
} from 'typeorm';
import { Product } from './Product'; // Added this for import as well

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', unique: true, length: 100 })
    email!: string;

    @Column({ type: 'varchar', length: 255, select: false })
    password!: string;

    @Column({ type: 'boolean', default: true })
    isActive!: boolean;

    // Add the One-to-Many relationship here
    @OneToMany(() => Product, product => product.user)
    products!: Product[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

- And update the data-source.ts adding 
import { Product } from '../entities/Product'; // Import the new entity  
entities: [User, Product], 

7. What security improvements would you make before deploying this API to production? (Hint: password hashing, rate limiting, authentication, etc.)

- Implement stateless auth using JSON Web Tokens (JWT) or secure, HTTP-only session cookies to verify user identity. 
