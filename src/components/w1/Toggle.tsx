import type { ComponentPropsWithoutRef } from "react";

const TOGGLE_OPTIONS = [
  { value: "overseas", label: "해외" },
  { value: "domestic", label: "국내" },
] as const;

export type ToggleValue = (typeof TOGGLE_OPTIONS)[number]["value"];

interface ToggleProps extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  value: ToggleValue;
  onChange: (value: ToggleValue) => void;
}

// value 와 같은 옵션만 흰 배경 + 검정 글자로, 나머지는 회색 글자로 출력됩니다.
function Toggle({ value, onChange, className = "", ...props }: ToggleProps) {
  return (
    <div
      role="radiogroup"
      className={`flex h-(--unit-44) w-[155px] items-start justify-center gap-gap-4 rounded-small bg-surface-subtle py-padding-small pr-[3px] pl-padding-small ${className}`}
      {...props}
    >
      {TOGGLE_OPTIONS.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`flex h-(--unit-36) w-[72px] shrink-0 cursor-pointer items-center justify-center rounded-small px-padding-wide py-padding-medium text-body-2-semibold whitespace-nowrap ${selected ? "bg-surface-default text-text-default" : "text-text-tertiary"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default Toggle;
