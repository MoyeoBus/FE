import LocationIcon from "../../assets/icons/LocationIcon";
import bell from "../../assets/bell.svg";

interface Props {
  address: string;
  onClickNotification: () => void;
  onClickHistory: () => void;
}

export default function HomeHeader({
  address,
  onClickNotification,
  onClickHistory,
}: Props) {
  return (
    <div className="flex items-end justify-between pt-4 pb-3 px-4">
      <p className="text-[18px] leading-[150%] font-[500] text-[#212529]">
        안녕하세요, <span className="font-[700]">{address}</span>에서
        <br />
        이동을 시작해볼까요?
      </p>
      <div className="flex flex-col items-end gap-3">
        <button type="button" onClick={onClickNotification}>
          <img src={bell} alt="bell" className="mr-1" />
        </button>
        <button
          type="button"
          onClick={onClickHistory}
          className="flex items-center h-7 pl-2 pr-3 text-[12px] leading-[150%] text-[#007CFF] font-normal rounded-[5px] border border-[#007CFF] bg-[#fff]"
        >
          <LocationIcon className="mr-1 w-[15px] h-[15px]" />
          생성된 노선
        </button>
      </div>
    </div>
  );
}
