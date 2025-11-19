import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { RouteItem, RouteStop } from "../types/myRoute";
import logo from "../assets/detailLogo.svg";
import CalendarIcon from "../assets/icons/CalendarIcon";
import ClockIcon from "../assets/icons/ClockIcon";
import LocationIcon from "../assets/icons/LocationIcon";
import FlagIcon from "../assets/icons/FlagIcon";
import PageLayout from "../layout/PageLayout";
import { fetchRouteDetail } from "../apis/routeApi";

export default function RouteDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [route, setRoute] = useState<RouteItem | null>(null);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [loading, setLoading] = useState(true);

  // 노선 상세 API 호출
  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      try {
        setLoading(true);
        const detail = await fetchRouteDetail(Number(id));
        const info = detail.routeInfo;
        console.log(detail);

        // RouteItem 변환
        setRoute({
          id: id,
          busNumber: info.busNumber,
          from: info.departureName,
          to: info.destinationName,
          date: info.operateDate,
          time: info.departTime,
          endTime: info.arrivalTime,
          status: "APPROVED",
        });

        // Stops 변환
        setStops(
          detail.items.map((item) => ({
            order: item.order,
            name: item.station,
            time: item.time,
            tag:
              item.station === info.departureName
                ? "탑승위치"
                : item.station === info.destinationName
                ? "하차위치"
                : undefined,
          }))
        );
      } catch (e) {
        console.error("노선 상세 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  if (!route || loading) {
    return (
      <PageLayout>
        <p className="text-center text-sm text-gray-400 mt-10">
          노선 정보를 불러오는 중입니다...
        </p>
      </PageLayout>
    );
  }

  const eta = stops[stops.length - 1]?.time ?? "";

  return (
    <PageLayout>
      {/* 버스 정보 카드 */}
      <section className="w-full">
        <h2 className="text-[18px] font-[700] mb-3">버스 정보</h2>
        <div className="bg-white border border-gray-200 rounded-xl py-[15px] px-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="logo" />
            <div className="flex flex-col items-start gap-2">
              <div className="flex font-[600] text-[18px] items-center">
                {route.busNumber}번
              </div>
              <p className="text-[18px] font-[500] text-[#212529]">
                {route.from} → {route.to}
              </p>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="flex items-center gap-2 text-[14px]">
                  <CalendarIcon className="w-5 h-5 text-[#6C757D]" />
                  {route.date}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="flex items-center gap-2 text-[14px] text-nowrap">
                  <ClockIcon className="w-5 h-5 text-[#6C757D]" />
                  <span>출발: {route.time}</span>
                  <span>도착: {eta}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 노선 경로 */}
      <section className="w-full mt-3">
        <h2 className="text-[18px] font-[700] mb-3">노선 경로</h2>

        <div className="bg-white border border-gray-200 rounded-xl px-5 py-3">
          <ol className="relative">
            <div className="absolute left-[16px] top-6 bottom-6 border-l-2 border-dashed border-gray-200 pointer-events-none" />

            {stops.map((s) => (
              <li
                key={s.order}
                className="flex gap-5 relative py-3 items-center"
              >
                <div className="">
                  {s.tag === "탑승위치" ? (
                    <div className="w-9 h-9 rounded-full bg-[#007CFF] text-white flex items-center justify-center text-[13px]">
                      <LocationIcon className="w-[25px] h-[25px]" />
                    </div>
                  ) : s.tag === "하차위치" ? (
                    <div className="w-9 h-9 rounded-full bg-[#007CFF] text-white flex items-center justify-center text-[18px]">
                      <FlagIcon className="w-[25px] h-[25px]" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#CCE5FF] text-[#212529] flex items-center justify-center text-[18px] font-[500]">
                      {s.order}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-medium text-[#111827]">
                      {s.name}
                    </p>
                    {s.tag && (
                      <span className="text-[11px] px-2 py-[2px] rounded-full bg-orange-100 text-orange-600">
                        {s.tag}
                      </span>
                    )}
                  </div>
                  <p className="flex items-center text-[12px] gap-[5px] text-[#212529] mt-[2px]">
                    <ClockIcon className="w-3 h-3 text-[#6C757D]" /> {s.time}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <button
        type="button"
        className="my-3 w-full h-12 rounded-[10px] bg-[#007CFF] text-white text-[14px] font-semibold active:scale-[0.99]"
        onClick={() =>
          navigate(`/history/${route.id}/realtime`, {
            state: { route, stops },
          })
        }
      >
        실시간 위치 보기
      </button>
    </PageLayout>
  );
}
