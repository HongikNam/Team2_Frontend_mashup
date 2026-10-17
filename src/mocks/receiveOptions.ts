import type { ApiResponse, ReceiveOptionsResult } from "../types/receiveOption";

// 오늘로부터 days 일 뒤 날짜를 "YYYY-MM-DD" 로 만듭니다. (날짜가 지나도 항상 같은 간격으로 보이게)
function daysFromToday(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// 받는 방법 리스트 조회 API 응답 예시입니다.
// 나중에 api 연동시 이 파일을 지우고, import 하는 곳을 API 응답으로 교체하면 됩니다.
//
// 탭별 정렬 확인용으로 값을 다르게 넣었습니다. (ATM카드는 추천이라 항상 맨 위)
// 환율 마진은 모두 0 이라 받는 총액(totalAmount)은 1,000,000 × 19.03 으로 모두 같습니다.
//  - 좋은 환율(rateMargin↑):  마진이 모두 같아서 API 순서 그대로
//  - 빠른 도착(arrivalDate↑): ZaloPay > MoMo > 현금 수령 > 은행
//  - 낮은 수수료(fixedFee↑):  현금 수령 > 은행 > MoMo > ZaloPay
// 가장 경제적 뱃지(fixedFee 최저): 현금 수령
export const MOCK_RECEIVE_OPTIONS_RESPONSE: ApiResponse<ReceiveOptionsResult> =
  {
    isSuccess: true,
    code: "RECEIVE-OPTION200_1",
    message: "받는 방법 리스트 조회에 성공하였습니다.",
    result: {
      sendCurrency: "KRW",
      receiveCurrency: "VND",
      sendAmount: 1000000,
      options: [
        {
          methodType: "CARD",
          methodProvider: "ATM",
          methodName: "ATM카드",
          speedType: "EXPRESS",
          fixedFee: 5000,
          rateMargin: 0,
          totalAmount: 19030000,
          transferTime: "15분 ~ 1일",
          arrivalDate: daysFromToday(0),
          badges: ["RECOMMENDED"],
        },
        {
          methodType: "BANK",
          methodProvider: "NONE",
          methodName: "은행",
          speedType: "STANDARD",
          fixedFee: 2500,
          rateMargin: 0,
          totalAmount: 19030000,
          transferTime: "영업일 2~3일",
          arrivalDate: daysFromToday(3),
        },
        {
          methodType: "WALLET",
          methodProvider: "MOMO",
          methodName: "MoMo",
          speedType: "EXPRESS",
          fixedFee: 3500,
          rateMargin: 0,
          totalAmount: 19030000,
          transferTime: "1시간 ~ 1일",
          arrivalDate: daysFromToday(1),
        },
        {
          methodType: "CASH",
          methodProvider: "PICKUP",
          methodName: "현금 수령",
          speedType: "STANDARD",
          fixedFee: 1500,
          rateMargin: 0,
          totalAmount: 19030000,
          transferTime: "영업일 1~2일",
          arrivalDate: daysFromToday(2),
        },
        {
          methodType: "WALLET",
          methodProvider: "ZALOPAY",
          methodName: "ZaloPay",
          speedType: "EXPRESS",
          fixedFee: 4000,
          rateMargin: 0,
          totalAmount: 19030000,
          transferTime: "15분 ~ 1시간",
          arrivalDate: daysFromToday(0),
        },
      ],
    },
  };
