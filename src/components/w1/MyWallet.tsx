import type { ComponentPropsWithoutRef } from "react";

interface MyWalletProps extends ComponentPropsWithoutRef<"div"> {
  balance: number;
}

// 충전, 출금은 구현 범위 밖이라 누르면 안내 alert 만 띄웁니다.
function showOutOfScopeAlert() {
  alert("구현 범위 밖입니다.");
}

function MyWallet({ balance, className = "", ...props }: MyWalletProps) {
  return (
    <div
      className={`flex w-[362px] shrink-0 flex-col items-start justify-center self-stretch rounded-medium bg-surface-default p-padding-wide ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between self-stretch px-padding-small">
        <div className="flex flex-col gap-gap-4">
          <span className="text-body-2-semibold text-text-secondary">월렛</span>
          <span className="text-title-1-bold text-text-default">
            {balance.toLocaleString("ko-KR")}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-gap-8 self-stretch">
        <button
          type="button"
          onClick={showOutOfScopeAlert}
          className="cursor-pointer text-body-5-semibold text-text-secondary"
        >
          충전
        </button>
        <div className="h-[18px] w-px bg-surface-disabled" />
        <button
          type="button"
          onClick={showOutOfScopeAlert}
          className="cursor-pointer text-body-5-semibold text-text-secondary"
        >
          출금
        </button>
      </div>
    </div>
  );
}

export default MyWallet;
