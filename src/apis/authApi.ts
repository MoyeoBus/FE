import axiosInstance from "./axiosInstance";

type LoginPayload = {
  email: string;
  password: string;
};

type Provider = "kakao" | "google";

export async function login(payload: LoginPayload) {
  await axiosInstance.post("/login", payload);
  console.log("로그인 성공");
}

export function loginOAuth(provider: Provider) {
  window.location.href = `https://api.moyeobus.com/oauth2/authorization/${provider}`;
}
