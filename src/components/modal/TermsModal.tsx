type Props = {
  onClose: () => void;
};

export default function TermsModal({ onClose }: Props) {
  // 바깥 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent) => {
    // e.target === overlay 면 모달 외부 클릭한 것
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="w-[90%] max-w-md bg-white rounded-[12px] p-6 shadow-lg max-h-[60vh] overflow-y-auto">
        <h2 className="text-[18px] font-[700] mb-3">이용약관</h2>

        <div className="text-[13px] text-[#495057] space-y-3 leading-relaxed">
          <>
            <p>
              <strong>제1조 목적</strong>
              <br />본 약관은 모여버스(이하 “서비스”) 이용과 관련하여 회사와
              이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>

            <p>
              <strong>제2조 용어의 정의</strong>
              <br />
              1. “서비스”는 모여버스 플랫폼을 통해 제공되는 노선 조회, 노선
              요청, 위치기반 이동 정보 제공 서비스를 의미합니다. <br />
              2. “이용자”란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.{" "}
              <br />
              3. “위치정보”란 장치에서 수집되는 GPS·Wi-Fi·기지국 정보 등
              이용자의 위치를 의미합니다.
            </p>

            <p>
              <strong>제3조 약관의 효력 및 변경</strong>
              <br />
              1. 본 약관은 서비스를 이용하는 모든 이용자에게 적용됩니다. <br />
              2. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수
              있으며, 변경 시 공지합니다. <br />
              3. 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단해야 합니다.
            </p>

            <p>
              <strong>제4조 서비스의 제공</strong>
              <br />
              회사는 다음의 서비스를 제공합니다. <br />
              1. 이용자가 직접 요청한 노선 생성·조회 서비스 <br />
              2. 이용자 주변 정류장 및 이동 경로 정보를 제공하는 위치기반 서비스{" "}
              <br />
              3. 기타 회사가 정하는 서비스
            </p>

            <p>
              <strong>제5조 위치기반서비스 이용 동의</strong>
              <br />
              1. 회사는 이용자 기기의 GPS·네트워크 기반 위치 정보를 수집하여
              다음 목적에 사용합니다. <br />
              - 현재 위치 기준 정류장 조회 <br />
              - 맞춤형 이동 경로 안내 <br />
              - 노선 요청 시 출발지 자동 추천 <br />
              2. 이용자는 위치정보 수집에 동의하지 않을 수 있으나, 이 경우 일부
              기능 사용이 제한될 수 있습니다. <br />
              3. 수집된 위치 정보는 서비스 제공 목적 외 사용되지 않으며, 목적
              달성 후 즉시 폐기 또는 법령에 따라 안전하게 보관됩니다.
            </p>

            <p>
              <strong>제6조 개인정보의 수집 및 이용</strong>
              <br />
              회사는 다음 정보를 수집·이용할 수 있습니다. <br />
              - 이름, 연락처 등 기본 정보 <br />
              - GPS 기반 위치 정보 <br />
              - 서비스 이용 기록 및 요청 내역 <br />
              수집된 정보는 서비스 제공 목적 외에는 사용하지 않습니다.
            </p>

            <p>
              <strong>제7조 이용자의 의무</strong>
              <br />
              1. 이용자는 관련 법령을 준수해야 합니다. <br />
              2. 타인의 정보를 도용하거나 서비스 운영을 방해하는 행위를 해서는
              안 됩니다.
            </p>

            <p>
              <strong>제8조 서비스의 변경 및 중단</strong>
              <br />
              회사는 다음 사유가 발생할 경우 서비스 제공의 전부 또는 일부를
              변경하거나 중단할 수 있습니다. <br />
              - 설비 점검 또는 기술적 장애 <br />
              - 천재지변 등 불가피한 사유 <br />- 회사의 운영 정책 변경
            </p>

            <p>
              <strong>제9조 책임 제한</strong>
              <br />
              1. 회사는 이용자의 귀책 사유로 발생한 손해에 대해 책임을 지지
              않습니다.
              <br />
              2. 통신사나 위치 제공 사업자의 장애로 인한 서비스 오작동에 대해
              책임을 지지 않습니다. <br />
              3. 서비스에서 제공되는 정보는 참고용이며 실제 교통 상황과 차이가
              있을 수 있습니다.
            </p>

            <p>
              <strong>제10조 준거법 및 분쟁 해결</strong>
              <br />
              본 약관은 대한민국 법률을 기준으로 해석됩니다. <br />
              서비스 이용과 관련한 분쟁이 발생할 경우 회사와 이용자는 성실히
              협의하여 해결하며, 협의가 어려울 경우 관할 법원에 제기할 수
              있습니다.
            </p>

            <p className="text-[12px] text-[#868E96]">
              ※ 본 이용약관은 모여버스 앱의 원활한 서비스 제공을 위한 기본
              규약입니다.
            </p>
          </>
        </div>

        <button
          className="mt-6 w-full h-11 rounded-[8px] bg-[#007CFF] text-white font-[600] active:scale-[0.98]"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
