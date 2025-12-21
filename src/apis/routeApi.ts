import axiosInstance from "./axiosInstance";
import type { RouteStatus } from "../types/myRoute";
import type {
  TrackInfo,
  TrackPointRaw,
  TrackResponse,
} from "../types/transports";
import type { RouteDetailResponse } from "../types/routeDetail";

// 공용 타입
export type RouteApiItem = {
  id: number;
  departureNm: string;
  destinationNm: string;
  startDateTime: string; // "2025-10-17T10:00:00"
  endDateTime: string;
  status: RouteStatus; // "APPROVED" | "CANCELLED" | "PENDING"
};

export type AddressItem = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  postCode: string;
};

export type RoutesApiResponse = {
  code: string;
  message: string;
  result: {
    items: RouteApiItem[];
    summary: {
      totalCount: number;
      approvedCount: number;
      cancelledCount: number;
      pendingCount: number;
    };
  };
};

export type CreateRouteResponse = {
  code: string;
  message: string;
  isSuccess: boolean;
};

type AddressApiResponse = {
  code: string;
  message: string;
  result: AddressItem[];
  isSuccess: boolean;
};

// 노선 요청 취소 타입
export type CancelRouteResponse = {
  code: string;
  message: string;
  isSuccess: boolean;
};

// 노선 요청 생성
export type CreateRouteBody = {
  departureId: number;
  destinationId: number;
  startDateTime: string; // "2025-10-17T10:00:00"
  endDateTime: string;
};

// Kakao Polyline용 {lat, lng}로 변환하는 헬퍼
export type LatLng = { lat: number; lng: number };

// 노선 요청 조회 (GET /routes)
export const fetchRoutes = async (params: {
  status?: RouteStatus;
  from?: string;
  to?: string;
  cursor?: number;
}) => {
  const res = await axiosInstance.get<RoutesApiResponse>("/routes", { params });
  console.log("노선 조회", res.data);
  return res.data;
};

export const createRoute = async (
  body: CreateRouteBody
): Promise<CreateRouteResponse> => {
  const res = await axiosInstance.post<CreateRouteResponse>("/routes", body);
  return res.data;
};

// 노선 요청 취소 (PATCH /routes/{requestId})
export const cancelRoute = async (requestId: number) => {
  const res = await axiosInstance.patch(`/routes/${requestId}`);
  console.log(res.data);
  return res.data;
};

// 사용자별 노선 조회 (GET /routes/{passengerId})
export const fetchRoutesByPassenger = async (
  passengerId: number,
  params?: {
    status?: RouteStatus;
    from?: string;
    to?: string;
    cursor?: number;
  }
) => {
  const res = await axiosInstance.get(`/routes/${passengerId}`, { params });
  return res.data;
};

export function convertTrackPointsToPath(points: TrackPointRaw[]): LatLng[] {
  return points.map((p) => ({
    // ❗ 서버 lat = lng, lon = lat 이라서 swap
    lat: p.lon,
    lng: p.lat,
  }));
}

// 노선 상세 조회 (GET /routes/{routeId}/detail)
export const fetchRouteDetail = async (routeId: number) => {
  const res = await axiosInstance.get<RouteDetailResponse>(
    `/routes/${routeId}/detail`
  );
  return res.data.result;
};

// 현재 시/도 + 시/군/구에 포함된 정류장 조회 (GET /addresses)
export const fetchAddresses = async (dosi: string, sigungu: string) => {
  const res = await axiosInstance.get<AddressApiResponse>("/addresses", {
    params: { dosi, sigungu },
  });

  return res.data.result ?? [];
};

// 노선 추적 get
export async function fetchRouteTrack(
  routeId: number,
  currentStation: string
): Promise<{ info: TrackInfo; path: LatLng[] }> {
  const res = await axiosInstance.get<TrackResponse>(
    `/transports/${routeId}/track`,
    {
      params: { currentStation },
    }
  );

  const { info, points } = res.data.result;

  // 서버 lat = lng, lon = lat 이라서 바꿔줌
  const path: LatLng[] = points.map((p) => ({
    lat: p.lon,
    lng: p.lat,
  }));
  console.log(info, path);

  return { info, path };
}
