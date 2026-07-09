import apiClient from "@/api/client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  MessageResponse,
  VerifyEmailRequest,
} from "@/features/auth/types/auth.types";
import AppRouter from "@/routes/AppRouter";

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login/",
    data
  );

  return response.data;
}

export async function register(
    data: RegisterRequest
): Promise<MessageResponse> {

    const response =
        await apiClient.post<MessageResponse>(
            "/auth/register/",
            data
        );

    return response.data;
}


export async function resendVerification(email: string) {
  const response = await apiClient.post(
    "/auth/resend-email-verification/",
    { email }
  );

  return response.data;
}

export const verifyEmail = async (data: VerifyEmailRequest) => {
    const response = await apiClient.post('/auth/verify-email/', data);
    return response.data;
};

export const requestPasswordReset = async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password/', { email });
    return response.data;
};


export const confirmPasswordReset = async (data: { uid: string, token: string, password: string, confirm_password: string }) => {
    const response =await apiClient.post('/auth/reset-password/', data);
    return response.data;
};


export const logout = async (refreshToken: string) => {
    const response = await apiClient.post('/auth/logout/', {refresh: refreshToken});
    return response.data;
}


