export type ConvenioKey = "grp" | "gpcop";

export const CONVENIOS: { key: ConvenioKey; label: string }[] = [
  { key: "grp", label: "GRP-Parceria" },
  { key: "gpcop", label: "GPCOP" },
];

export interface DadosMensal {
  id?: string;
  ano: number;
  mes: number;
  convenio: ConvenioKey;
  saldoAnterior: number;
  receitaRepasse: number;
  rendimentoLiquido: number;
  reembolsoEfetuado: number;
  antecipacaoReceitas: number;
  reembolsoAEfetuar: number;
  estornoReceitaAntecipada: number;
  totalAcumuladoReembolso: number;
  totalAcumuladoEstorno: number;
}

export function emptyDadosMensal(ano: number, mes: number, convenio: ConvenioKey): DadosMensal {
  return {
    ano,
    mes,
    convenio,
    saldoAnterior: 0,
    receitaRepasse: 0,
    rendimentoLiquido: 0,
    reembolsoEfetuado: 0,
    antecipacaoReceitas: 0,
    reembolsoAEfetuar: 0,
    estornoReceitaAntecipada: 0,
    totalAcumuladoReembolso: 0,
    totalAcumuladoEstorno: 0,
  };
}

export interface LancamentoData {
  id: string;
  data: string; // yyyy-mm-dd
  valor: number;
}

export interface DadosCalculado {
  subtotal: number;
  totalDespesas: number;
  saldoAtual: number;
}

export function calcularDados(d: DadosMensal): DadosCalculado {
  const subtotal =
    d.saldoAnterior + d.receitaRepasse + d.rendimentoLiquido + d.reembolsoEfetuado + d.antecipacaoReceitas;
  const totalDespesas = d.reembolsoAEfetuar + d.estornoReceitaAntecipada;
  const saldoAtual = subtotal - totalDespesas;
  return { subtotal, totalDespesas, saldoAtual };
}

export interface AnaliseCalculada {
  mesAnteriorReembolsoAEfetuar: number;
  reembolsoAEfetuarAtual: number;
  reembolsoEfetuadoAtual: number;
  analise: number;
  saldoAtual: number;
  totalReembolsoAEfetuarAcumulado: number;
  aMaisB: number;
  totalRendimentosSubsequentes: number;
  totalDevolucoes: number;
  f: number;
  faltaDevolver: number;
}

export function calcularAnalise(params: {
  atual: DadosMensal;
  anterior?: DadosMensal;
  rendimentos: LancamentoData[];
  devolucoes: LancamentoData[];
}): AnaliseCalculada {
  const { atual, anterior, rendimentos, devolucoes } = params;
  const { saldoAtual } = calcularDados(atual);

  const mesAnteriorReembolsoAEfetuar = anterior?.reembolsoAEfetuar ?? 0;
  const reembolsoAEfetuarAtual = atual.reembolsoAEfetuar;
  const reembolsoEfetuadoAtual = atual.reembolsoEfetuado;
  const analise = mesAnteriorReembolsoAEfetuar + reembolsoAEfetuarAtual - reembolsoEfetuadoAtual;

  const totalReembolsoAEfetuarAcumulado = atual.totalAcumuladoReembolso;
  const aMaisB = saldoAtual + totalReembolsoAEfetuarAcumulado;

  const totalRendimentosSubsequentes = rendimentos.reduce((acc, r) => acc + r.valor, 0);
  const totalDevolucoes = devolucoes.reduce((acc, d) => acc + d.valor, 0);

  const f = saldoAtual - totalDevolucoes;
  const faltaDevolver = totalRendimentosSubsequentes + f;

  return {
    mesAnteriorReembolsoAEfetuar,
    reembolsoAEfetuarAtual,
    reembolsoEfetuadoAtual,
    analise,
    saldoAtual,
    totalReembolsoAEfetuarAcumulado,
    aMaisB,
    totalRendimentosSubsequentes,
    totalDevolucoes,
    f,
    faltaDevolver,
  };
}

export const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(value) ? value : 0,
  );
}

export function previousCompetencia(ano: number, mes: number) {
  return mes === 1 ? { ano: ano - 1, mes: 12 } : { ano, mes: mes - 1 };
}

export function nextCompetencia(ano: number, mes: number) {
  return mes === 12 ? { ano: ano + 1, mes: 1 } : { ano, mes: mes + 1 };
}
