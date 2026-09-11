"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { CalculatedValue } from "@/components/ui/calculated-value";
import { InfoTooltip } from "@/components/ui/tooltip";
import { DadosMensal, calcularDados } from "@/lib/finance/types";

interface FieldConfig {
  key: keyof DadosMensal;
  label: string;
  tooltip?: string;
}

const EDITABLE_FIELDS: FieldConfig[] = [
  { key: "saldoAnterior", label: "Saldo Anterior" },
  { key: "receitaRepasse", label: "Receita de repasse realizado no mês (Verba)" },
  { key: "rendimentoLiquido", label: "Rendimento líquido de aplicação financeira" },
  { key: "reembolsoEfetuado", label: "Reembolso efetuado de despesas indevidas" },
  { key: "antecipacaoReceitas", label: "Antecipação de receitas" },
  { key: "reembolsoAEfetuar", label: "Reembolso a ser efetuado (Despesa indevida)" },
  { key: "estornoReceitaAntecipada", label: "Estorno de receita antecipada" },
  {
    key: "totalAcumuladoReembolso",
    label: "Total acumulado de reembolso a efetuar",
    tooltip: "Somatório histórico de todos os reembolsos ainda pendentes de efetivação.",
  },
  {
    key: "totalAcumuladoEstorno",
    label: "Total acumulado de estorno a efetuar",
    tooltip: "Somatório histórico de todos os estornos de receita antecipada ainda pendentes.",
  },
];

interface DadosCardProps {
  label: string;
  dados: DadosMensal;
  onChange: (patch: Partial<DadosMensal>) => void;
}

export function DadosCard({ label, dados, onChange }: DadosCardProps) {
  const { subtotal, totalDespesas, saldoAtual } = calcularDados(dados);

  return (
    <div className="animate-fade-in rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(16,24,40,0.06)] dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{label}</h3>
      </div>

      <div className="space-y-3">
        {EDITABLE_FIELDS.map((field) => (
          <div key={String(field.key)} className="grid grid-cols-[1fr_140px] items-center gap-3 sm:grid-cols-[1fr_180px]">
            <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
              {field.label}
              {field.tooltip ? <InfoTooltip text={field.tooltip} /> : null}
            </label>
            <CurrencyInput
              value={dados[field.key] as number}
              onChange={(value) => onChange({ [field.key]: value })}
              ariaLabel={field.label}
            />
          </div>
        ))}
      </div>

      <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_140px] items-center gap-3 sm:grid-cols-[1fr_180px]">
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
            Sub-total
            <InfoTooltip text="Saldo Anterior + Receita + Rendimento + Reembolso efetuado + Antecipação de receitas" />
          </span>
          <CalculatedValue value={subtotal} />
        </div>
        <div className="grid grid-cols-[1fr_140px] items-center gap-3 sm:grid-cols-[1fr_180px]">
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
            Total de despesas
            <InfoTooltip text="Reembolso a ser efetuado + Estorno de receita antecipada" />
          </span>
          <CalculatedValue value={totalDespesas} />
        </div>
        <div className="grid grid-cols-[1fr_140px] items-center gap-3 sm:grid-cols-[1fr_180px]">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
            Saldo atual
            <InfoTooltip text="Sub-total − Total de despesas" />
          </span>
          <CalculatedValue value={saldoAtual} emphasize className="border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300" />
        </div>
      </div>
    </div>
  );
}
