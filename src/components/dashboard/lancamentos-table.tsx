"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { LancamentoData, formatCurrency } from "@/lib/finance/types";

interface LancamentosTableProps {
  title: string;
  tooltip?: string;
  items: LancamentoData[];
  totalLabel: string;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<LancamentoData>) => void;
  onRemove: (id: string) => void;
}

export function LancamentosTable({
  title,
  items,
  totalLabel,
  onAdd,
  onUpdate,
  onRemove,
}: LancamentosTableProps) {
  const total = items.reduce((acc, item) => acc + item.valor, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/30">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 dark:border-indigo-500/40 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
        >
          + Adicionar
        </button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
            Nenhum lançamento adicionado.
          </p>
        ) : null}
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
            <input
              type="date"
              value={item.data}
              onChange={(e) => onUpdate(item.id, { data: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
            <CurrencyInput
              value={item.valor}
              onChange={(value) => onUpdate(item.id, { valor: value })}
              className="py-1.5 text-xs"
            />
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label="Remover lançamento"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-slate-700 dark:hover:bg-rose-950/40"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
        <span>{totalLabel}</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
