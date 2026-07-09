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


export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface RegisterResponse {
    message: string;
}