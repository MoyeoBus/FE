export type ReverseGeocodeRegion = {
  area1?: { name?: string };
  area2?: { name?: string };
  area3?: { name?: string };
  area4?: { name?: string };
};

export type ReverseGeocodeItem = { region?: ReverseGeocodeRegion };

export type ReverseGeocodeResponse = {
  v2?: { results?: ReverseGeocodeItem[] };
};

export type ServiceStatus = "OK" | string;

// lat,lng 객체, Map 인스턴스, 마커 인스턴스
export type NaverLatLng = { lat(): number; lng(): number };
export type NaverMapInstance = { setCenter(latlng: NaverLatLng): void };
export type NaverMarkerInstance = { setPosition(latlng: NaverLatLng): void };
export type NaverEventHandle = unknown;

// Service 타입을 분리 선언
export type NaverServiceNS = {
  reverseGeocode: (
    options: { coords: unknown; orders?: string },
    callback: (status: ServiceStatus, response: ReverseGeocodeResponse) => void
  ) => void;
  Status: { OK: ServiceStatus };
  OrderType: { ROAD_ADDR: string; ADDR: string };
};

// 네이버 지도 SDK를 구성하는 주요 기능 타입 정의
export type NaverMapsNS = {
  Map: new (
    el: HTMLElement,
    opts: { center: NaverLatLng; zoom?: number; zoomControl?: boolean }
  ) => NaverMapInstance;
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Marker: new (opts: {
    position: NaverLatLng;
    map: NaverMapInstance;
    icon?: { content?: string };
    zIndex?: number;
  }) => NaverMarkerInstance;
  Event: {
    addListener: (
      target: unknown,
      name: "click" | "resize" | string,
      handler: (e: { latlng: NaverLatLng }) => void
    ) => NaverEventHandle;
    removeListener: (handle: NaverEventHandle) => void;
    trigger: (target: unknown, name: "resize" | string) => void;
  };
  Service: NaverServiceNS; // ⬅️ 요게 핵심
};
