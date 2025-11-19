import InputField from "./InputField";
import type { AddressItem } from "../../apis/routeApi";
import { useState } from "react";

interface Props {
  date: string;
  origin: string;
  destination: string;
  time: string;
  onChangeDate: (value: string) => void;
  onChangeOrigin: (value: string) => void;
  onChangeDestination: (value: string) => void;
  onChangeTime: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  stops: AddressItem[];
  loadingStops: boolean;
  stopError: string | null;
  onSelectOriginStop: (stop: AddressItem) => void;
  onSelectDestinationStop: (stop: AddressItem) => void;
}

export default function HomeRequestForm({
  date,
  origin,
  destination,
  time,
  onChangeDate,
  onChangeOrigin,
  onChangeDestination,
  onChangeTime,
  onSubmit,
  stops,
  loadingStops,
  stopError,
  onSelectOriginStop,
  onSelectDestinationStop,
}: Props) {
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  // 출발지/도착지 자동완성 리스트
  const originSuggestions = stops
    .filter(
      (s) =>
        origin.length > 0 && s.name.toLowerCase().includes(origin.toLowerCase())
    )
    .slice(0, 5);

  const destinationSuggestions = stops
    .filter(
      (s) =>
        destination.length > 0 &&
        s.name.toLowerCase().includes(destination.toLowerCase())
    )
    .slice(0, 5);

  const handleSelectOrigin = (stop: AddressItem) => {
    // 인풋 텍스트 세팅
    onChangeOrigin(stop.name);
    // 선택된 정류장 정보(id 포함) 위로 올리기
    onSelectOriginStop(stop);
    setShowOriginDropdown(false);
  };

  const handleSelectDestination = (stop: AddressItem) => {
    onChangeDestination(stop.name);
    onSelectDestinationStop(stop);
    setShowDestinationDropdown(false);
  };

  return (
    <div className="px-4 py-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <InputField
            variant="date"
            placeholder="날짜 입력"
            type="date"
            value={date}
            onChange={(e) => onChangeDate(e.target.value)}
          />

          {/* 출발지 + 자동완성 */}
          <div className="relative">
            <InputField
              variant="origin"
              placeholder={
                loadingStops
                  ? "정류장 정보를 불러오는 중..."
                  : "출발지 정류장 검색"
              }
              value={origin}
              onChange={(e) => {
                onChangeOrigin(e.target.value);
                setShowOriginDropdown(true);
              }}
            />

            {showOriginDropdown && originSuggestions.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-gray-200 rounded-[8px] shadow">
                {originSuggestions.map((stop) => (
                  <li key={stop.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectOrigin(stop)}
                      className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-100"
                    >
                      {stop.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 도착지 + 자동완성 */}
          <div className="relative">
            <InputField
              variant="destination"
              placeholder={
                loadingStops
                  ? "정류장 정보를 불러오는 중..."
                  : "도착지 정류장 검색"
              }
              value={destination}
              onChange={(e) => {
                onChangeDestination(e.target.value);
                setShowDestinationDropdown(true);
              }}
            />

            {showDestinationDropdown && destinationSuggestions.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-gray-200 rounded-[8px] shadow">
                {destinationSuggestions.map((stop) => (
                  <li key={stop.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectDestination(stop)}
                      className="w-full text-left px-3 py-2 text-[13px] hover:bg-gray-100"
                    >
                      {stop.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <InputField
            variant="time"
            placeholder="희망 출발 시간"
            type="time"
            value={time}
            onChange={(e) => onChangeTime(e.target.value)}
          />
        </div>

        {stopError && <p className="text-xs text-red-500">{stopError}</p>}

        <button
          type="submit"
          className="w-full h-12 rounded-[10px] bg-[#007CFF] leading-[150%] text-white text-[14px] font-[600] active:scale-[0.99] transition"
        >
          노선 요청하기
        </button>
      </form>
    </div>
  );
}
