import axiosInstance from "./axiosInstance";

type LoginPayload = {
  email: string;
  password: string;
};

type Provider = "kakao" | "google";

const AUTH_BASE_URL = "https://api.moyeobus.com/api/v1";

export async function login(payload: LoginPayload) {
  await axiosInstance.post("/login", payload);
  console.log("로그인 성공");
}

export function loginOAuth(provider: Provider) {
  window.location.href = `${AUTH_BASE_URL}/oauth2/authorization/${provider}`;
}
