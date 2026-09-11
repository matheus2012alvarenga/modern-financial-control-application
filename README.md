# Prestação de Contas — GRP-Parceria & GPCOP

Aplicação web para controle financeiro e prestação de contas de convênio, substituindo a
planilha Excel. Construída com **Next.js (App Router)**, **Tailwind CSS**, **Supabase**
(autenticação + banco de dados) e **Framer Motion**.

## Funcionalidades

- Login com Google via Supabase Auth, sessão persistente, rotas protegidas por middleware.
- Aba **Dados**: dois cartões (GRP-Parceria e GPCOP) com campos monetários editáveis e campos
  calculados automaticamente e reativos (Sub-total, Total de despesas, Saldo atual).
- Aba **Análise**: comparativo Mês Anterior / Mês Atual / Análise, cartões A + B, tabelas
  dinâmicas de "Rendimentos Meses Subsequentes" e "Devoluções ao Município" (adicionar/remover
  linhas) e cartões finais F e "Falta Devolver" (verde/vermelho).
- Seletor de competência (mês/ano), botão **Novo mês** (copia o Saldo Atual do mês anterior para
  o Saldo Anterior do mês selecionado).
- Exportação em CSV e JSON.
- Persistência automática no Supabase com debounce e indicador de status ("Salvando...",
  "Salvo").
- Modo claro/escuro com toggle manual.
- Row Level Security: cada usuário só enxerga e edita os próprios lançamentos
  (`user_id = auth.uid()`).

## Configuração do Supabase (obrigatório)

### 1. Criar as tabelas e políticas de RLS

Abra o **SQL Editor** do seu projeto Supabase e execute o conteúdo do arquivo
[`supabase/schema.sql`](./supabase/schema.sql). Ele cria as tabelas `financeiro_dados`,
`financeiro_rendimentos` e `financeiro_devolucoes`, habilita Row Level Security e cria as
políticas para que cada usuário acesse somente os próprios dados.

### 2. Habilitar o provedor Google (Authentication > Providers)

1. No painel do Supabase, acesse **Authentication → Providers → Google**.
2. Ative o provedor e informe o **Client ID** e **Client Secret** obtidos no
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (crie uma
   credencial OAuth 2.0 do tipo "Web application").
3. Em **Authorized redirect URIs** do Google, cadastre a URL de callback do Supabase, algo como:
   `https://iiwctfwooabjumzcicst.supabase.co/auth/v1/callback`.

### 3. Cadastrar as Redirect URLs da aplicação

Em **Authentication → URL Configuration**, cadastre as URLs de redirecionamento da aplicação
(a rota `/auth/callback` troca o `code` pela sessão):

- `http://localhost:3000/auth/callback` (ambiente de desenvolvimento)
- `https://SEU-DOMINIO-DE-PRODUCAO/auth/callback` (ambiente de produção)

### 4. Variáveis de ambiente

Já configuradas em `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=https://iiwctfwooabjumzcicst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Estrutura de dados

- `financeiro_dados`: uma linha por usuário + competência (ano/mês) + convênio (`grp`/`gpcop`)
  com os campos editáveis da aba Dados.
- `financeiro_rendimentos` / `financeiro_devolucoes`: linhas dinâmicas (data + valor) usadas na
  aba Análise para calcular os totais **E** e **D**.

## Fórmulas

**Aba Dados** (por convênio):
- `Sub-total = Saldo Anterior + Receita de repasse + Rendimento líquido + Reembolso efetuado + Antecipação de receitas`
- `Total de despesas = Reembolso a ser efetuado + Estorno de receita antecipada`
- `Saldo atual = Sub-total − Total de despesas`

**Aba Análise** (por convênio):
- `Análise = Reembolso a efetuar (mês anterior) + Reembolso a efetuar (mês atual) − Reembolso efetuado`
- `A + B = Saldo atual + Total acumulado de reembolso a efetuar`
- `F = Saldo atual (C) − Total de Devoluções ao Município (D)`
- `Falta Devolver = Total de Rendimentos Meses Subsequentes (E) + F`

## Desenvolvimento local

```bash
npm install
npm run dev
```

A aplicação também depende de um PostgreSQL local (usado apenas pelo endpoint interno
`/api/health` do template base) configurado via `DATABASE_URL` em `.env` — os dados financeiros
reais da aplicação são persistidos no Supabase, não nesse banco local.
