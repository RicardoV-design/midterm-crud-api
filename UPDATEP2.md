Added Phase 2: Core Modifcations & New Features (8-22)
1. Add a New Column for phoneNumber (Migration) - DONE
2. Update phoneNumber Validation (optional but if given, need to follow format) - DONE
3. Update Task Creation (accepting category and accepting to task) - DONE
4. Change Cascade Behavior (User-Task Relationship, task not deleted along if will delete User, setting it to Null) - DONE
5. Implement Filtering (filters status and priority task under a user) - DONE
6. Implement Aggregation (Stats, optimize count for tasks for a user) - DONE
7. Implement Soft Delete (with Tasks) - DONE 
8. Add Pagination (setting pages and limits) - DONE
9. Add Sorting (sortBy and order for tasks) - DONE
10. Implement Password Hashing (for new users) - DONE 
11. Add a Login Endpoint (testing a login using email and password) - DONE
12. Implement Request Logging Middleware (adding logs on every request) - DONE
13. Create a Database Seeder (add 5 users and 15 tasks as dummy) - DONE
14. Refactor to DTOs (creating interfaces for CreateUserDto, UpdateUserDto, and CreateTaskDto then applied on respective controllers) - DONE