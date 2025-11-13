import { useEffect, useRef } from "react";
import type {
  NaverMapsNS,
  NaverLatLng,
  NaverMapInstance,
  NaverMarkerInstance,
  NaverEventHandle,
} from "../types/naver";

type LatLng = { lat: number; lng: number };

type Props = {
  className?: string;
  initialCenter?: LatLng; // 최초 로드용 위치
  center?: LatLng; // 외부에서 바뀌면 지도 센터 이동
  onSelectPoint?: (pos: LatLng & { address?: string }) => void; // 지도 클릭 시 전달
};

export default function NaverMap({
  className,
  initialCenter = { lat: 37.5665, lng: 126.978 },
  center,
  onSelectPoint,
}: Props) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<NaverMapInstance | null>(null);
  const markerRef = useRef<NaverMarkerInstance | null>(null);
  const myMarkerRef = useRef<NaverMarkerInstance | null>(null);
  const onSelectRef = useRef<Props["onSelectPoint"]>(onSelectPoint);
  const resizeObsRef = useRef<ResizeObserver | null>(null);
  const clickListenerRef = useRef<NaverEventHandle | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelectPoint;
  }, [onSelectPoint]);

  // 최초 1회 지도 생성
  useEffect(() => {
    const init = () => {
      const maps: NaverMapsNS | undefined = window.naver?.maps;
      if (!mapDivRef.current || !maps) return;

      // 지도 생성
      const map = new maps.Map(mapDivRef.current, {
        center: new maps.LatLng(initialCenter.lat, initialCenter.lng),
        zoom: 14,
        zoomControl: false,
      });
      mapRef.current = map;

      // 클릭 마커 초기값 생성
      markerRef.current = new maps.Marker({
        position: new maps.LatLng(initialCenter.lat, initialCenter.lng),
        map,
      });

      // 지도 클릭 시 마커 이동 + 콜백 호출
      clickListenerRef.current = maps.Event.addListener(
        map,
        "click",
        (e: { latlng: NaverLatLng }) => {
          if (!markerRef.current) return;
          markerRef.current.setPosition(e.latlng);
          onSelectRef.current?.({ lat: e.latlng.lat(), lng: e.latlng.lng() });
        }
      );

      // 지도 크기 리사이즈 대응
      const ro = new ResizeObserver(() => {
        maps.Event.trigger(map, "resize");
      });
      ro.observe(mapDivRef.current);
      resizeObsRef.current = ro;
    };

    if (window.naver?.maps) {
      init();
    } else {
      const t = setInterval(() => {
        if (window.naver?.maps) {
          clearInterval(t);
          init();
        }
      }, 50);
      return () => clearInterval(t);
    }

    // 언마운트 시 리스너 정리
    return () => {
      const maps = window.naver?.maps;
      if (maps && clickListenerRef.current) {
        maps.Event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
      if (resizeObsRef.current) {
        resizeObsRef.current.disconnect();
        resizeObsRef.current = null;
      }
    };
  }, []);

  // 외부 center 변경 시 이동 -> 지도/마커 이동
  useEffect(() => {
    const maps = window.naver?.maps;
    if (!center || !mapRef.current || !maps) return;

    const latlng = new maps.LatLng(center.lat, center.lng);
    mapRef.current.setCenter(latlng);

    if (!myMarkerRef.current) {
      myMarkerRef.current = new maps.Marker({
        position: latlng,
        map: mapRef.current,
        icon: {
          // 파란 점(내 위치 표시)
          content: `<div style="
              width:12px;height:12px;border-radius:50%;
              background:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.25);
            "></div>`,
        },
        zIndex: 999,
      });
    } else {
      // 이미 있다면 위치만 업데이트
      myMarkerRef.current.setPosition(latlng);
    }
  }, [center]);

  // 지도 표시 div
  return <div ref={mapDivRef} className={className} />;
}
