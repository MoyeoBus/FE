import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import destination from "../assets/destination.svg";
import calendar from "../assets/miniCalendar.svg";
import date from "../assets/time.svg";
import type { RouteItem, RouteStop, RouteStatus } from "../types/myRoute";
import { fetchRoutes, type RouteApiItem, cancelRoute } from "../apis/routeApi";
import PageLayout from "../layout/PageLayout";

type LocationState = {
  newRoute?: RouteItem;
};

// API → RouteItem 변환
const mapApiToRouteItem = (item: RouteApiItem): RouteItem => {
  const [startDatePart, startTimePart] = item.startDateTime.split("T");
  const [, endTimePart] = item.endDateTime.split("T");
  const startTime = startTimePart?.slice(0, 5) ?? "";
  const endTime = endTimePart?.slice(0, 5) ?? "";

  return {
    id: String(item.id),
    from: item.departureNm,
    to: item.destinationNm,
    date: startDatePart,
    time: startTime,
    endTime,
    status: item.status,
  };
};

// 정류장 리스트 생성
const makeStops = (route: RouteItem): RouteStop[] => [
  { order: 1, name: route.from, time: route.time },
  { order: 2, name: "test1", time: "11:11" },
  { order: 3, name: "test2", time: "22:22" },
  {
    order: 4,
    name: route.to,
    time: route.endTime ?? route.time,
    tag: "하차위치",
  },
];

// 상태별 스타일/텍스트
const getStatusStyle = (status: RouteStatus | undefined) => {
  if (status === "APPROVED") return "bg-[#28A745] text-white";
  if (status === "PENDING") return "bg-[#ADB5BD] text-white";
  return "bg-[#CED4DA] text-white";
};

const getStatusLabel = (status: RouteStatus | undefined) => {
  if (status === "APPROVED") return "승인됨";
  if (status === "PENDING") return "승인대기";
  return "취소됨";
};

const sortByNewestDate = (a: RouteItem, b: RouteItem) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);

  return dateB.getTime() - dateA.getTime(); // 최신 날짜가 먼저
};

// 삭제 상태별 스타일/텍스트
const getDeleteButtonStyle = (status: RouteStatus | undefined) => {
  if (status === "PENDING") {
    return "bg-white border-[#CED4DA] text-[#ADB5BD] active:scale-[0.99]";
  }
  if (status === "CANCELLED") {
    return "bg-[#F1F3F5] border-[#E9ECEF] text-[#ADB5BD] opacity-60 cursor-not-allowed";
  }
  return "bg-[#F1F3F5] border-[#E9ECEF] text-[#ADB5BD] opacity-60 cursor-not-allowed";
};

export default function MyRoute() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: LocationState };
  const [routeList, setRouteList] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        const data = await fetchRoutes({});
        const apiItems = data.result.items ?? [];
        const converted = apiItems.map(mapApiToRouteItem);
        const merged = [
          state?.newRoute && { ...state.newRoute },
          ...converted,
        ].filter(Boolean) as RouteItem[];

        merged.sort(sortByNewestDate);

        setRouteList(merged);
      } catch (error) {
        console.error("노선 요청 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, [state?.newRoute, reloadKey]);

  // 상세 정보 핸들러
  const handleDetail = (route: RouteItem) => {
    navigate(`/history/${route.id}`, {
      state: { route, stops: makeStops(route) },
    });
  };

  // 삭제 핸들러
  const handleCancel = async (route: RouteItem) => {
    // PENDING 아닐 때는 그냥 막아두기 (안전용)
    if (route.status !== "PENDING") return;

    const ok = window.confirm("이 노선 요청을 취소하시겠습니까?");
    if (!ok) return;

    const idNum = Number(route.id);
    if (Number.isNaN(idNum)) {
      console.error("route.id를 숫자로 변환할 수 없습니다:", route.id);
      return;
    }

    try {
      const res = await cancelRoute(idNum);

      if (!res.isSuccess) {
        alert(res.message || "노선 취소에 실패했습니다.");
        return;
      }
      setReloadKey((prev) => prev + 1);
      setRouteList((prev) => prev.filter((r) => r.id !== route.id));
    } catch (error) {
      console.error("노선 취소 실패:", error);
      alert("노선 취소 요청중 오류가 발생했습니다");
    }
  };

  return (
    <PageLayout showBack={false}>
      <div className="mt-2 flex flex-row justify-between items-center">
        <span className="text-[#212529] text-[18px] leading-[150%] font-[700]">
          요청 내역
        </span>
      </div>
      {loading && (
        <p className="text-center text-sm text-gray-400 mt-4">불러오는 중...</p>
      )}

      {!loading && routeList.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          아직 노선 요청 내역이 없어요.
        </p>
      )}

      <div className="flex flex-col gap-3 py-3">
        {routeList.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-xl border border-gray-200 py-4 px-6"
          >
            <div className="mb-2">
              <span
                className={`inline-flex items-center rounded-[12px] px-2 py-[2px] text-[12px] font-500 ${getStatusStyle(
                  route.status
                )}`}
              >
                {getStatusLabel(route.status)}
              </span>
            </div>

            <div className="text-[13px] text-[#111827] space-y-1">
              <p className="flex gap-[6px] items-center text-[12px] text-[#212529] font-[500]">
                <img
                  src={destination}
                  alt="destination"
                  className="w-[15px] h-[15px]"
                />
                {route.from} → {route.to}
              </p>
              <div className="flex items-center text-[12px] gap-5 text-[#212529]">
                <div className="flex items-center gap-[5px]">
                  <img
                    src={calendar}
                    alt="Calendar"
                    className="h-[15px] w-[15px]"
                  />
                  {route.date}
                </div>
                <div className="flex items-center gap-[5px]">
                  <img src={date} alt="date" className="h-[12px] w-[12px]" />
                  {route.time}
                </div>
              </div>
            </div>

            {route.status === "APPROVED" ? (
              <button
                className="mt-3 w-full h-9 rounded-[8px] bg-[#007CFF] text-white text-[14px] font-semibold leading-[150%] active:scale-[0.99]"
                onClick={() => handleDetail(route)}
              >
                노선 상세보기
              </button>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  className={`h-9 rounded-[8px] border font-[600] text-[13px] ${getDeleteButtonStyle(
                    route.status
                  )}`}
                  onClick={() =>
                    route.status === "PENDING" && handleCancel(route)
                  }
                  disabled={route.status !== "PENDING"}
                >
                  삭제
                </button>

                <button className="h-9 rounded-[8px] border bg-white border-[#CED4DA] font-[600] text-[13px] text-[#ADB5BD]">
                  다시 요청
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
