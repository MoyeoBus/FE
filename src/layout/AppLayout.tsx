import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-dvh w-full bg-white text-white font-[Pretendard]">
      {/* Outlet이 화면 전체를 쓰게 하려면 부모가 flex 정렬로 가로를 줄이지 않도록 */}
      <Outlet />
    </div>
  );
}
