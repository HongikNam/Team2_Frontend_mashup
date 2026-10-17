import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ReceiveOption } from "../types/receiveOption";

// 홈에서 송금하기를 눌렀을 때 다음 화면들로 넘길 송금 정보입니다.
export interface TransferInfo {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  sendAmount: string;
  receiveAmount: string;
  receiveMethod?: ReceiveOption; // 송금 페이지에서 "다음"을 누를 때 선택한 받는 방법
}

interface TransferState {
  transfer: TransferInfo | null;
  setTransfer: (transfer: TransferInfo) => void;
  resetTransfer: () => void;
}

// 새로고침해도 값이 남도록 sessionStorage 에 저장합니다. (탭을 닫으면 사라짐)
export const useTransferStore = create<TransferState>()(
  persist(
    (set) => ({
      transfer: null,
      setTransfer: (transfer) => set({ transfer }),
      resetTransfer: () => set({ transfer: null }),
    }),
    {
      name: "transfer",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
