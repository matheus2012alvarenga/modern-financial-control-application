-- =====================================================================
-- Prestação de Contas — GRP-Parceria & GPCOP
-- Execute este script no SQL Editor do projeto Supabase
-- (https://app.supabase.com/project/_/sql/new)
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tabela: financeiro_dados
-- Uma linha por usuário + competência (ano/mes) + convênio (grp/gpcop)
-- ---------------------------------------------------------------------
create table if not exists public.financeiro_dados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ano integer not null,
  mes integer not null check (mes between 1 and 12),
  convenio text not null check (convenio in ('grp', 'gpcop')),
  saldo_anterior numeric(14, 2) not null default 0,
  receita_repasse numeric(14, 2) not null default 0,
  rendimento_liquido numeric(14, 2) not null default 0,
  reembolso_efetuado numeric(14, 2) not null default 0,
  antecipacao_receitas numeric(14, 2) not null default 0,
  reembolso_a_efetuar numeric(14, 2) not null default 0,
  estorno_receita_antecipada numeric(14, 2) not null default 0,
  total_acumulado_reembolso numeric(14, 2) not null default 0,
  total_acumulado_estorno numeric(14, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ano, mes, convenio)
);

-- ---------------------------------------------------------------------
-- Tabela: financeiro_rendimentos (linhas dinâmicas — Rendimentos Meses Subsequentes)
-- ---------------------------------------------------------------------
create table if not exists public.financeiro_rendimentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ano integer not null,
  mes integer not null check (mes between 1 and 12),
  convenio text not null check (convenio in ('grp', 'gpcop')),
  data date not null default current_date,
  valor numeric(14, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabela: financeiro_devolucoes (linhas dinâmicas — Devoluções ao Município)
-- ---------------------------------------------------------------------
create table if not exists public.financeiro_devolucoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ano integer not null,
  mes integer not null check (mes between 1 and 12),
  convenio text not null check (convenio in ('grp', 'gpcop')),
  data date not null default current_date,
  valor numeric(14, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists financeiro_dados_user_idx on public.financeiro_dados (user_id, ano, mes);
create index if not exists financeiro_rendimentos_user_idx on public.financeiro_rendimentos (user_id, ano, mes, convenio);
create index if not exists financeiro_devolucoes_user_idx on public.financeiro_devolucoes (user_id, ano, mes, convenio);

-- ---------------------------------------------------------------------
-- Row Level Security — cada usuário só acessa os próprios dados
-- ---------------------------------------------------------------------
alter table public.financeiro_dados enable row level security;
alter table public.financeiro_rendimentos enable row level security;
alter table public.financeiro_devolucoes enable row level security;

drop policy if exists "financeiro_dados_select_own" on public.financeiro_dados;
drop policy if exists "financeiro_dados_insert_own" on public.financeiro_dados;
drop policy if exists "financeiro_dados_update_own" on public.financeiro_dados;
drop policy if exists "financeiro_dados_delete_own" on public.financeiro_dados;

create policy "financeiro_dados_select_own" on public.financeiro_dados
  for select using (auth.uid() = user_id);
create policy "financeiro_dados_insert_own" on public.financeiro_dados
  for insert with check (auth.uid() = user_id);
create policy "financeiro_dados_update_own" on public.financeiro_dados
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "financeiro_dados_delete_own" on public.financeiro_dados
  for delete using (auth.uid() = user_id);

drop policy if exists "financeiro_rendimentos_select_own" on public.financeiro_rendimentos;
drop policy if exists "financeiro_rendimentos_insert_own" on public.financeiro_rendimentos;
drop policy if exists "financeiro_rendimentos_update_own" on public.financeiro_rendimentos;
drop policy if exists "financeiro_rendimentos_delete_own" on public.financeiro_rendimentos;

create policy "financeiro_rendimentos_select_own" on public.financeiro_rendimentos
  for select using (auth.uid() = user_id);
create policy "financeiro_rendimentos_insert_own" on public.financeiro_rendimentos
  for insert with check (auth.uid() = user_id);
create policy "financeiro_rendimentos_update_own" on public.financeiro_rendimentos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "financeiro_rendimentos_delete_own" on public.financeiro_rendimentos
  for delete using (auth.uid() = user_id);

drop policy if exists "financeiro_devolucoes_select_own" on public.financeiro_devolucoes;
drop policy if exists "financeiro_devolucoes_insert_own" on public.financeiro_devolucoes;
drop policy if exists "financeiro_devolucoes_update_own" on public.financeiro_devolucoes;
drop policy if exists "financeiro_devolucoes_delete_own" on public.financeiro_devolucoes;

create policy "financeiro_devolucoes_select_own" on public.financeiro_devolucoes
  for select using (auth.uid() = user_id);
create policy "financeiro_devolucoes_insert_own" on public.financeiro_devolucoes
  for insert with check (auth.uid() = user_id);
create policy "financeiro_devolucoes_update_own" on public.financeiro_devolucoes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "financeiro_devolucoes_delete_own" on public.financeiro_devolucoes
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Trigger para manter updated_at sempre atualizado em financeiro_dados
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_financeiro_dados_updated_at on public.financeiro_dados;
create trigger set_financeiro_dados_updated_at
  before update on public.financeiro_dados
  for each row execute function public.set_updated_at();
