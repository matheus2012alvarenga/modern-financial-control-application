"use client";

import { LancamentosTable } from "@/components/dashboard/lancamentos-table";
import { InfoTooltip } from "@/components/ui/tooltip";
import { CalculatedValue } from "@/components/ui/calculated-value";
import { formatCurrency, type AnaliseCalculada, type LancamentoData } from "@/lib/finance/types";

interface AnaliseCardProps {
  label: string;
  mesLabel: string;
  analise: AnaliseCalculada;
  rendimentos: LancamentoData[];
  devolucoes: LancamentoData[];
  onAddRendimento: () => void;
  onUpdateRendimento: (id: string, patch: Partial<LancamentoData>) => void;
  onRemoveRendimento: (id: string) => void;
  onAddDevolucao: () => void;
  onUpdateDevolucao: (id: string, patch: Partial<LancamentoData>) => void;
  onRemoveDevolucao: (id: string) => void;
}

export function AnaliseCard({
  label,
  mesLabel,
  analise,
  rendimentos,
  devolucoes,
  onAddRendimento,
  onUpdateRendimento,
  onRemoveRendimento,
  onAddDevolucao,
  onUpdateDevolucao,
  onRemoveDevolucao,
}: AnaliseCardProps) {
  const faltaDevolverPositivo = analise.faltaDevolver > 0.004;

  return (
    <div className="animate-fade-in rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(16,24,40,0.06)] dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{label}</h3>
        <span className="ml-auto text-xs font-medium text-slate-400 dark:text-slate-500">{mesLabel}</span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <th className="px-4 py-2.5">Mês Anterior</th>
              <th className="px-4 py-2.5">Mês Atual</th>
              <th className="px-4 py-2.5">
                <span className="flex items-center gap-1">
                  Análise
                  <InfoTooltip text="Mês anterior (reembolso a efetuar) + reembolso a efetuar (mês atual) − reembolso efetuado" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100 dark:border-slate-800">
              <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">
                {formatCurrency(analise.mesAnteriorReembolsoAEfetuar)}
              </td>
              <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">
                {formatCurrency(analise.reembolsoAEfetuarAtual)}
              </td>
              <td className="px-4 py-2.5 font-semibold text-indigo-600 dark:text-indigo-400">
                {formatCurrency(analise.analise)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/30">
          <p className="text-xs text-slate-500 dark:text-slate-400">A · Saldo atual</p>
          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {formatCurrency(analise.saldoAtual)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/30">
          <p className="text-xs text-slate-500 dark:text-slate-400">B · Total reembolso a efetuar</p>
          <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {formatCurrency(analise.totalReembolsoAEfetuarAcumulado)}
          </p>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <p className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-300">
            A + B
            <InfoTooltip text="Saldo atual + Total de reembolso a efetuar acumulado" />
          </p>
          <p className="mt-1 text-sm font-semibold text-indigo-700 dark:text-indigo-200">
            {formatCurrency(analise.aMaisB)}
          </p>
        </div>
      </div>

      <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <LancamentosTable
          title="Rendimentos Meses Subsequentes"
          items={rendimentos}
          totalLabel="Total (E)"
          onAdd={onAddRendimento}
          onUpdate={onUpdateRendimento}
          onRemove={onRemoveRendimento}
        />
        <LancamentosTable
          title="Devoluções ao Município"
          items={devolucoes}
          totalLabel="Total (D)"
          onAdd={onAddDevolucao}
          onUpdate={onUpdateDevolucao}
          onRemove={onRemoveDevolucao}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="flex items-center justify-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            F = C − D
            <InfoTooltip text="F = Saldo atual (C) − Total de Devoluções ao Município (D)" />
          </p>
          <div className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
            <CalculatedValue value={analise.f} className="border-none bg-transparent p-0 text-2xl font-bold" />
          </div>
        </div>
        <div
          className={`rounded-2xl border p-5 text-center transition-colors ${
            faltaDevolverPositivo
              ? "border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10"
              : "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          }`}
        >
          <p
            className={`flex items-center justify-center gap-1 text-xs font-medium uppercase tracking-wide ${
              faltaDevolverPositivo
                ? "text-rose-500 dark:text-rose-300"
                : "text-emerald-600 dark:text-emerald-300"
            }`}
          >
            Falta Devolver (E + F)
            <InfoTooltip text="Falta Devolver = Total Rendimentos Meses Subsequentes (E) + F. Vermelho indica pendência, verde indica quitado." />
          </p>
          <p
            className={`mt-2 text-2xl font-bold ${
              faltaDevolverPositivo
                ? "text-rose-600 dark:text-rose-300"
                : "text-emerald-700 dark:text-emerald-300"
            }`}
          >
            {formatCurrency(analise.faltaDevolver)}
          </p>
        </div>
      </div>
    </div>
  );
}
