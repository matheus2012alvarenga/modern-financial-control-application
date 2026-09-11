"use client";

import type { SaveStatus } from "@/lib/finance/use-finance-data";

const CONFIG: Record<SaveStatus, { label: string; dot: string; text: string }> = {
  idle: { label: "Sincronizado", dot: "bg-slate-300 dark:bg-slate-600", text: "text-slate-400 dark:text-slate-500" },
  saving: { label: "Salvando...", dot: "bg-amber-400 animate-pulse", text: "text-amber-600 dark:text-amber-400" },
  saved: { label: "Salvo", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  error: { label: "Erro ao salvar", dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
};

export function SaveIndicator({ status }: { status: SaveStatus }) {
  const config = CONFIG[status];
  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${config.text}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}
