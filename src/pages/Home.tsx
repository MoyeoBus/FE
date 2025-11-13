import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import InputField from "../components/InputField";
import NaverMap from "../components/NaverMap";
import { useNavigate } from "react-router-dom";
import type { RouteItem } from "../types/myRoute";
import type { ReverseGeocodeResponse, ServiceStatus } from "../types/naver";

type LatLng = { lat: number; lng: number };

// 시/군/구까지만 추출 (없으면 시/도로 대체)
function formatToSigungu(resp: ReverseGeocodeResponse): string {
  const first = resp.v2?.results?.[0];
  const area2 = first?.region?.area2?.name; // 시/군/구
  const area1 = first?.region?.area1?.name; // 시/도 (fallback)
  return area2 || area1 || "내 위치";
}

export default function Home() {
  const [date, setDate] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [myPos, setMyPos] = useState<LatLng | null>(null);
  const [loadingPos, setLoadingPos] = useState(false);
  const [posError, setPosError] = useState<string | null>(null);
  const [address, setAddress] = useState("모여버스");
  const navigate = useNavigate();

  const fetchMyLocation = async () => {
    try {
      setLoadingPos(true);
      setPosError(null);

      await Geolocation.requestPermissions();
      const { coords } = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      const lat = coords.latitude;
      const lng = coords.longitude;
      setMyPos({ lat, lng });

      // 역지오코딩 (시/군/구까지만 표기)
      const svc = window.naver?.maps?.Service;
      const LatLngCtor = window?.naver?.maps?.LatLng;

      if (svc?.reverseGeocode && LatLngCtor) {
        svc.reverseGeocode(
          {
            coords: new LatLngCtor(lat, lng),
            orders: [svc.OrderType.ROAD_ADDR, svc.OrderType.ADDR].join(","),
          },
          (status: ServiceStatus, response: ReverseGeocodeResponse) => {
            if (status !== svc.Status.OK) {
              setAddress("내 위치");
              return;
            }
            setAddress(formatToSigungu(response));
          }
        );
      } else {
        setAddress("내 위치");
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "현재 위치를 가져오지 못했습니다.";
      setPosError(msg);
    } finally {
      setLoadingPos(false);
    }
  };

  useEffect(() => {
    fetchMyLocation(); // 첫 진입 시 한 번
  }, []);

  const handleMapSelect = (pos: LatLng & { address?: string }) => {
    const addr = pos.address ?? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
    if (!origin) setOrigin(addr);
    else setDestination(addr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute: RouteItem = {
      id: crypto.randomUUID(),
      from: origin,
      to: destination,
      date,
      time,
      status: "CREATED",
    };
    navigate("/history", { state: { newRoute } });
  };

  return (
    <div className="w-full h-full flex flex-col font-[Pretendard] bg-white">
      {/* 내부 스크롤 영역 (전체 콘텐츠) */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto pt-4 pb-[calc(66px+var(--safe-bottom))]">
          <div className="overflow-hidden text-[#111827]">
            {/* 인사말 + 버튼 */}
            <div className="flex items-start justify-between pt-5 pb-2 px-4">
              <p className="text-[18px] leading-[150%] font-[500] text-[#212529]">
                안녕하세요, <span className="font-[700]">{address}</span>에서
                <br />
                이동을 시작해볼까요?
              </p>
              <button
                type="button"
                onClick={fetchMyLocation}
                className="ml-2 h-9 px-3 text-[12px] rounded-lg bg-gray-100"
              >
                {loadingPos ? "찾는 중" : "내 위치"}
              </button>
            </div>

            {/* 지도 영역 */}
            <main className="relative">
              <NaverMap
                className="w-full h-[280px] bg-gray-200"
                center={myPos ?? undefined}
                onSelectPoint={handleMapSelect}
              />
              {posError && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 text-xs px-3 py-1 rounded shadow">
                  {posError}
                </div>
              )}
            </main>

            {/* 폼 영역 */}
            <div className="px-4 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <InputField
                    variant="date"
                    placeholder="날짜 입력"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <InputField
                    variant="origin"
                    placeholder="출발지 입력"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                  <InputField
                    variant="destination"
                    placeholder="도착지 입력"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                  <InputField
                    variant="time"
                    placeholder="희망 출발 시간"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                {/* 버튼이 화면 밖으로 안 짤리도록 여유 padding */}
                <button
                  type="submit"
                  className="w-full h-12 rounded-[10px] bg-[#007CFF] leading-[150%] text-white text-[14px] font-[500] active:scale-[0.99] transition"
                >
                  노선 요청하기
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
