type ItemProps = {
  icon: string;
  label: string;
  rightIcon?: string;
};

export default function MyPageItem({ icon, label, rightIcon }: ItemProps) {
  return (
    <button
      className="
        w-full rounded-[12px] border border-[#E9ECEF] bg-white
        px-6 py-4 flex items-center justify-between
        text-left
      "
    >
      <div className="flex items-center gap-5">
        <img src={icon} alt="" className="w-[25px] h-[25px]" />
        <span className="text-[18px] font-[500] text-[#212529]">{label}</span>
      </div>
      {rightIcon ? (
        <img src={rightIcon} alt="" className="w-[30px] h-[30px]" />
      ) : (
        <div className="w-[30px] h-[30px]" /> // 정렬용 빈 공간
      )}
    </button>
  );
}
