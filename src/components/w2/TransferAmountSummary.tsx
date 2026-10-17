import Badge from "../Badge";
import DottedArrowIcon from "../icons/DottedArrowIcon";
import { isCurrencyCode } from "../../constants/currencies";

interface TransferAmountSummaryProps {
  fromCurrency: string;
  toCurrency: string;
  sendAmount: string;
  receiveAmount: string;
}

// 숫자로 변환하지 않아 큰 금액과 소수 금액의 정밀도를 유지합니다.
function formatAmount(amount: string) {
  if (!amount) return "0";
  const [integer, fraction] = amount.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}

function TransferAmountSummary({
  fromCurrency,
  toCurrency,
  sendAmount,
  receiveAmount,
}: TransferAmountSummaryProps) {
  return (
    <div
      aria-label="송금 금액 요약"
      className="flex w-[362px] items-center justify-center gap-gap-12 rounded-medium bg-surface-default p-padding-wide"
    >
      <div className="flex items-center gap-gap-8">
        {isCurrencyCode(fromCurrency) && (
          <Badge currency={fromCurrency} size="sm" aria-hidden="true" />
        )}
        <span className="sr-only">보내는 금액 {fromCurrency}</span>
        <span className="text-body-2-semibold text-text-secondary">
          {formatAmount(sendAmount)}
        </span>
      </div>
      <DottedArrowIcon aria-hidden="true" />
      <div className="flex items-center gap-gap-8">
        {isCurrencyCode(toCurrency) && (
          <Badge currency={toCurrency} size="sm" aria-hidden="true" />
        )}
        <span className="sr-only">받는 금액 {toCurrency}</span>
        <span className="text-body-2-semibold text-text-secondary">
          {formatAmount(receiveAmount)}
        </span>
      </div>
    </div>
  );
}

export default TransferAmountSummary;
