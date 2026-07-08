export interface LoginRequest {
    email: string;
    password: string;
}


export interface LoginResponse {
    message: string;
    tokens: {
        access: string;
        refresh: string;
    };
}