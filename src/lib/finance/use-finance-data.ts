"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ConvenioKey,
  DadosMensal,
  LancamentoData,
  calcularDados,
  emptyDadosMensal,
  previousCompetencia,
} from "./types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type LancamentoTipo = "rendimentos" | "devolucoes";

type DadosMap = Record<ConvenioKey, DadosMensal>;
type LancMap = Record<ConvenioKey, LancamentoData[]>;

function toNum(v: unknown): number {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
}

interface DadosRow {
  id: string;
  ano: number;
  mes: number;
  convenio: ConvenioKey;
  saldo_anterior: unknown;
  receita_repasse: unknown;
  rendimento_liquido: unknown;
  reembolso_efetuado: unknown;
  antecipacao_receitas: unknown;
  reembolso_a_efetuar: unknown;
  estorno_receita_antecipada: unknown;
  total_acumulado_reembolso: unknown;
  total_acumulado_estorno: unknown;
}

interface LancamentoRow {
  id: string;
  convenio: ConvenioKey;
  data: string;
  valor: unknown;
}

function rowToDados(row: DadosRow): DadosMensal {
  return {
    id: row.id,
    ano: row.ano,
    mes: row.mes,
    convenio: row.convenio,
    saldoAnterior: toNum(row.saldo_anterior),
    receitaRepasse: toNum(row.receita_repasse),
    rendimentoLiquido: toNum(row.rendimento_liquido),
    reembolsoEfetuado: toNum(row.reembolso_efetuado),
    antecipacaoReceitas: toNum(row.antecipacao_receitas),
    reembolsoAEfetuar: toNum(row.reembolso_a_efetuar),
    estornoReceitaAntecipada: toNum(row.estorno_receita_antecipada),
    totalAcumuladoReembolso: toNum(row.total_acumulado_reembolso),
    totalAcumuladoEstorno: toNum(row.total_acumulado_estorno),
  };
}

function dadosToRow(d: DadosMensal, userId: string) {
  return {
    user_id: userId,
    ano: d.ano,
    mes: d.mes,
    convenio: d.convenio,
    saldo_anterior: d.saldoAnterior,
    receita_repasse: d.receitaRepasse,
    rendimento_liquido: d.rendimentoLiquido,
    reembolso_efetuado: d.reembolsoEfetuado,
    antecipacao_receitas: d.antecipacaoReceitas,
    reembolso_a_efetuar: d.reembolsoAEfetuar,
    estorno_receita_antecipada: d.estornoReceitaAntecipada,
    total_acumulado_reembolso: d.totalAcumuladoReembolso,
    total_acumulado_estorno: d.totalAcumuladoEstorno,
    updated_at: new Date().toISOString(),
  };
}

function rowToLancamento(row: LancamentoRow): LancamentoData {
  return { id: row.id, data: row.data, valor: toNum(row.valor) };
}

function tableName(tipo: LancamentoTipo) {
  return tipo === "rendimentos" ? "financeiro_rendimentos" : "financeiro_devolucoes";
}

