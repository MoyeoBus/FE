import { Outlet, useLocation } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";

export default function AppLayout() {
  const location = useLocation();
  const showTabBar = [
    "/home",
    "/myroute",
    "/mypage",
    "/history",
    "/notification",
  ].some((p) => location.pathname.startsWith(p));

  // 탭바가 있을 때만 하단 패딩을 --tabbar-h 변수로 줘서 이중계산 방지
  return (
    <div className="relative flex flex-col w-full h-full mx-auto bg-white font-[Pretendard]">
      <Outlet />
      {showTabBar && <BottomTabBar active={getActiveTab(location.pathname)} />}
    </div>
  );
}

function getActiveTab(pathname: string) {
  if (pathname.startsWith("/home")) return "home" as const;
  if (pathname.startsWith("/myroute")) return "myroute" as const;
  if (pathname.startsWith("/mypage")) return "mypage" as const;
  if (pathname.startsWith("/history")) return "history" as const;
  if (pathname.startsWith("/notification")) return "notification" as const;
  return "home" as const;
}
