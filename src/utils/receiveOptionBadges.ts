import {
  getReceiveOptionKey,
  type ReceiveOption,
} from "../types/receiveOption";

// recommended: 백엔드가 주는 뱃지 (RECOMMENDED) / economical: 프론트에서 계산해서 붙이는 뱃지
export type MethodBadgeType = "recommended" | "economical";

// 고정 수수료(fixedFee)가 가장 낮은 카드의 key 입니다. 같은 값이 여러 개면 먼저 온 카드 하나만 고릅니다.
export function getEconomicalOptionKey(options: readonly ReceiveOption[]) {
  const best = options.reduce<ReceiveOption | undefined>(
    (acc, option) => (!acc || option.fixedFee < acc.fixedFee ? option : acc),
    undefined,
  );
  return best ? getReceiveOptionKey(best) : null;
}

// 카드에 붙일 뱃지 목록입니다. 둘 다 해당하면 추천 → 가장 경제적 순서로 연달아 붙습니다.
export function getOptionBadges(
  option: ReceiveOption,
  economicalKey: string | null,
): MethodBadgeType[] {
  const badges: MethodBadgeType[] = [];
  if (option.badges?.includes("RECOMMENDED")) badges.push("recommended");
  if (getReceiveOptionKey(option) === economicalKey) badges.push("economical");
  return badges;
}
