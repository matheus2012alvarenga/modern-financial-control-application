"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { CompetenciaSelector } from "@/components/dashboard/competencia-selector";
import { Tabs, type TabKey } from "@/components/dashboard/tabs";
import { TabContent } from "@/components/dashboard/tab-content";
import { DadosTab } from "@/components/dashboard/dados-tab";
import { AnaliseTab } from "@/components/dashboard/analise-tab";
import { SaveIndicator } from "@/components/ui/save-indicator";
import { ExportButtons } from "@/components/dashboard/export-buttons";
import { useFinanceData } from "@/lib/finance/use-finance-data";
import { exportCSV, exportJSON } from "@/lib/finance/export";

interface DashboardProps {
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export function Dashboard({ userId, email, name, avatarUrl }: DashboardProps) {
  const now = new Date();
  const [ano, setAno] = useState(now.getFullYear());
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [tab, setTab] = useState<TabKey>("dados");

  const {
    loading,
    status,
    dados,
    anteriores,
    rendimentos,
    devolucoes,
    updateDados,
    aplicarNovoMes,
    addLancamento,
    updateLancamento,
    removeLancamento,
  } = useFinanceData(userId, ano, mes);

  function handleCompetenciaChange(nextAno: number, nextMes: number) {
    setAno(nextAno);
    setMes(nextMes);
  }

  return (
    <div className="min-h-screen">
      <Header email={email} name={name} avatarUrl={avatarUrl} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <CompetenciaSelector ano={ano} mes={mes} onChange={handleCompetenciaChange} onNovoMes={aplicarNovoMes} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs active={tab} onChange={setTab} />
          <div className="flex items-center gap-4">
            <SaveIndicator status={status} />
            <ExportButtons
              onExportCSV={() => exportCSV({ ano, mes, dados, rendimentos, devolucoes })}
              onExportJSON={() => exportJSON({ ano, mes, dados, rendimentos, devolucoes })}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : (
          <TabContent tabKey={tab}>
            {tab === "dados" ? (
              <DadosTab dados={dados} onUpdate={updateDados} />
            ) : (
              <AnaliseTab
                ano={ano}
                mes={mes}
                dados={dados}
                anteriores={anteriores}
                rendimentos={rendimentos}
                devolucoes={devolucoes}
                onAddLancamento={addLancamento}
                onUpdateLancamento={updateLancamento}
                onRemoveLancamento={removeLancamento}
              />
            )}
          </TabContent>
        )}
      </main>
    </div>
  );
}
