import type { TransferMethodTabValue } from "../components/w2/TransferMethodTab";
import type { ReceiveOption } from "../types/receiveOption";

const isRecommended = (option: ReceiveOption) =>
  option.badges?.includes("RECOMMENDED") ?? false;

// 탭별 정렬 기준입니다. (음수면 a 가 앞)
const COMPARE_BY_TAB: Record<
  TransferMethodTabValue,
  (a: ReceiveOption, b: ReceiveOption) => number
> = {
  // 좋은 환율: 환율 마진이 작은 순
  rate: (a, b) => a.rateMargin - b.rateMargin,
  // 빠른 도착: 도착일이 빠른 순 ("YYYY-MM-DD" 라 문자열 비교로 충분)
  speed: (a, b) => a.arrivalDate.localeCompare(b.arrivalDate),
  // 낮은 수수료: 고정 수수료가 작은 순
  fee: (a, b) => a.fixedFee - b.fixedFee,
};

// 추천 뱃지가 있는 카드는 어느 탭이든 맨 위, 나머지는 탭 기준으로 정렬합니다.
// 기준 값이 같으면 API 가 준 순서를 그대로 유지합니다.
export function sortReceiveOptions(
  options: readonly ReceiveOption[],
  tab: TransferMethodTabValue,
) {
  return [...options].sort((a, b) => {
    const recommended = Number(isRecommended(b)) - Number(isRecommended(a));
    return recommended !== 0 ? recommended : COMPARE_BY_TAB[tab](a, b);
  });
}
