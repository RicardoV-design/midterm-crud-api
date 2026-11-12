export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    isActive?: boolean;
}


export interface CreateUserWithTaskDto {
    name: string; 
    email: string; 
    password: string; 
    phoneNumber?: string; 

    taskTitle: string; 
    taskDescription: string; 
    taskStatus: 'pending' | 'in-progress' | 'completed';
    taskPriority: 'low' | 'medium' | 'high';
    taskDueDate: string; 
    categoryId?: number;
}