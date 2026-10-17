import { useState } from "react";
import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";
import MyWallet from "../components/w1/MyWallet";
import CardTransfer, {
  type TransferDraft,
  type TransferQuote,
} from "../components/w1/CardTransfer";
import CurrencySelectSheet from "../components/CurrencySelectSheet";
import { getMockQuote, getMockRate } from "../mocks/exchangeRates";
import { useTransferStore } from "../stores/useTransferStore";
import { PATHS } from "../routes/paths";

// 임시 잔액입니다. API 연동 시 계좌 잔액 응답값으로 교체합니다.
const MOCK_WALLET_BALANCE = 10000;

function HomePage() {
  // TODO: API 연동 시 과거 이력 기준으로 카드들 변경 시키는 기능 추가하기
  const [draft, setDraft] = useState<TransferDraft>({
    region: "overseas",
    fromCurrency: "KRW",
    toCurrency: "VND",
    sendAmount: "",
  });
  const [openSheet, setOpenSheet] = useState<"from" | "to" | null>(null);
  const setTransfer = useTransferStore((state) => state.setTransfer);
  const navigate = useNavigate();

  const quote = getMockQuote(draft);

  // 송금 정보를 전역 상태에 저장하고 다음 화면으로 이동합니다.
  const handleSubmit = (
    submitted: TransferDraft,
    submittedQuote?: TransferQuote,
  ) => {
    if (!submittedQuote) return;
    setTransfer({
      fromCurrency: submitted.fromCurrency,
      toCurrency: submitted.toCurrency,
      rate: submittedQuote.rate,
      sendAmount: submitted.sendAmount,
      receiveAmount: submittedQuote.receiveAmount,
    });
    navigate(PATHS.TRANSFER);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F6F8FB]">
      <main className="flex flex-1 flex-col items-center gap-gap-12 px-[20px] py-padding-wide">
        <MyWallet balance={MOCK_WALLET_BALANCE} />
        {/* API 연결 시 quote, 로딩/오류 상태, onSubmit을 전달합니다. */}
        <CardTransfer
          value={draft}
          onChange={setDraft}
          walletBalance={MOCK_WALLET_BALANCE.toLocaleString("ko-KR")}
          quote={quote}
          indicativeRate={getMockRate(draft.fromCurrency, draft.toCurrency)}
          // 해외일 때만 송금하기를 활성화합니다.
          onSubmit={draft.region === "overseas" ? handleSubmit : undefined}
          onFromCurrencyClick={() => setOpenSheet("from")}
          onToCurrencyClick={() => setOpenSheet("to")}
        />
      </main>
      <NavBar />

      <CurrencySelectSheet
        open={openSheet === "from"}
        onClose={() => setOpenSheet(null)}
        title="보내는 국가 / 통화"
        value={draft.fromCurrency}
        onChange={(fromCurrency) => setDraft({ ...draft, fromCurrency })}
        disabledCurrencies={["VND"]}
      />
      <CurrencySelectSheet
        open={openSheet === "to"}
        onClose={() => setOpenSheet(null)}
        title="받는 국가 / 통화"
        value={draft.toCurrency}
        onChange={(toCurrency) => setDraft({ ...draft, toCurrency })}
        searchable
      />
    </div>
  );
}
export default HomePage;
