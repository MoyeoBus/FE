import { useNavigate } from "react-router-dom";
import back from "../assets/back.svg";
import bell from "../assets/bell.svg";
import type { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
  onBackClick?: () => void;
  showBell?: boolean;
  title?: string;
};

export default function PageLayout({
  children,
  onBackClick,
  showBell = true,
  title,
}: PageLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full max-w-sm pt-8 pb-[70px] px-5">
        <header className="flex items-center justify-between mb-4 mt-5">
          <button onClick={handleBack}>
            <img src={back} alt="back" />
          </button>
          {title ? (
            <h1 className="text-[18px] font-[600]">{title}</h1>
          ) : (
            <div />
          )}
          {showBell && (
            <button>
              <img src={bell} alt="bell" />
            </button>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}
