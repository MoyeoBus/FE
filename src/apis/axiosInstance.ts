import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
//쿠키가 자동으로 요청에 실리도록 설정

const refreshClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
// access token 재발급 호출용 요청
// 재발급 요청이 무한루프될 수 있기에 따로 분리함

let isRefreshing = false; // 재발급 요청을 진행중인지 확인하는 플래그
let pendingQueue: Array<(ok: boolean) => void> = []; // 재발급 진행 중일 때, 다시 시도할 요청을 큐에 넣어둠

function processQueue(ok: boolean) {
  pendingQueue.forEach((cb) => cb(ok));
  pendingQueue = [];
}
// 재발급 끝나면 큐에 있는 요소들 재시도 및 실패처리

async function reissueAccessToken() {
  await refreshClient.get("/tokens");
}
// 서버에 토큰 재발급 요청 보냄

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const isReissueCall = originalRequest.url?.includes("/tokens");

    // 상태가 401이거나, 이미 재시도한 요청이거나, /tokens 요청일 경우 제외
    if (status === 401 && !originalRequest._retry && !isReissueCall) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((ok) => {
            if (!ok) {
              reject(error);
              return;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        await reissueAccessToken();
        processQueue(true);
        return axiosInstance(originalRequest);
      } catch (reissueError) {
        processQueue(false);
        return Promise.reject(reissueError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
