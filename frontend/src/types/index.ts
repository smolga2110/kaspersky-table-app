export interface User{
    id: string,
    name: string,
    login: string,
    email: string,
    group: string,
    phone: string
}

export interface ApiResponse{
    success: boolean,
    data: {
        users: User[]
    }
}