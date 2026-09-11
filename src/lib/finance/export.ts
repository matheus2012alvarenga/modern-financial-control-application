import { CONVENIOS, ConvenioKey, DadosMensal, LancamentoData, calcularDados, formatCurrency } from "./types";

interface ExportPayload {
  ano: number;
  mes: number;
  dados: Record<ConvenioKey, DadosMensal>;
  rendimentos: Record<ConvenioKey, LancamentoData[]>;
  devolucoes: Record<ConvenioKey, LancamentoData[]>;
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function exportJSON(payload: ExportPayload) {
  const filename = `prestacao-contas-${payload.ano}-${String(payload.mes).padStart(2, "0")}.json`;
  download(filename, JSON.stringify(payload, null, 2), "application/json");
}

export function exportCSV(payload: ExportPayload) {
  const lines: string[] = [];
  lines.push(`Competência;${String(payload.mes).padStart(2, "0")}/${payload.ano}`);
  lines.push("");
  lines.push(
    [
      "Convênio",
      "Saldo Anterior",
      "Receita Repasse",
      "Rendimento Líquido",
      "Reembolso Efetuado",
      "Antecipação Receitas",
      "Reembolso a Efetuar",
      "Estorno Receita Antecipada",
      "Total Acum. Reembolso a Efetuar",
      "Total Acum. Estorno a Efetuar",
      "Sub-total",
      "Total Despesas",
      "Saldo Atual",
    ].join(";"),
  );

  CONVENIOS.forEach(({ key, label }) => {
    const d = payload.dados[key];
    const calc = calcularDados(d);
    lines.push(
      [
        label,
        d.saldoAnterior,
        d.receitaRepasse,
        d.rendimentoLiquido,
        d.reembolsoEfetuado,
        d.antecipacaoReceitas,
        d.reembolsoAEfetuar,
        d.estornoReceitaAntecipada,
        d.totalAcumuladoReembolso,
        d.totalAcumuladoEstorno,
        calc.subtotal,
        calc.totalDespesas,
        calc.saldoAtual,
      ]
        .map((v) => (typeof v === "number" ? v.toFixed(2).replace(".", ",") : v))
        .join(";"),
    );
  });

  lines.push("");
  CONVENIOS.forEach(({ key, label }) => {
    lines.push(`Rendimentos Meses Subsequentes - ${label}`);
    lines.push(["Data", "Valor"].join(";"));
    payload.rendimentos[key].forEach((item) => {
      lines.push([item.data, formatCurrency(item.valor)].join(";"));
    });
    lines.push("");
    lines.push(`Devoluções ao Município - ${label}`);
    lines.push(["Data", "Valor"].join(";"));
    payload.devolucoes[key].forEach((item) => {
      lines.push([item.data, formatCurrency(item.valor)].join(";"));
    });
    lines.push("");
  });

  const filename = `prestacao-contas-${payload.ano}-${String(payload.mes).padStart(2, "0")}.csv`;
  download(filename, "\uFEFF" + lines.join("\n"), "text/csv;charset=utf-8");
}
