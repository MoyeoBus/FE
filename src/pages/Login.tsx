import { useNavigate } from "react-router-dom";
import loginLogo from "../assets/loginLogo.svg";
import google from "../assets/google.svg";
import kakao from "../assets/kakao.svg";

type Provider = "local" | "kakao" | "google";

export default function Login() {
  const navigate = useNavigate();

  // 버튼 클릭 핸들러
  const handleLogin = (provider: Provider) => {
    if (provider === "local") {
      navigate("/login/account");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#fff]">
      {/* 상단 120px / 히어로(로고+카피) / 액션(버튼) */}
      <div className="mx-auto w-full max-w-sm px-6 min-h-screen grid grid-rows-[220px_auto_1fr]">
        {/* 히어로: 좌측 정렬, 캡션 포함 */}
        <div className="row-start-2 flex flex-col items-start gap-3">
          <img src={loginLogo} alt="moyeobus" className="object-contain" />
        </div>

        {/* 버튼들: 히어로 바로 아래 시작(하단 고정 아님) */}
        <div className="row-start-3 self-start w-full space-y-3 pt-12 pb-10">
          <button
            onClick={() => handleLogin("local")}
            className="w-full h-12 rounded-[10px] bg-[#007CFF] text-white text-[14px] font-normal"
          >
            내 계정으로 시작하기
          </button>

          <button
            onClick={() => handleLogin("kakao")}
            className="relative w-full h-12 rounded-[10px] bg-[#FEE500] text-[#212529] text-[14px] font-medium flex items-center justify-center"
          >
            <img src={kakao} alt="kakao" className="absolute left-4 w-5 h-5" />
            카카오로 시작하기
          </button>

          <button
            onClick={() => handleLogin("google")}
            className="relative w-full h-12 rounded-[10px] bg-white border border-gray-200 text-[#212529] text-[14px] font-medium flex items-center justify-center"
          >
            <img
              src={google}
              alt="google"
              className="absolute left-4 w-5 h-5"
            />
            Google로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
