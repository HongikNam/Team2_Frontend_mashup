import type { ComponentPropsWithoutRef } from "react";

function BackIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M20 12L4 12M11 5L4 12L11 19"
        stroke="var(--icon-strong)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BackIcon;