export function useFinanceData(userId: string, ano: number, mes: number) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [dados, setDados] = useState<DadosMap>({
    grp: emptyDadosMensal(ano, mes, "grp"),
    gpcop: emptyDadosMensal(ano, mes, "gpcop"),
  });
  const [anteriores, setAnteriores] = useState<Partial<DadosMap>>({});
  const [rendimentos, setRendimentos] = useState<LancMap>({ grp: [], gpcop: [] });
  const [devolucoes, setDevolucoes] = useState<LancMap>({ grp: [], gpcop: [] });

  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const prev = previousCompetencia(ano, mes);

    const [dadosRes, prevRes, rendRes, devRes] = await Promise.all([
      supabase.from("financeiro_dados").select("*").eq("ano", ano).eq("mes", mes),
      supabase.from("financeiro_dados").select("*").eq("ano", prev.ano).eq("mes", prev.mes),
      supabase
        .from("financeiro_rendimentos")
        .select("*")
        .eq("ano", ano)
        .eq("mes", mes)
        .order("data", { ascending: true }),
      supabase
        .from("financeiro_devolucoes")
        .select("*")
        .eq("ano", ano)
        .eq("mes", mes)
        .order("data", { ascending: true }),
    ]);

    const nextDados: DadosMap = {
      grp: emptyDadosMensal(ano, mes, "grp"),
      gpcop: emptyDadosMensal(ano, mes, "gpcop"),
    };
    (dadosRes.data as DadosRow[] | null)?.forEach((row) => {
      nextDados[row.convenio] = rowToDados(row);
    });

    const nextAnteriores: Partial<DadosMap> = {};
    (prevRes.data as DadosRow[] | null)?.forEach((row) => {
      nextAnteriores[row.convenio] = rowToDados(row);
    });

    const nextRend: LancMap = { grp: [], gpcop: [] };
    (rendRes.data as LancamentoRow[] | null)?.forEach((row) => {
      nextRend[row.convenio].push(rowToLancamento(row));
    });

    const nextDev: LancMap = { grp: [], gpcop: [] };
    (devRes.data as LancamentoRow[] | null)?.forEach((row) => {
      nextDev[row.convenio].push(rowToLancamento(row));
    });

    setDados(nextDados);
    setAnteriores(nextAnteriores);
    setRendimentos(nextRend);
    setDevolucoes(nextDev);
    setLoading(false);
  }, [ano, mes, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const persistDados = useCallback(
    (convenio: ConvenioKey, value: DadosMensal) => {
      setStatus("saving");
      const key = `dados-${convenio}`;
      if (saveTimers.current[key]) clearTimeout(saveTimers.current[key]);
      saveTimers.current[key] = setTimeout(async () => {
        const row = dadosToRow(value, userId);
        const { data, error } = await supabase
          .from("financeiro_dados")
          .upsert(row, { onConflict: "user_id,ano,mes,convenio" })
          .select()
          .single();
        if (!error && data) {
          setDados((prev) => ({ ...prev, [convenio]: rowToDados(data as DadosRow) }));
          setStatus("saved");
        } else {
          setStatus("error");
        }
      }, 650);
    },
    [supabase, userId],
  );

  const updateDados = useCallback(
    (convenio: ConvenioKey, patch: Partial<DadosMensal>) => {
      setDados((prev) => {
        const updated = { ...prev[convenio], ...patch };
        persistDados(convenio, updated);
        return { ...prev, [convenio]: updated };
      });
    },
    [persistDados],
  );

  const aplicarNovoMes = useCallback(() => {
    (Object.keys(dados) as ConvenioKey[]).forEach((convenio) => {
      const anterior = anteriores[convenio];
      if (!anterior) return;
      const { saldoAtual } = calcularDados(anterior);
      updateDados(convenio, { saldoAnterior: saldoAtual });
    });
  }, [anteriores, dados, updateDados]);

  const addLancamento = useCallback(
    async (tipo: LancamentoTipo, convenio: ConvenioKey) => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from(tableName(tipo))
        .insert({ user_id: userId, ano, mes, convenio, data: today, valor: 0 })
        .select()
        .single();
      if (!error && data) {
        const setter = tipo === "rendimentos" ? setRendimentos : setDevolucoes;
        setter((prev) => ({
          ...prev,
          [convenio]: [...prev[convenio], rowToLancamento(data as LancamentoRow)],
        }));
      }
    },
    [ano, mes, supabase, userId],
  );

  const updateLancamento = useCallback(
    (tipo: LancamentoTipo, convenio: ConvenioKey, id: string, patch: Partial<LancamentoData>) => {
      const setter = tipo === "rendimentos" ? setRendimentos : setDevolucoes;
      setter((prev) => ({
        ...prev,
        [convenio]: prev[convenio].map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }));

      const key = `${tipo}-${id}`;
      setStatus("saving");
      if (saveTimers.current[key]) clearTimeout(saveTimers.current[key]);
      saveTimers.current[key] = setTimeout(async () => {
        const { data: dataField, valor } = patch;
        const updatePayload: Record<string, unknown> = {};
        if (dataField !== undefined) updatePayload.data = dataField;
        if (valor !== undefined) updatePayload.valor = valor;
        const { error } = await supabase.from(tableName(tipo)).update(updatePayload).eq("id", id);
        setStatus(error ? "error" : "saved");
      }, 650);
    },
    [supabase],
  );

  const removeLancamento = useCallback(
    async (tipo: LancamentoTipo, convenio: ConvenioKey, id: string) => {
      const setter = tipo === "rendimentos" ? setRendimentos : setDevolucoes;
      setter((prev) => ({ ...prev, [convenio]: prev[convenio].filter((item) => item.id !== id) }));
      await supabase.from(tableName(tipo)).delete().eq("id", id);
    },
    [supabase],
  );

  return {
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
    reload: load,
  };
}
