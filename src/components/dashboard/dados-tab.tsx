"use client";

import { CONVENIOS, ConvenioKey, DadosMensal } from "@/lib/finance/types";
import { DadosCard } from "@/components/dashboard/dados-card";

interface DadosTabProps {
  dados: Record<ConvenioKey, DadosMensal>;
  onUpdate: (convenio: ConvenioKey, patch: Partial<DadosMensal>) => void;
}

export function DadosTab({ dados, onUpdate }: DadosTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {CONVENIOS.map(({ key, label }) => (
        <DadosCard key={key} label={label} dados={dados[key]} onChange={(patch) => onUpdate(key, patch)} />
      ))}
    </div>
  );
}
