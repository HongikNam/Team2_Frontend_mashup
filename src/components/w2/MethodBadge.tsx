import type { MethodBadgeType } from "../../utils/receiveOptionBadges";

const BADGE_STYLES: Record<MethodBadgeType, { label: string; style: string }> =
  {
    recommended: {
      label: "추천",
      style: "bg-surface-focused text-text-informative",
    },
    economical: {
      label: "가장 경제적",
      style: "bg-surface-success text-text-success",
    },
  };

interface MethodBadgeProps {
  type: MethodBadgeType;
}

// 받는 방법 카드의 뱃지입니다. 추천은 파랑, 가장 경제적은 초록으로 출력됩니다.
function MethodBadge({ type }: MethodBadgeProps) {
  const { label, style } = BADGE_STYLES[type];

  return (
    <span
      className={`inline-flex items-center gap-gap-2 rounded-small px-padding-large py-padding-small text-body-5-semibold ${style}`}
    >
      {label}
    </span>
  );
}

export default MethodBadge;
