import PageLayout from "../layout/PageLayout";
import bellIcon from "../assets/myBell.svg";
import questionIcon from "../assets/myQuestion.svg";
import docIcon from "../assets/myUsage.svg";
import logoutIcon from "../assets/myLogout.svg";
import warningIcon from "../assets/myWithdraw.svg";
import chevronRight from "../assets/myRight.svg";
import MyPageItem from "../components/MyPageItem";
import TermsModal from "../components/modal/TermsModal";
import { useState } from "react";
import InquiryModal from "../components/modal/InquiryModal";

export default function MyPage() {
  const userName = "손영준"; // 유저 정보 받아오기
  const [showTerms, setShowTerms] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);

  return (
    <PageLayout showBack={false} showBell={false}>
      <div className="mt-[50px]">
        {/* 페이지 타이틀 */}
        <h1 className="text-[#212529] text-[18px] leading-[150%] font-[700]">
          마이페이지
        </h1>

        {/* 프로필 카드 */}
        <div className="mt-3">
          <div className="w-full rounded-[12px] border border-[#E9ECEF] bg-white px-6 py-4 flex items-center gap-5">
            <span className="text-[18px] font-[500] text-[#212529]">
              {userName}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#FFD84D] px-3 py-[4px] text-[12px] font-[500] text-[#212529]">
              카카오톡 인증 완료
            </span>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="mt-4 space-y-2">
          <MyPageItem
            icon={bellIcon}
            label="알림설정"
            rightIcon={chevronRight}
          />
          <MyPageItem
            icon={questionIcon}
            label="문의하기"
            rightIcon={chevronRight}
            onClick={() => setShowInquiry(true)}
          />
          <MyPageItem
            icon={docIcon}
            label="이용약관"
            rightIcon={chevronRight}
            onClick={() => setShowTerms(true)}
          />
          <MyPageItem icon={logoutIcon} label="로그아웃" />
          <MyPageItem icon={warningIcon} label="회원탈퇴" />
        </div>
      </div>

      {showInquiry && <InquiryModal onClose={() => setShowInquiry(false)} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </PageLayout>
  );
}
