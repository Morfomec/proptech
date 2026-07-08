import apiClient from "./client";
import type {
  LoginRequest,
  LoginResponse,
} from "@/features/auth/types/auth.types";

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login/",
    data
  );

  return response.data;
}