export interface User{
    id: string,
    name: string,
    login: string,
    email: string,
    group: string,
    phone: string
}

export interface ApiResponse<T>{
    success: boolean,
    data?: T,
    message?: string,
    error?: string
}