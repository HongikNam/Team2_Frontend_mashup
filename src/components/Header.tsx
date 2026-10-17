import type { ComponentPropsWithoutRef } from "react";
import { useNavigate } from "react-router";
import BackIcon from "./icons/BackIcon";

interface HeaderProps extends ComponentPropsWithoutRef<"header"> {
  title?: string;
  onBack?: () => void;
}

// 왼쪽 뒤로가기 + 가운데 내용으로 구성된 헤더입니다.
// title 을 넣으면 제목 글자로, children 을 넣으면 그대로(ex. 환율 칩) 가운데에 출력됩니다.
function Header({
  title,
  onBack,
  children,
  className = "",
  ...props
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={`flex h-(--unit-60) w-[402px] items-center justify-between px-gap-16 py-gap-8 ${className}`}
      {...props}
    >
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={onBack ?? (() => navigate(-1))}
        className="shrink-0 cursor-pointer"
      >
        <BackIcon aria-hidden="true" />
      </button>
      <div className="flex min-w-0 flex-1 justify-center">
        {title && (
          <h1 className="text-center text-title-1-bold text-text-default">
            {title}
          </h1>
        )}
        {children}
      </div>
      {/* 가운데 내용이 정중앙에 오도록 뒤로가기 버튼과 같은 너비의 빈 공간을 둡니다. */}
      <span aria-hidden="true" className="size-6 shrink-0" />
    </header>
  );
}

export default Header;
