import { useState } from "react";
import { Navigate } from "react-router";
import Header from "../components/Header";
import ExchangeRate from "../components/ExchangeRate";
import TransferAmountFields from "../components/TransferAmountFields";
import TransferAmountSummary from "../components/w2/TransferAmountSummary";
import CurrencySelectSheet from "../components/CurrencySelectSheet";
import TransferMethodTab, {
  type TransferMethodTabValue,
} from "../components/w2/TransferMethodTab";
import ReceiveMethodCard from "../components/w2/ReceiveMethodCard";
import Button from "../components/Button";
import { MOCK_RECEIVE_OPTIONS_RESPONSE } from "../mocks/receiveOptions";
import { getReceiveOptionKey } from "../types/receiveOption";
import { sortReceiveOptions } from "../utils/sortReceiveOptions";
import {
  getEconomicalOptionKey,
  getOptionBadges,
} from "../utils/receiveOptionBadges";
import { getMockQuote, getMockRate } from "../mocks/exchangeRates";
import {
  useTransferStore,
  type TransferInfo,
} from "../stores/useTransferStore";
import { PATHS } from "../routes/paths";
import {
  MIN_SEND_AMOUNT_MESSAGE,
  isBelowMinimum,
  isValidAmount,
} from "../utils/transferAmount";

type TransferInput = Pick<
  TransferInfo,
  "fromCurrency" | "toCurrency" | "sendAmount"
>;

