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
