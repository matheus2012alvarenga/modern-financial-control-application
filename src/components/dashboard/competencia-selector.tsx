"use client";

import { MESES } from "@/lib/finance/types";

interface CompetenciaSelectorProps {
  ano: number;
  mes: number;
  onChange: (ano: number, mes: number) => void;
  onNovoMes: () => void;
}

export function CompetenciaSelector({ ano, mes, onChange, onNovoMes }: CompetenciaSelectorProps) {
  const anos = Array.from({ length: 9 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="animate-fade-in flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Competência</label>
        <select
          value={mes}
          onChange={(e) => onChange(ano, Number(e.target.value))}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {MESES.map((label, idx) => (
            <option key={label} value={idx + 1}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={ano}
          onChange={(e) => onChange(Number(e.target.value), mes)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {anos.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onNovoMes}
        title="Copia o Saldo Atual do mês anterior para o Saldo Anterior deste mês"
        className="ml-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Novo mês
      </button>
    </div>
  );
}
