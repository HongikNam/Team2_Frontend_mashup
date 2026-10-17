import Toggle, { type ToggleValue } from "./Toggle";
import ExchangeRate from "../ExchangeRate";
import Button from "../Button";
import Wallet from "../icons/Wallet";
import TransferAmountFields from "../TransferAmountFields";
import {
  MIN_SEND_AMOUNT_MESSAGE,
  isBelowMinimum,
  isValidAmount,
} from "../../utils/transferAmount";

export interface TransferDraft {
  region: ToggleValue;
  fromCurrency: string;
  toCurrency: string;
  sendAmount: string;
}

// 금액은 문자열로 유지합니다. 실제 송금 금액과 수수료는 서버 견적을 사용하세요.
export interface TransferQuote {
  id: string;
  sendAmount: string;
  fromCurrency: string;
  toCurrency: string;
  receiveAmount: string;
  rate: number;
}

interface CardTransferProps {
  value: TransferDraft;
  onChange: (value: TransferDraft) => void;
  onFromCurrencyClick?: () => void;
  onToCurrencyClick?: () => void;
  walletBalance: string;
  quote?: TransferQuote;
  indicativeRate?: number;
  isQuoteLoading?: boolean;
  isSubmitting?: boolean;
  error?: string;
  onSubmit?: (draft: TransferDraft, quote?: TransferQuote) => void;
}

function CardTransfer({
  value,
  onChange,
  onFromCurrencyClick,
  onToCurrencyClick,
  walletBalance,
  quote,
  indicativeRate,
  isQuoteLoading = false,
  isSubmitting = false,
  error,
  onSubmit,
}: CardTransferProps) {
  const overseas = value.region === "overseas";
  const validAmount = isValidAmount(value.sendAmount);
  const belowMinimum = isBelowMinimum(value.fromCurrency, value.sendAmount);
  // 이전 입력에 대한 응답은 현재 금액에 표시하거나 제출하지 않습니다.
  const currentQuote =
    quote?.sendAmount === value.sendAmount &&
    quote.fromCurrency === value.fromCurrency &&
    quote.toCurrency === value.toCurrency
      ? quote
      : undefined;
  const rate = currentQuote?.rate ?? indicativeRate;
  const blocked =
    isSubmitting ||
    isQuoteLoading ||
    Boolean(error) ||
    !onSubmit ||
    (overseas && (!validAmount || belowMinimum || !currentQuote));

  return (
    <form
      aria-label="송금"
      aria-busy={isSubmitting || isQuoteLoading}
      onSubmit={(event) => {
        event.preventDefault();
        if (!blocked) onSubmit?.(value, overseas ? currentQuote : undefined);
      }}
      className="flex w-[362px] max-w-full flex-col gap-gap-12 rounded-medium bg-surface-default p-padding-wide"
    >
      <fieldset
        disabled={isSubmitting}
        className="m-0 flex min-w-0 flex-col gap-gap-12 border-0 p-0"
      >
        <div className="flex items-center justify-between px-padding-small">
          <span className="text-body-2-semibold text-text-secondary">송금</span>
          <Toggle
            value={value.region}
            onChange={(region) => onChange({ ...value, region })}
          />
        </div>
        <div className="flex min-h-[180px] flex-col justify-center gap-gap-12">
          {overseas ? (
            <>
              {rate !== undefined && (
                <ExchangeRate
                  fromCurrency={value.fromCurrency}
                  toCurrency={value.toCurrency}
                  rate={rate}
                  className="w-full"
                />
              )}
              <TransferAmountFields
                fromCurrency={value.fromCurrency}
                toCurrency={value.toCurrency}
                sendAmount={value.sendAmount}
                receiveAmount={currentQuote?.receiveAmount ?? ""}
                onSendAmountChange={(sendAmount) =>
                  onChange({ ...value, sendAmount })
                }
                onFromCurrencyClick={onFromCurrencyClick}
                onToCurrencyClick={onToCurrencyClick}
                helperText={belowMinimum ? MIN_SEND_AMOUNT_MESSAGE : undefined}
              />
            </>
          ) : (
            <div className="flex flex-col items-center gap-gap-12">
              <div className="flex items-center gap-gap-8">
                <Wallet aria-hidden="true" />
                <span className="text-body-1-bold text-text-secondary">
                  월렛
                </span>
              </div>
              <span className="text-title-1-bold text-text-default">
                {walletBalance} KRW
              </span>
            </div>
          )}
        </div>
        {isQuoteLoading && (
          <p role="status" className="text-body-2-semibold">
            견적을 조회하고 있습니다.
          </p>
        )}
        {error && (
          <p role="alert" className="text-body-2-semibold text-text-alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          size="md"
          className="max-w-full self-center"
          disabled={blocked}
        >
          {isSubmitting ? "처리 중…" : "송금하기"}
        </Button>
      </fieldset>
    </form>
  );
}
export default CardTransfer;
