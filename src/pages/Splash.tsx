import { useNavigate } from "react-router-dom";
import splashimg from "../assets/splash.svg";

export default function Splash() {
  const nav = useNavigate();
  return (
    // 화면 전체 차지
    <div className="w-full h-dvh">
      <div className="flex flex-col w-full h-full mx-auto font-[Pretendard] relative bg-[#007CFF]">
        {/* 이미지: 화면 중간쯤 고정 */}
        <img
          src={splashimg}
          alt="MoyeoBus"
          className="absolute left-1/2 -translate-x-1/2 top-[35vh] object-contain w-full max-w-sm"
        />

        {/* 버튼: 하단 고정 (안전영역 고려) */}
        <button
          onClick={() => nav("/login")}
          className="absolute left-1/2 -translate-x-1/2 bottom-[calc(30px+env(safe-area-inset-bottom,0px))] w-[90%] max-w-sm rounded-[10px] bg-white text-[#007CFF] font-[400] py-[14px] text-[14px] active:scale-[0.98] transition-transform"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
