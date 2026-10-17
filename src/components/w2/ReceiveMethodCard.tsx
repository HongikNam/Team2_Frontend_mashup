import type { ComponentPropsWithoutRef } from "react";
import type { ReceiveOption } from "../../types/receiveOption";
import ArrivalIcon from "../icons/ArrivalIcon";
import CheckIcon from "../icons/CheckIcon";
import MethodBadge from "./MethodBadge";
import type { MethodBadgeType } from "../../utils/receiveOptionBadges";

interface ReceiveMethodCardProps extends ComponentPropsWithoutRef<"div"> {
  option: ReceiveOption;
  sendAmount: number;
  sendCurrency: string;
  selected?: boolean;
  onSelect?: () => void;
  onDetailClick?: () => void;
  error?: boolean;
  badges?: MethodBadgeType[];
}

// "2026-10-15" 가 오늘인지 확인합니다.
function isTodayDate(arrivalDate: string) {
  const [year, month, day] = arrivalDate.split("-").map(Number);
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  );
}

// 오늘이면 "오늘 도착", 아니면 "10/15 도착"
function formatArrival(arrivalDate: string) {
  const [, month, day] = arrivalDate.split("-").map(Number);
  return isTodayDate(arrivalDate) ? "오늘 도착" : `${month}/${day} 도착`;
}

const formatAmount = (amount: number, currency: string) =>
  `${amount.toLocaleString("ko-KR")} ${currency}`;

// 받는 방법 카드입니다. 점선 기준 위: 도착 날짜 / 받는 방법 / 수수료, 아래: 보내는 금액 + 수수료
// selected 면 파란 테두리 + 그림자 + 파란 체크, 아니면 회색 테두리 + 회색 체크로 출력됩니다.
// error 면 (금액이 비었거나 최소 금액 미만) 수수료·아래 구역·체크 대신 안내 문구만 보이고 선택할 수 없습니다.
function ReceiveMethodCard({
  option,
  sendAmount,
  sendCurrency,
  selected = false,
  onSelect,
  onDetailClick,
  error = false,
  badges = [],
  className = "",
  ...props
}: ReceiveMethodCardProps) {
  const isSelected = selected && !error;

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      aria-disabled={error}
      tabIndex={error ? -1 : 0}
      onClick={error ? undefined : onSelect}
      onKeyDown={(event) => {
        if (error) return;
        // 카드 안의 "자세히 보기" 버튼에서 누른 키는 버튼이 처리하도록 넘깁니다.
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.();
        }
      }}
      className={`flex w-[362px] flex-col items-start rounded-medium border bg-surface-default ${error ? "cursor-default opacity-50" : "cursor-pointer"} ${isSelected ? "border-border-focused shadow-[0_0_10px_0_rgba(0,100,255,0.10)]" : error ? "border-border-default shadow-[0_0_10px_0_rgba(0,0,0,0.10)]" : "border-border-default"} ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between self-stretch p-padding-wide">
        <div className="flex flex-col">
          <div className="flex items-center gap-gap-2 text-body-4-semibold text-text-tertiary">
            {formatArrival(option.arrivalDate)}
            <ArrivalIcon
              today={isTodayDate(option.arrivalDate)}
              aria-hidden="true"
            />
          </div>
          <div className="mt-(--unit-8) flex items-center gap-gap-8">
            <span className="text-body-1-bold text-text-secondary">
              {option.methodName}
            </span>
            {badges.map((badge) => (
              <MethodBadge key={badge} type={badge} />
            ))}
          </div>
          {error ? (
            <span className="mt-(--unit-16) text-body-4-semibold text-text-alert">
              금액을 입력하거나 받는 방법을 변경해주세요.
            </span>
          ) : (
            <span className="mt-(--unit-16) text-heading-1-semibold text-text-default">
              {formatAmount(option.fixedFee, sendCurrency)}
            </span>
          )}
        </div>
        {!error && <CheckIcon active={isSelected} aria-hidden="true" />}
      </div>

      {!error && (
        <>
          {/* TODO: 점선 스타일 확인 필요 (임시: 연한 회색 1px, 선 4px · 간격 4px) */}
          <div className="h-px self-stretch bg-[repeating-linear-gradient(to_right,var(--border-default)_0_4px,transparent_4px_8px)]" />

          <div className="flex flex-col items-start gap-gap-8 self-stretch p-padding-wide">
            <div className="flex items-center justify-between self-stretch">
              <span className="text-body-4-regular text-text-tertiary">
                보내는 금액 + 수수료
              </span>
              <span className="text-body-3-semibold text-text-default">
                {formatAmount(sendAmount + option.fixedFee, sendCurrency)}
              </span>
            </div>
            {isSelected && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDetailClick?.();
                }}
                className="cursor-pointer text-body-5-semibold text-text-tertiary underline underline-offset-auto"
              >
                자세히 보기
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ReceiveMethodCard;
