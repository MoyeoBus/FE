import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { RouteItem, RouteStop, RouteStatus } from "../types/myRoute";
import { fetchRoutes, type RouteApiItem } from "../apis/routeApi";
import PageLayout from "../layout/PageLayout";
import RouteCard from "../components/RouteCard";
import DropDownIcon from "../assets/icons/DropDownIcon";

type LocationState = {
  newRoute?: RouteItem;
};
type PeriodKey = "1d" | "1w" | "1m" | "3m" | "6m" | "1y";

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "1d", label: "1일" },
  { key: "1w", label: "1주" },
  { key: "1m", label: "1개월" },
  { key: "3m", label: "3개월" },
  { key: "6m", label: "6개월" },
  { key: "1y", label: "1년" },
];

const formatDateTime = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${mi}:${s}`;
};

const getDateRangeByPeriod = (period: PeriodKey) => {
  const now = new Date();

  // to: 오늘 23:59:59
  const to = new Date(now);
  to.setHours(23, 59, 59, 0);

  // from: 기간에 따라 계산
  const from = new Date(now);
  from.setHours(0, 0, 0, 0);

  switch (period) {
    case "1d":
      // 오늘 하루
      break;
    case "1w":
      from.setDate(from.getDate() - 6); // 오늘 포함 7일
      break;
    case "1m":
      from.setMonth(from.getMonth() - 1);
      break;
    case "3m":
      from.setMonth(from.getMonth() - 3);
      break;
    case "6m":
      from.setMonth(from.getMonth() - 6);
      break;
    case "1y":
      from.setFullYear(from.getFullYear() - 1);
      break;
  }

  return {
    from: formatDateTime(from),
    to: formatDateTime(to),
  };
};

// API -> RouteItem 변환
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

const makeStops = (route: RouteItem): RouteStop[] => [
  { order: 1, name: route.from, time: route.time },
  { order: 2, name: "test1", time: "11:11" },
  { order: 3, name: "test2", time: "22:22" },
  { order: 4, name: "test2", time: "22:22" },
  { order: 5, name: "test2", time: "22:22" },
  {
    order: 6,
    name: route.to,
    time: route.endTime ?? route.time,
    tag: "하차위치",
  },
];

// 승인됨 ->  승인 대기 순으로 기본 정렬
const getStatusPriority = (status?: RouteStatus) => {
  if (status === "APPROVED") return 1;
  if (status === "PENDING") return 2;
  return 3;
};

export default function ProducedRoute() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: LocationState };
  const [routeList, setRouteList] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<PeriodKey>("1m"); // 기본 1개월
  const [openPeriod, setOpenPeriod] = useState(false); // 드롭다운 열림 여부

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        const { from, to } = getDateRangeByPeriod(period);

        const data = await fetchRoutes({
          status: "APPROVED",
          from,
          to,
          cursor: undefined,
        });

        const apiItems = data.result.items ?? [];
        const converted = apiItems.map(mapApiToRouteItem);

        const merged = [
          state?.newRoute && { ...state.newRoute },
          ...converted,
        ].filter(Boolean) as RouteItem[];

        const sorted = merged.sort(
          (a, b) => getStatusPriority(a.status) - getStatusPriority(b.status)
        );

        setRouteList(sorted);
      } catch (error) {
        console.error("노선 요청 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, [state?.newRoute, period]);

  const handleDetail = (route: RouteItem) => {
    navigate(`/history/${route.id}`, {
      state: { route, stops: makeStops(route) },
    });
  };

  return (
    <PageLayout showBack={false}>
      {/* 기간 선택 드롭다운 */}
      <div className="mt-2 flex flex-row justify-between items-center">
        <span className="text-[#212529] text-[18px] leading-[150%] font-[700]">
          노선 내역
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPeriod((prev) => !prev)}
            className="flex items-center justify-between px-3 w-20 py-1.5 border border-gray-300 rounded-lg text-[13px] bg-white"
          >
            <span>
              {PERIOD_OPTIONS.find((opt) => opt.key === period)?.label ??
                "기간"}
            </span>
            <DropDownIcon
              className={`transition-transform duration-200 ${
                openPeriod ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>

          {openPeriod && (
            <div className="absolute right-0 mt-1 w-20 bg-white border border-gray-200 rounded-lg shadow-md z-10 text-[13px]">
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setPeriod(opt.key);
                    setOpenPeriod(false);
                  }}
                  className={`block w-full text-left px-3 py-1.5 hover:bg-gray-100 ${
                    opt.key === period ? "text-[#007CFF] font-medium" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {loading && (
        <p className="text-center text-sm text-gray-400 mt-36">
          불러오는 중...
        </p>
      )}

      {!loading && routeList.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-36">
          아직 노선 요청 내역이 없어요.
        </p>
      )}

      <div className="flex flex-col gap-3 py-3">
        {routeList.map((route) => (
          <RouteCard key={route.id} route={route} onClick={handleDetail} />
        ))}
      </div>
    </PageLayout>
  );
}
