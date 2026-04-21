import { KyotoFlowLogo } from "@/components/ui/KyotoFlowLogo";
import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-[var(--color-bg)]">
      <header
        className="flex items-center gap-3 h-14 px-4 shrink-0 border-b border-[var(--color-border)] bg-[var(--color-surface)]"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <KyotoFlowLogo />
        <div>
          <h1 className="text-sm font-semibold leading-none text-[var(--color-text)]">
            Kyoto Flow
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Live congestion map
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-[var(--color-text-muted)]">
            Live (mock)
          </span>
        </div>
      </header>

      <main className="flex-1 h-0 overflow-hidden">{children}</main>
    </div>
  );
}
