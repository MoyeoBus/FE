import { useEffect, useRef } from "react";
import type {
  KakaoMapInstance,
  KakaoPolylineInstance,
  KakaoCustomOverlayInstance,
  KakaoMapsNS,
  KakaoMarkerInstance,
} from "../types/kakao";

type LatLng = { lat: number; lng: number };

type Props = {
  className?: string;
  initialCenter?: LatLng;
  center?: LatLng;
  path?: LatLng[];
  zoomLevel?: number;
  markerImage?: string;
  stopMarkerImage?: string;
};

export default function KakaoMap({
  className,
  initialCenter = { lat: 37.5665, lng: 126.978 },
  center,
  path,
  zoomLevel,
  markerImage,
  stopMarkerImage,
}: Props) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const myMarkerRef = useRef<KakaoCustomOverlayInstance | null>(null); // 빨간 점 오버레이
  const imageMarkerRef = useRef<KakaoMarkerInstance | null>(null); // 이미지 마커
  const polylineRef = useRef<KakaoPolylineInstance | null>(null);
  const resizeObsRef = useRef<ResizeObserver | null>(null);
  const stopMarkersRef = useRef<KakaoMarkerInstance[]>([]); // 정류장 마커들

  // 최초 지도 생성
  useEffect(() => {
    const init = () => {
      const kakao = window.kakao;
      if (!kakao || !kakao.maps || !mapDivRef.current) return;

      kakao.maps.load(() => {
        const maps = kakao.maps as KakaoMapsNS;
        const container = mapDivRef.current as HTMLDivElement;

        const centerLatLng = new maps.LatLng(
          initialCenter.lat,
          initialCenter.lng
        );

        const map = new maps.Map(container, {
          center: centerLatLng,
          level: 4,
        });
        mapRef.current = map;

        // 리사이즈 옵저버
        const ro = new ResizeObserver(() => {
          maps.event.trigger(map, "resize");
        });
        ro.observe(container);
        resizeObsRef.current = ro;
      });
    };

    init();

    return () => {
      resizeObsRef.current?.disconnect();
      polylineRef.current?.setMap(null);
      myMarkerRef.current?.setMap(null);
      imageMarkerRef.current?.setMap(null); // 이미지 마커 정리
    };
  }, [initialCenter.lat, initialCenter.lng]);

  // center 변경 → 마커 이동 + 줌 레벨 적용
  useEffect(() => {
    const maps = window.kakao?.maps as KakaoMapsNS | undefined;
    if (!center || !maps || !mapRef.current) return;

    const pos = new maps.LatLng(center.lat, center.lng);

    // 중심 이동
    mapRef.current.setCenter(pos);

    // 줌 레벨 적용
    if (zoomLevel !== undefined) {
      mapRef.current.setLevel(zoomLevel);
    }

    // markerImage 가 있으면 SVG 이미지 마커 사용
    if (markerImage) {
      // 빨간 점 오버레이는 끄기
      if (myMarkerRef.current) {
        myMarkerRef.current.setMap(null);
      }

      const size = new maps.Size(32, 32); // 필요하면 크기 조절
      const offset = new maps.Point(16, 16); // 이미지 기준점 (아래 중앙)

      const markerImg = new maps.MarkerImage(markerImage, size, { offset });

      if (!imageMarkerRef.current) {
        imageMarkerRef.current = new maps.Marker({
          position: pos,
          image: markerImg,
        });
      } else {
        imageMarkerRef.current.setPosition(pos);
        imageMarkerRef.current.setImage(markerImg);
      }

      imageMarkerRef.current.setMap(mapRef.current);
    } else {
      // markerImage 없으면 기존처럼 빨간 점 오버레이 사용, 이미지 마커는 끄기
      if (imageMarkerRef.current) {
        imageMarkerRef.current.setMap(null);
      }

      const content = `<div style="
        width:12px;height:12px;border-radius:50%;
        background:#DC3545;box-shadow:0 0 0 3px rgba(37,99,235,.25);
        transform:translate(-50%,-50%);
      "></div>`;

      if (!myMarkerRef.current) {
        myMarkerRef.current = new maps.CustomOverlay({
          position: pos,
          content,
          yAnchor: 0.5,
          xAnchor: 0.5,
          zIndex: 999,
        });
      } else {
        myMarkerRef.current.setPosition(pos);
      }
      myMarkerRef.current.setMap(mapRef.current);
    }
  }, [center, zoomLevel, markerImage]);

  // path 변경 → 경로 그리기 + 각 포인트에 정류장 아이콘 찍기
  useEffect(() => {
    const maps = window.kakao?.maps as KakaoMapsNS | undefined;
    if (!maps || !mapRef.current) return;

    // 기존 경로(polyline) 처리
    if (!path || path.length === 0) {
      polylineRef.current?.setMap(null);
      polylineRef.current = null;

      // 정류장 마커도 전부 제거
      stopMarkersRef.current.forEach((m) => m.setMap(null));
      stopMarkersRef.current = [];
      return;
    }

    const kakaoPath = path.map((p) => new maps.LatLng(p.lat, p.lng));

    if (!polylineRef.current) {
      polylineRef.current = new maps.Polyline({
        map: mapRef.current,
        path: kakaoPath,
        strokeColor: "#FF7A00",
        strokeWeight: 5,
        strokeOpacity: 0.9,
      });
    } else {
      polylineRef.current.setPath(kakaoPath);
    }

    // 기존 정류장 마커 제거
    stopMarkersRef.current.forEach((m) => m.setMap(null));
    stopMarkersRef.current = [];

    // 정류장 아이콘 설정 (아이콘 이미지가 있을 때만)
    if (!stopMarkerImage) return;

    const size = new maps.Size(20, 20); // 정류장 아이콘 크기
    const offset = new maps.Point(10, 20); // 아이콘 기준점 (아래쪽 중앙 정도)
    const stopMarkerImg = new maps.MarkerImage(stopMarkerImage, size, {
      offset,
    });

    const newMarkers: KakaoMarkerInstance[] = [];

    kakaoPath.forEach((latlng) => {
      const marker = new maps.Marker({
        position: latlng,
        map: mapRef.current!,
        image: stopMarkerImg,
        zIndex: 10,
      });
      newMarkers.push(marker);
    });

    stopMarkersRef.current = newMarkers;
  }, [path, stopMarkerImage]);

  return <div ref={mapDivRef} className={className} />;
}
