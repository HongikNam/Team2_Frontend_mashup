import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import Header from "../components/Header";
import ExchangeRate from "../components/ExchangeRate";
import TransferAmountFields from "../components/TransferAmountFields";
import TransferAmountSummary from "../components/w2/TransferAmountSummary";
import CurrencySelectSheet from "../components/CurrencySelectSheet";
import TransferMethodTab, {
  type TransferMethodTabValue,
} from "../components/w2/TransferMethodTab";
import ReceiveMethodCard from "../components/w2/ReceiveMethodCard";
import ReceiveMethodDetailModal from "../components/w2/ReceiveMethodDetailModal";
import {
  getMockReceiveNotices,
  RECEIVE_METHOD_DETAIL_SECTIONS,
} from "../mocks/receiveMethodDetails";
import Button from "../components/Button";
import {
  getReceiveMethodKey,
  getReceiveOptionKey,
  isSelectableOption,
  type ReceiveOption,
} from "../types/receiveOption";
import { SORT_BY_TAB, sortReceiveOptions } from "../utils/sortReceiveOptions";
import { useReceiveOptions } from "../hooks/useReceiveOptions";
import { useReceiveOptionDetails } from "../hooks/useReceiveOptionDetails";
import { toPlanSections } from "../utils/receiveOptionDetail";
import {
  getEconomicalOptionKey,
  getOptionBadges,
} from "../utils/receiveOptionBadges";
import { getQuoteFromExchangeRate } from "../utils/exchangeRate";
import {
  useTransferStore,
  type TransferInfo,
} from "../stores/useTransferStore";
import { PATHS } from "../routes/paths";
import { useExchangeRate } from "../hooks/useExchangeRate";
import {
  MIN_SEND_AMOUNT_MESSAGE,
  isBelowMinimum,
  isValidAmount,
} from "../utils/transferAmount";

type TransferInput = Pick<
  TransferInfo,
  "fromCurrency" | "toCurrency" | "sendAmount"
>;

// 금액이 비었거나 0, 또는 KRW 5,000 미만이면 받는 방법 카드를 error 상태로 보여줍니다.
const hasAmountError = (input: TransferInput) =>
  !isValidAmount(input.sendAmount) ||
  isBelowMinimum(input.fromCurrency, input.sendAmount);

