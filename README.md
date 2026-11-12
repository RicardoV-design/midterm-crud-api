# Task Management RESTful API

A full-stack RESTful API built with Node.js, Express, TypeScript, TypeORM, and MySQL. This API features strict data validation, advanced querying, secure authentication, and environment-specific configurations.

## Database Schema & Relationships

The database schema is strictly managed through TypeORM migrations. 

### Entities & Updates
*   **User**: 
    *   *Updates*: Added `phoneNumber` (varchar, 20 chars, nullable) via migration. Passwords are securely hashed using `bcrypt` (Implement Password Hashing).
    *   *Relations*: One-to-Many with `Task`.
*   **Category (New Entity)**: 
    *   *Description*: Categorization group for tasks (e.g., 'Work', 'Personal').
    *   *Relations*: One-to-Many with `Task`.
*   **Tag (New Entity)**: 
    *   *Description*: Labels assigned to tasks (Add a Many-to-Many Relationship).
    *   *Relations*: Many-to-Many with `Task`.
*   **Task**: 
    *   *Updates*: 
        *   Added `isDeleted` boolean flag to filter queries instead of permanent removal (Implement Soft Delete).
        *   Added `isOverdue()` virtual/computed property dynamically calculated based on `dueDate` and `status`, exposed in JSON responses.
    *   *Relations*: 
        *   Many-to-One with `User` (Change Cascade Behavior: `ON DELETE SET NULL`).
        *   Many-to-One with `Category` (Change Cascade Behavior: `ON DELETE SET NULL`).
        *   Many-to-Many with `Tag` (maps through the new `task_tags_tag` junction table).

---

## API Endpoints

**API Versioning:** All routes have been moved under the `/api/v1/` prefix. Legacy `/api/` paths are caught by a middleware that returns a `410 Gone` status code. All request payloads are strictly typed using DTOs (Refactor to DTOs).

### Authentication & Users
*   **POST** `/api/v1/auth/login` (Add a Login Endpoint)
    *   Verifies email and password credentials against stored bcrypt hashes.
*   **POST** `/api/v1/users` (Update Validation)
    *   Creates a new user. Enforces strict Regex validation for the new optional `phoneNumber` field.
*   **POST** `/api/v1/users/with-initial-task` (Implement Transactions)
    *   Creates a user and an initial task simultaneously using `AppDataSource.transaction`. Rolls back entirely if either operation fails.
*   **GET** `/api/v1/users/:userId/stats` (Implement Aggregation)
    *   Returns task counts grouped by status (pending, in-progress, completed) for a specific user.

### Tasks
*   **POST** `/api/v1/users/:userId/tasks` (Update Task Creation)
    *   Creates a new task.
    *   *Features*: Accepts `categoryId` and `tags` arrays. Automatically checks for existing tags and creates new ones. Uses Regex to strip basic HTML tags (like `<script>`) from `title` and `description` payloads (Input Sanitization).
*   **GET** `/api/v1/tasks` (Filtering, Pagination, Sorting)
    *   Retrieves tasks with advanced query parameters:
        *   *Filtering*: `?status=completed&priority=high`
        *   *Pagination*: `?page=2&limit=10`
        *   *Sorting*: `?sortBy=dueDate&order=ASC`
*   **GET** `/api/v1/tasks/overdue` (Custom Repository Method)
    *   Utilizes a custom `TaskRepository` with `QueryBuilder` to fetch non-deleted, non-completed tasks with due dates strictly in the past.

---

## Database Seeding

An automated database seeder (`src/seeds/seed.ts`) is included to instantly populate the MySQL database with initial test users, categories, tags, and tasks (Create a Database Seeder).

### How to Run the Seed Script
Ensure your database connection is active and your `.env` variables are configured. Run the following command (requires `tsx`):
```bash
npm run seed
