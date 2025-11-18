import date from "../../assets/miniCalendar.svg";
import departure from "../../assets/departure.svg";
import destination from "../../assets/destination.svg";
import timeToStart from "../../assets/time.svg";
import type { InputHTMLAttributes } from "react";

type Variant = "date" | "origin" | "destination" | "time";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  variant: Variant;
}

export default function InputField({ variant, autoComplete, ...rest }: Props) {
  const type = (rest.type ?? "text") as string;
  const needsOverlay = type === "date" || type === "time";
  const v = rest.value as string | undefined;
  const showOverlay = needsOverlay && (!v || v.length === 0);
  const overlayText = (rest.placeholder as string) ?? "";

  // 값이 비어 있을 때 네이티브 마스크(년-월-일, 시:분 등) 숨기기
  const hideNativeMaskClass = showOverlay
    ? // Chrome/Edge(Android) WebKit 계열 전용
      "[&::-webkit-datetime-edit]:text-transparent"
    : "";

  return (
    <label className="relative block">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">
        <Icon variant={variant} />
      </span>

      <input
        {...rest}
        autoComplete={autoComplete ?? "off"}
        className={`w-full h-12 pl-10 pr-3 rounded-[10px] border border-[#CED4DA] text-[14px] text-[#111827] placeholder-[#CED4DA] outline-none focus:ring-1 focus:ring-[#1976F4]/20 focus:border-[#1976F4] transition ${hideNativeMaskClass}`}
      />

      {showOverlay && (
        <span className="pointer-events-none absolute left-10 right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#CED4DA] truncate">
          {overlayText}
        </span>
      )}
    </label>
  );
}

function Icon({ variant }: { variant: Variant }) {
  switch (variant) {
    case "date":
      return <img src={date} alt="date" />;
    case "origin":
      return <img src={departure} alt="origin" />;
    case "destination":
      return <img src={destination} alt="destination" />;
    case "time":
      return <img src={timeToStart} alt="time" />;
    default:
      return null;
  }
}
