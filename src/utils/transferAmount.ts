// 홈(CardTransfer)과 송금 페이지에서 같이 쓰는 송금 금액 검사입니다.
export const MIN_SEND_AMOUNT_KRW = 5_000;
export const MIN_SEND_AMOUNT_MESSAGE = "최소 송금액은 5,000 KRW입니다.";

// 0 이 아닌 숫자(소수 포함)인지 확인합니다.
export function isValidAmount(amount: string) {
  return /^\d+(?:\.\d+)?$/.test(amount) && /[1-9]/.test(amount);
}

// 보내는 통화가 KRW 일 때 최소 송금액 미만인지 확인합니다.
export function isBelowMinimum(fromCurrency: string, amount: string) {
  return (
    fromCurrency === "KRW" &&
    (amount === "" || Number(amount) < MIN_SEND_AMOUNT_KRW)
  );
}
