Added Phase 3: Advanced Scenarios & Architecture, Final Polish & Documentation (23 - 30)
23. Implement Transactions (creating new endpoint POST /api/users/with-initial-task for User and Task so if Task fails, will just roll back) - DONE
24. Custom Repository Method (for task and adding method to get all overdue tasks) - DONE
25. Environment-Specific Config (modified synchronize to false and logging to production) - DONE
26. Input Sanitization (cleaning HTML tags <> for creating tasks on title and description) - DONE
27. Add a Many-to-Many Relationship (creating Tag entity and linking to Tasks, ManyToMany) - DONE
28. Add Virtual/Computed Properties (adding isOverdue on Task Entity making sure to reflect on JSON response) - DONE
29. Graceful Shutdown (updating src/index.ts to listen for SIGINT and SIGTERM signals closing Express Server) - DONE
30. API Versioning (moving all routes to API V1 vesion) - DONE
31. Update Documentation (updating README.md) - DONE
32. Final Verification (testing) - DONE