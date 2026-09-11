"use client";

import { AnaliseCard } from "@/components/dashboard/analise-card";
import {
  CONVENIOS,
  ConvenioKey,
  DadosMensal,
  LancamentoData,
  MESES,
  calcularAnalise,
} from "@/lib/finance/types";
import type { LancamentoTipo } from "@/lib/finance/use-finance-data";

interface AnaliseTabProps {
  ano: number;
  mes: number;
  dados: Record<ConvenioKey, DadosMensal>;
  anteriores: Partial<Record<ConvenioKey, DadosMensal>>;
  rendimentos: Record<ConvenioKey, LancamentoData[]>;
  devolucoes: Record<ConvenioKey, LancamentoData[]>;
  onAddLancamento: (tipo: LancamentoTipo, convenio: ConvenioKey) => void;
  onUpdateLancamento: (
    tipo: LancamentoTipo,
    convenio: ConvenioKey,
    id: string,
    patch: Partial<LancamentoData>,
  ) => void;
  onRemoveLancamento: (tipo: LancamentoTipo, convenio: ConvenioKey, id: string) => void;
}

export function AnaliseTab({
  ano,
  mes,
  dados,
  anteriores,
  rendimentos,
  devolucoes,
  onAddLancamento,
  onUpdateLancamento,
  onRemoveLancamento,
}: AnaliseTabProps) {
  const mesLabel = `${MESES[mes - 1]}/${ano}`;

  return (
    <div className="space-y-6">
      {CONVENIOS.map(({ key, label }) => {
        const analise = calcularAnalise({
          atual: dados[key],
          anterior: anteriores[key],
          rendimentos: rendimentos[key],
          devolucoes: devolucoes[key],
        });

        return (
          <AnaliseCard
            key={key}
            label={label}
            mesLabel={mesLabel}
            analise={analise}
            rendimentos={rendimentos[key]}
            devolucoes={devolucoes[key]}
            onAddRendimento={() => onAddLancamento("rendimentos", key)}
            onUpdateRendimento={(id, patch) => onUpdateLancamento("rendimentos", key, id, patch)}
            onRemoveRendimento={(id) => onRemoveLancamento("rendimentos", key, id)}
            onAddDevolucao={() => onAddLancamento("devolucoes", key)}
            onUpdateDevolucao={(id, patch) => onUpdateLancamento("devolucoes", key, id, patch)}
            onRemoveDevolucao={(id) => onRemoveLancamento("devolucoes", key, id)}
          />
        );
      })}
    </div>
  );
}
