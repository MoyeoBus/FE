// 기본 좌표 타입 (LatLng 인스턴스)
export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

// 지도 인스턴스
export interface KakaoMapInstance {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
}

// 추가: Size / Point / MarkerImage 인스턴스 타입
export interface KakaoSize {
  getWidth(): number;
  getHeight(): number;
}

export interface KakaoPoint {
  getX(): number;
  getY(): number;
}

// MarkerImage 자체는 실제로 메서드 안 쓰니까 빈 인터페이스여도 OK
export type KakaoMarkerImageInstance = object;

// 마커 인스턴스
export interface KakaoMarkerInstance {
  setPosition(latlng: KakaoLatLng): void;
  setMap(map: KakaoMapInstance | null): void;
  // 이미지 마커에서 사용하는 메서드 추가
  setImage(image: KakaoMarkerImageInstance): void;
}

// 커스텀 오버레이 인스턴스 (내 위치 마커)
export interface KakaoCustomOverlayInstance {
  setPosition(latlng: KakaoLatLng): void;
  setMap(map: KakaoMapInstance | null): void;
}

// 폴리라인 인스턴스 (경로)
export interface KakaoPolylineInstance {
  setPath(path: KakaoLatLng[]): void;
  setMap(map: KakaoMapInstance | null): void;
}

// 이벤트 핸들
export type KakaoEventHandle = unknown;

// 역지오코딩용 Geocoder 타입
export interface KakaoGeocoder {
  coord2RegionCode(
    lng: number,
    lat: number,
    callback: (result: unknown[], status: string) => void
  ): void;
}

// kakao.maps.services 네임스페이스
export interface KakaoServicesNS {
  Status: {
    OK: string; // "OK"
  };
  Geocoder: new () => KakaoGeocoder;
}

// kakao.maps 네임스페이스
export interface KakaoMapsNS {
  load(callback: () => void): void;

  Map: new (
    container: HTMLElement,
    options: {
      center: KakaoLatLng;
      level?: number;
    }
  ) => KakaoMapInstance;

  LatLng: new (lat: number, lng: number) => KakaoLatLng;

  Marker: new (options: {
    position: KakaoLatLng;
    map?: KakaoMapInstance | null;
    image?: KakaoMarkerImageInstance;
    zIndex?: number;
  }) => KakaoMarkerInstance;

  Polyline: new (options: {
    map?: KakaoMapInstance | null;
    path: KakaoLatLng[];
    strokeColor?: string;
    strokeWeight?: number;
    strokeOpacity?: number;
  }) => KakaoPolylineInstance;

  CustomOverlay: new (options: {
    position: KakaoLatLng;
    map?: KakaoMapInstance | null;
    content: string;
    yAnchor?: number;
    xAnchor?: number;
    zIndex?: number;
  }) => KakaoCustomOverlayInstance;

  //Size / Point / MarkerImage 생성자
  Size: new (width: number, height: number) => KakaoSize;

  Point: new (x: number, y: number) => KakaoPoint;

  MarkerImage: new (
    src: string,
    size: KakaoSize,
    options?: { offset?: KakaoPoint }
  ) => KakaoMarkerImageInstance;

  event: {
    addListener(
      target: unknown,
      type: "click" | "resize" | string,
      handler: (event: { latLng: KakaoLatLng }) => void
    ): KakaoEventHandle;

    removeListener(handle: KakaoEventHandle): void;

    trigger(target: unknown, type: "resize" | string): void;
  };

  services?: KakaoServicesNS;
}
