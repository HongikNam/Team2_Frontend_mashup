import type { ComponentPropsWithoutRef } from "react";
import { NavLink } from "react-router";
import { PATHS } from "../routes/paths";
import HomeIcon from "./icons/HomeIcon";
import HistoryIcon from "./icons/HistoryIcon";
import CustomerIcon from "./icons/CustomerIcon";
import MyIcon from "./icons/MyIcon";

const NAV_ITEMS = [
  { label: "홈", Icon: HomeIcon, path: PATHS.HOME },
  { label: "내역", Icon: HistoryIcon, path: PATHS.HISTORY },
  { label: "고객센터", Icon: CustomerIcon, path: PATHS.CUSTOMER },
  { label: "My", Icon: MyIcon, path: PATHS.MY },
];

// 현재 URL 과 path 가 같은 탭만 파란 아이콘 + 검정 라벨로, 나머지는 회색으로 출력됩니다.
function NavBar({ className = "", ...props }: ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      className={`flex w-[402px] items-center justify-center gap-(--unit-56) bg-surface-default px-margin-large pt-padding-large pb-[8px] ${className}`}
      {...props}
    >
      {NAV_ITEMS.map(({ label, Icon, path }) => (
        <NavLink
          key={path}
          to={path}
          end
          className="flex w-[35px] shrink-0 flex-col items-center gap-gap-4"
        >
          {({ isActive }) => (
            <>
              <Icon active={isActive} />
              <span
                className={`text-center text-caption-1-semibold whitespace-nowrap ${isActive ? "text-text-default" : "text-text-disabled"}`}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default NavBar;
