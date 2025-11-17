import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { HomeIcon, HistoryIcon, MyPageIcon } from "../assets/icons";

type Tab = "home" | "myroute" | "mypage" | "history" | "notification";

interface Props {
  active: Tab;
}

export default function BottomTabBar({ active }: Props) {
  return (
    <nav
      role="navigation"
      aria-label="Bottom tab bar"
      className="
        fixed bottom-0 left-0 right-0 mx-auto w-full max-w-sm
        bg-white font-[Pretendard]
        pb-[max(24px,var(--safe-bottom))] z-10
      "
      style={
        {
          "--tabbar-h": `calc(66px + max(24px,var(--safe-bottom)))`,
        } as React.CSSProperties
      }
    >
      {/* 위쪽 border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-200" />

      {/* 탭 아이템 영역 */}
      <div className="flex h-[66px]">
        {item("home", "홈", "/home", active, <HomeIcon size={20} />)}
        {item(
          "myroute",
          "요청내역",
          "/myroute",
          active,
          <HistoryIcon size={20} />
        )}
        {item(
          "mypage",
          "마이페이지",
          "/mypage",
          active,
          <MyPageIcon size={20} />
        )}
      </div>
    </nav>
  );
}

function item(
  key: Tab,
  label: string,
  to: string,
  active: Tab,
  icon: ReactNode
) {
  const isActive = active === key;
  return (
    <NavLink
      key={key}
      to={to}
      aria-current={isActive ? "page" : undefined}
      className={`
        flex flex-col items-center justify-center gap-1 flex-1
        text-[12px]
        ${isActive ? "text-[#212529]" : "text-[#ADB5BD]"}
      `}
    >
      <span aria-hidden className="inline-flex">
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}
