import axios, { type AxiosRequestConfig } from "axios";
import { ApiError, type ApiResponse } from "../types/api";

// 개발 중에는 Vite 프록시(/api → .env 의 VITE_API_BASE_URL)를 거쳐 CORS 를 피합니다.
// Vercel 배포에서는 /backend 프록시를 거쳐 HTTPS 페이지의 HTTP 직접 요청을 피합니다.
export const client = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "/backend/api",
  timeout: 5_000,
});

client.interceptors.response.use(
  // 200 이어도 isSuccess 가 false 면 실패로 처리합니다.
  (response) => {
    const body = response.data as ApiResponse<unknown>;
    if (!body.isSuccess) {
      throw new ApiError(body.code, body.message, response.status);
    }
    return response;
  },
  // 400·404 등은 서버가 보낸 { code, message } 를 ApiError 로 바꿔서 던집니다.
  (error) => {
    if (
      axios.isAxiosError<ApiResponse<null>>(error) &&
      error.response?.data?.code
    ) {
      const { code, message } = error.response.data;
      throw new ApiError(code, message, error.response.status);
    }
    throw error;
  },
);

// GET 요청 후 응답의 result 만 돌려줍니다.
export async function get<T>(url: string, config?: AxiosRequestConfig) {
  const { data } = await client.get<ApiResponse<T>>(url, config);
  return data.result;
}

// POST 요청도 공통 응답 처리 후 result 만 돌려줍니다.
export async function post<T, D>(
  url: string,
  body: D,
  config?: AxiosRequestConfig,
) {
  const { data } = await client.post<ApiResponse<T>>(url, body, config);
  return data.result;
}
