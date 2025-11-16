import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { RouteItem, RouteStop, RouteStatus } from "../types/myRoute";
import { fetchRoutes, type RouteApiItem } from "../apis/routeApi";
import PageLayout from "../layout/PageLayout";
import RouteCard from "../components/RouteCard";

type LocationState = {
  newRoute?: RouteItem;
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

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);

        const data = await fetchRoutes({
          from: "2025-10-01 00:00:00",
          to: "2025-11-30 23:59:59",
          cursor: 1,
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
  }, [state?.newRoute]);

  const handleDetail = (route: RouteItem) => {
    navigate(`/history/${route.id}`, {
      state: { route, stops: makeStops(route) },
    });
  };

  return (
    <PageLayout title="노선 내역">
      {loading && (
        <p className="text-center text-sm text-gray-400 mt-4">불러오는 중...</p>
      )}

      {!loading && routeList.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          아직 노선 요청 내역이 없어요.
        </p>
      )}

      <div className="flex flex-col gap-3 pt-3">
        {routeList.map((route) => (
          <RouteCard key={route.id} route={route} onClick={handleDetail} />
        ))}
      </div>
    </PageLayout>
  );
}