// 송금액 입력 및 받는 방법 선택 페이지 (W-2)
function TransferPage() {
  // 홈에서 송금하기를 눌렀을 때 저장한 송금 정보입니다. 이 페이지에서 바꾸면 바로 store 에 반영됩니다.
  const transfer = useTransferStore((state) => state.transfer);
  // 헤더 환율 칩용 환율입니다. (홈을 거치지 않아 transfer 가 없을 때도 훅 순서를 지키려고 기본값 사용)
  const { data: exchangeRate } = useExchangeRate(
    transfer?.fromCurrency ?? "KRW",
    transfer?.toCurrency ?? "VND",
  );
  const setTransfer = useTransferStore((state) => state.setTransfer);
  const navigate = useNavigate();
  const [openSheet, setOpenSheet] = useState<"from" | "to" | null>(null);
  const [methodTab, setMethodTab] = useState<TransferMethodTabValue>("rate");
  // 받는 방법 목록 (탭에 맞는 서버 정렬 기준으로 조회)
  const { data: receiveOptionsData, isLoading: isOptionsLoading } =
    useReceiveOptions(
      transfer?.fromCurrency ?? "KRW",
      transfer?.toCurrency ?? "VND",
      transfer?.sendAmount ?? "",
      SORT_BY_TAB[methodTab],
    );
  // 받는 방법 목록을 내리면 금액 카드를 한 줄 요약으로 줄이고, 맨 위로 올리면 다시 펼칩니다.
  const [collapsed, setCollapsed] = useState(false);
  const [detailOption, setDetailOption] = useState<ReceiveOption | null>(null);
  // 자세히 보기 모달이 열려 있을 때만 그 방법의 속도별 요금제를 불러옵니다.
  const { data: detail } = useReceiveOptionDetails(
    detailOption && transfer
      ? {
          receiveCurrency: transfer.toCurrency,
          methodType: detailOption.methodType,
          methodProvider: detailOption.methodProvider,
        }
      : null,
  );
  // 선택한 받는 방법 카드의 key 입니다. 처음에는 아무것도 선택되지 않고, 카드를 누르면 선택됩니다.
  const [selectedMethodKey, setSelectedMethodKey] = useState<string | null>(
    null,
  );

  // 홈을 거치지 않고 들어오면 송금 정보가 없으므로 홈으로 돌려보냅니다.
  if (!transfer) return <Navigate to={PATHS.HOME} replace />;

  // 선택 불가 옵션(unselectableReason)은 금액 정보가 없고 디자인도 없어서 걸러냅니다.
  const receiveOptions = (receiveOptionsData?.options ?? []).filter(
    isSelectableOption,
  );

  const amountError = hasAmountError(transfer);

  // error 가 아니고 카드를 하나 골랐을 때만 "다음" 버튼이 활성화됩니다.
  const selectedOption = amountError
    ? undefined
    : receiveOptions.find(
        (option) => getReceiveOptionKey(option) === selectedMethodKey,
      );
  const sendAmount = Number(transfer.sendAmount) || 0;
  // 받는 금액은 지금 통화 조합의 환율 API 결과로 매번 계산합니다.
  // (통화를 바꾼 직후 새 환율을 불러오는 동안은 견적이 없어 0 으로 보입니다)
  const quote = getQuoteFromExchangeRate(
    { region: "overseas", ...transfer },
    exchangeRate,
  );
  // 카드를 고르면 서버가 계산한 그 방법의 받는 금액(totalAmount, 마진 반영)을, 고르기 전에는 환율 계산값을 보여줍니다.
  const receiveAmount = selectedOption
    ? String(selectedOption.totalAmount)
    : (quote?.receiveAmount ?? "");
  // "가장 경제적" 뱃지를 붙일 카드 (고정 수수료가 가장 낮은 카드)
  const economicalKey = getEconomicalOptionKey(receiveOptions);

  // 금액을 바꾼 직후 새 목록이 오기 전에는 이전 금액 기준 카드라서 "다음"을 막습니다.
  const canProceed = selectedOption !== undefined && !isOptionsLoading;

  // 선택한 받는 방법과 그 시점의 환율 · 받는 금액을 store 에 저장하고 다음 화면으로 이동합니다.
  const handleNext = () => {
    if (!canProceed) return;
    setTransfer({
      ...transfer,
      rate: quote?.rate ?? transfer.rate,
      receiveAmount,
      receiveMethod: selectedOption,
    });
    navigate(PATHS.INFORMATION);
  };

  const updateTransfer = (patch: Partial<TransferInput>) => {
    const next = { ...transfer, ...patch };
    // error 가 되면 선택한 카드를 풀어줍니다.
    const currencyChanged =
      next.fromCurrency !== transfer.fromCurrency ||
      next.toCurrency !== transfer.toCurrency;
    if (hasAmountError(next) || currencyChanged) setSelectedMethodKey(null);
    // 환율 · 받는 금액은 화면에서 계산하고, "다음"을 누를 때 store 에 저장합니다.
    setTransfer({ ...next, receiveMethod: undefined });
  };

  return (
    // 헤더 · 금액 영역 · 하단 버튼은 고정하고, 탭 + 받는 방법 목록만 스크롤됩니다.
    <div className="flex h-dvh flex-col items-center overflow-hidden bg-[#F6F8FB]">
      <Header>
        {exchangeRate && (
          <ExchangeRate
            fromCurrency={exchangeRate.from}
            toCurrency={exchangeRate.to}
            rate={exchangeRate.rate}
          />
        )}
      </Header>

      <main className="flex min-h-0 w-[402px] flex-1 flex-col">
        <section className="flex shrink-0 flex-col gap-gap-12 px-[20px] py-padding-wide">
          {collapsed ? (
            <TransferAmountSummary
              fromCurrency={transfer.fromCurrency}
              toCurrency={transfer.toCurrency}
              sendAmount={transfer.sendAmount}
              receiveAmount={receiveAmount}
            />
          ) : (
            <TransferAmountFields
              variant="card"
              fromCurrency={transfer.fromCurrency}
              toCurrency={transfer.toCurrency}
              sendAmount={transfer.sendAmount}
              receiveAmount={receiveAmount}
              onSendAmountChange={(sendAmount) =>
                updateTransfer({ sendAmount })
              }
              onFromCurrencyClick={() => setOpenSheet("from")}
              onToCurrencyClick={() => setOpenSheet("to")}
              helperText={
                isBelowMinimum(transfer.fromCurrency, transfer.sendAmount)
                  ? MIN_SEND_AMOUNT_MESSAGE
                  : undefined
              }
            />
          )}
        </section>

        <section
          onScroll={(event) => {
            const { scrollTop } = event.currentTarget;
            if (scrollTop > 0 && !collapsed) setCollapsed(true);
            if (scrollTop === 0 && collapsed) setCollapsed(false);
          }}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-surface-default"
        >
          <TransferMethodTab
            value={methodTab}
            onChange={setMethodTab}
            className="sticky top-0 z-10"
          />
          <div
            role="radiogroup"
            aria-label="받는 방법"
            className="flex flex-1 flex-col items-center gap-gap-16 px-[20px] py-padding-wide"
          >
            {sortReceiveOptions(receiveOptions).map((option) => (
              <ReceiveMethodCard
                key={getReceiveOptionKey(option)}
                option={option}
                sendAmount={sendAmount}
                sendCurrency={transfer.fromCurrency}
                selected={getReceiveOptionKey(option) === selectedMethodKey}
                error={amountError}
                badges={getOptionBadges(option, economicalKey)}
                onDetailClick={() => setDetailOption(option)}
                onSelect={() =>
                  setSelectedMethodKey(getReceiveOptionKey(option))
                }
              />
            ))}
          </div>
        </section>
      </main>

      {/* 하단 버튼: 화면 아래에 고정 */}
      <footer className="flex w-[402px] shrink-0 flex-col bg-surface-default px-[20px] pt-padding-wide pb-[calc(var(--unit-24)+env(safe-area-inset-bottom))]">
        {canProceed ? (
          <Button size="lg" className="flex-col" onClick={handleNext}>
            <span>다음</span>
            <span className="text-body-5-regular">
              총 출금액{" "}
              {(sendAmount + selectedOption.fixedFee).toLocaleString("ko-KR")}{" "}
              {transfer.fromCurrency}
            </span>
          </Button>
        ) : (
          <Button size="lg" disabled>
            확인
          </Button>
        )}
      </footer>

      {detailOption && (
        <ReceiveMethodDetailModal
          methodName={detailOption.methodName}
          notices={getMockReceiveNotices(
            transfer.fromCurrency,
            transfer.toCurrency,
          )}
          // API 의 속도별 요금제 + (있으면) 방법별 추가 안내 목데이터
          sections={[
            ...toPlanSections(detail?.plans ?? [], transfer.fromCurrency),
            ...(RECEIVE_METHOD_DETAIL_SECTIONS[
              getReceiveMethodKey(detailOption)
            ] ?? []),
          ]}
          onClose={() => setDetailOption(null)}
        />
      )}

      <CurrencySelectSheet
        open={openSheet === "from"}
        onClose={() => setOpenSheet(null)}
        title="보내는 국가 / 통화"
        value={transfer.fromCurrency}
        onChange={(fromCurrency) => {
          updateTransfer({ fromCurrency });
          setOpenSheet(null);
        }}
        disabledCurrencies={["VND", "SGD", "IDR"]}
      />
      <CurrencySelectSheet
        open={openSheet === "to"}
        onClose={() => setOpenSheet(null)}
        title="받는 국가 / 통화"
        value={transfer.toCurrency}
        onChange={(toCurrency) => {
          updateTransfer({ toCurrency });
          setOpenSheet(null);
        }}
        searchable
      />
    </div>
  );
}

export default TransferPage;