// 송금액 입력 및 받는 방법 선택 페이지 (W-2)
function TransferPage() {
  // 홈에서 송금하기를 눌렀을 때 저장한 송금 정보입니다. 이 페이지에서 바꾸면 바로 store 에 반영됩니다.
  const transfer = useTransferStore((state) => state.transfer);
  const setTransfer = useTransferStore((state) => state.setTransfer);
  const [openSheet, setOpenSheet] = useState<"from" | "to" | null>(null);
  const [methodTab, setMethodTab] = useState<TransferMethodTabValue>("rate");
  // 받는 방법 목록을 내리면 금액 카드를 한 줄 요약으로 줄이고, 맨 위로 올리면 다시 펼칩니다.
  const [collapsed, setCollapsed] = useState(false);
  const receiveOptions = MOCK_RECEIVE_OPTIONS_RESPONSE.result;
  // 선택한 받는 방법 카드의 key 입니다. 처음에는 아무것도 선택되지 않고, 카드를 누르면 선택됩니다.
  const [selectedMethodKey, setSelectedMethodKey] = useState<string | null>(
    null,
  );

  // 홈을 거치지 않고 들어오면 송금 정보가 없으므로 홈으로 돌려보냅니다.
  if (!transfer) return <Navigate to={PATHS.HOME} replace />;

  // 금액·통화가 바뀌면 환율과 받는 금액을 다시 계산해서 store 에 저장합니다.
  // 금액이 비었거나 0, 또는 KRW 5,000 미만이면 받는 방법 카드를 error 상태로 보여줍니다.
  const hasAmountError = (input: TransferInput) =>
    !isValidAmount(input.sendAmount) ||
    isBelowMinimum(input.fromCurrency, input.sendAmount);
  const amountError = hasAmountError(transfer);

  // error 가 아니고 카드를 하나 골랐을 때만 "다음" 버튼이 활성화됩니다.
  const selectedOption = amountError
    ? undefined
    : receiveOptions.options.find(
        (option) => getReceiveOptionKey(option) === selectedMethodKey,
      );
  const sendAmount = Number(transfer.sendAmount) || 0;
  // "가장 경제적" 뱃지를 붙일 카드 (받는 돈이 가장 많은 카드)
  const economicalKey = getEconomicalOptionKey(receiveOptions.options);

  // 선택한 받는 방법을 store 에 저장하고 다음 화면으로 이동합니다.
  const handleNext = () => {
    if (!selectedOption) return;
    setTransfer({ ...transfer, receiveMethod: selectedOption });
    // TODO: W-3 수취인 정보 페이지가 생기면 navigate 로 교체
    alert("수취인 정보 페이지 준비 중");
  };

  const updateTransfer = (patch: Partial<TransferInput>) => {
    const next = { ...transfer, ...patch };
    // error 가 되면 선택한 카드를 풀어줍니다.
    if (hasAmountError(next)) setSelectedMethodKey(null);
    const quote = getMockQuote({ region: "overseas", ...next });
    setTransfer({
      ...next,
      rate: getMockRate(next.fromCurrency, next.toCurrency) ?? next.rate,
      receiveAmount: quote?.receiveAmount ?? "",
    });
  };

  return (
    // 헤더 · 금액 영역 · 하단 버튼은 고정하고, 탭 + 받는 방법 목록만 스크롤됩니다.
    <div className="flex h-dvh flex-col items-center overflow-hidden bg-[#F6F8FB]">
      <Header>
        <ExchangeRate
          fromCurrency={transfer.fromCurrency}
          toCurrency={transfer.toCurrency}
          rate={transfer.rate}
        />
      </Header>

      <main className="flex min-h-0 w-[402px] flex-1 flex-col">
        <section className="flex shrink-0 flex-col gap-gap-12 px-[20px] py-padding-wide">
          {collapsed ? (
            <TransferAmountSummary
              fromCurrency={transfer.fromCurrency}
              toCurrency={transfer.toCurrency}
              sendAmount={transfer.sendAmount}
              receiveAmount={transfer.receiveAmount}
            />
          ) : (
            <TransferAmountFields
              variant="card"
              fromCurrency={transfer.fromCurrency}
              toCurrency={transfer.toCurrency}
              sendAmount={transfer.sendAmount}
              receiveAmount={transfer.receiveAmount}
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
          className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-surface-default"
        >
          <TransferMethodTab
            value={methodTab}
            onChange={setMethodTab}
            className="sticky top-0 z-10"
          />
          {/* TODO: API 연동 시 받는 방법 리스트 조회 응답으로 교체 */}
          <div
            role="radiogroup"
            aria-label="받는 방법"
            className="flex flex-1 flex-col items-center gap-gap-16 px-[20px] py-padding-wide"
          >
            {sortReceiveOptions(receiveOptions.options, methodTab).map(
              (option) => (
                <ReceiveMethodCard
                  key={getReceiveOptionKey(option)}
                  option={option}
                  sendAmount={sendAmount}
                  sendCurrency={receiveOptions.sendCurrency}
                  selected={getReceiveOptionKey(option) === selectedMethodKey}
                  error={amountError}
                  badges={getOptionBadges(option, economicalKey)}
                  // TODO: 자세히 보기 모달로 교체
                  onDetailClick={() =>
                    alert(`${option.methodName} 자세히 보기 (모달 준비 중)`)
                  }
                  onSelect={() =>
                    setSelectedMethodKey(getReceiveOptionKey(option))
                  }
                />
              ),
            )}
          </div>
        </section>
      </main>

      {/* 하단 버튼: 화면 아래에 고정 */}
      <footer className="flex w-[402px] shrink-0 flex-col bg-surface-default">
        <div className="flex h-[108px] shrink-0 flex-col items-start px-[20px] py-padding-wide">
          {selectedOption ? (
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
        </div>
        {/* 높이용 빈칸 */}
        <div aria-hidden="true" className="h-(--unit-24)" />
      </footer>

      <CurrencySelectSheet
        open={openSheet === "from"}
        onClose={() => setOpenSheet(null)}
        title="보내는 국가 / 통화"
        value={transfer.fromCurrency}
        onChange={(fromCurrency) => updateTransfer({ fromCurrency })}
        disabledCurrencies={["VND"]}
      />
      <CurrencySelectSheet
        open={openSheet === "to"}
        onClose={() => setOpenSheet(null)}
        title="받는 국가 / 통화"
        value={transfer.toCurrency}
        onChange={(toCurrency) => updateTransfer({ toCurrency })}
        searchable
      />
    </div>
  );
}

export default TransferPage;
