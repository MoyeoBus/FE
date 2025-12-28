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

export async function loginOAuth(provider: Provider) {
  return axiosInstance.post("/login/oauth", null, {
    params: { provider },
  });
}
