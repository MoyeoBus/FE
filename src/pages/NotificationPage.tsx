import NotificationItem from "../components/NotificationItem";
import PageLayout from "../layout/PageLayout";

export default function NotificationPage() {
  const dummy = [
    {
      title: "노선 생성 완료",
      date: "2025-11-17",
      route: "101번 · 서울특별시청 → 경복궁",
      location: "서울특별시청",
      time: "08:00",
    },
    {
      title: "노선 생성 완료",
      date: "2025-11-11",
      route: "101번 · 석관동주민센터 → 석관고등학교",
      location: "석관동주민센터",
      time: "14:44",
    },
    {
      title: "노선 생성 완료",
      date: "2025-11-06",
      route: "101번 · 석계역 → 석관고등학교",
      location: "석관고등학교",
      time: "08:00",
    },
    {
      title: "노선 생성 완료",
      date: "2025-11-06",
      route: "101번 · 석계역 → 석관고등학교",
      location: "석계역",
      time: "14:44",
    },
  ];
  return (
    <PageLayout showBack={false} showBell={false}>
      <div className="mt-2 flex flex-row justify-between items-center">
        <span className="text-[#212529] text-[18px] leading-[150%] font-[700] pt-[30px]">
          알림함
        </span>
      </div>
      <div className="mt-2 flex flex-col gap-4 pb-[120px]">
        {dummy.map((item, i) => (
          <NotificationItem
            key={i}
            {...item}
            onDetail={() => console.log("상세보기")}
          />
        ))}
      </div>
    </PageLayout>
  );
}
