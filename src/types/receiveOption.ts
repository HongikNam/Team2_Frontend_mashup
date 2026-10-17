// 받는 방법 리스트 조회 API(RECEIVE-OPTION) 응답 타입입니다.

export type SpeedType = "EXPRESS" | "STANDARD";

export interface ReceiveOption {
  methodType: string; // ex. "CARD", "BANK"
  methodProvider: string; // ex. "ATM", "VISA", "NONE"
  methodName: string; // 화면에 보이는 이름 ex. "은행"
  speedType: SpeedType;
  fixedFee: number;
  rateMargin: number;
  totalAmount: number;
  transferTime: string; // ex. "15분 ~ 1일"
  arrivalDate: string; // "YYYY-MM-DD"
  badges?: string[]; // ex. ["RECOMMENDED"], 없으면 필드가 빠져서 옴
}

export interface ReceiveOptionsResult {
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  options: ReceiveOption[];
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 카드 key 로 쓰는 값입니다. (API 에 id 가 없어서 methodType + methodProvider 조합 사용)
export const getReceiveOptionKey = (option: ReceiveOption) =>
  `${option.methodType}-${option.methodProvider}`;
