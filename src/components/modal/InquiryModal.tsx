type Props = {
  onClose: () => void;
};

export default function InquiryModal({ onClose }: Props) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="w-[90%] max-w-sm bg-white rounded-[12px] p-6 shadow-lg">
        <h2 className="text-[18px] font-[700] text-[#212529] mb-2">문의하기</h2>

        <p className="text-[13px] text-[#495057] leading-relaxed mb-4">
          모여버스 고객센터입니다.
          <br /> 아래 방법 중 하나로 문의해 주세요.
        </p>

        {/* 전화하기 */}
        <a
          href="tel:010-4136-3945"
          className="w-full h-11 flex items-center justify-center rounded-[8px] bg-[#007CFF] text-white text-[14px] font-[600] active:scale-[0.98]"
        >
          전화하기
        </a>

        {/* 이메일 */}
        <a
          href="mailto:dudwnsths1@naver.com"
          className="w-full h-11 flex items-center justify-center rounded-[8px] mt-2 border border-[#DEE2E6] text-[#212529] text-[14px] font-[600] active:scale-[0.98]"
        >
          이메일 문의
        </a>

        {/* 안내 문구 */}
        <p className="text-[11px] text-[#868E96] mt-4">
          운영시간: 월–금 09:00 ~ 18:00 (공휴일 제외)
        </p>
      </div>
    </div>
  );
}
