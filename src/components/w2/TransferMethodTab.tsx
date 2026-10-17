import type { ComponentPropsWithoutRef } from "react";

const TAB_OPTIONS = [
  { value: "rate", label: "좋은 환율" },
  { value: "speed", label: "빠른 도착" },
  { value: "fee", label: "낮은 수수료" },
] as const;

export type TransferMethodTabValue = (typeof TAB_OPTIONS)[number]["value"];

interface TransferMethodTabProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "onChange"
> {
  value: TransferMethodTabValue;
  onChange: (value: TransferMethodTabValue) => void;
}

// 받는 방법 정렬 탭입니다. value 와 같은 탭만 검정 굵은 글자 + 밑줄로, 나머지는 회색으로 출력됩니다.
function TransferMethodTab({
  value,
  onChange,
  className = "",
  ...props
}: TransferMethodTabProps) {
  return (
    <div
      role="tablist"
      className={`flex w-[402px] bg-surface-default px-[20px] ${className}`}
      {...props}
    >
      {TAB_OPTIONS.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={`flex cursor-pointer items-center justify-center border-b-2 px-padding-large pt-padding-wide pb-padding-large ${selected ? "border-border-bold text-body-3-regular font-bold text-text-default" : "border-transparent text-body-3-regular text-text-tertiary"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default TransferMethodTab;
