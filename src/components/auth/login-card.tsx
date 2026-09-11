"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginCard() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  async function handleGoogleLogin() {
    setLoading(true);
    const supabase = createClient();
    const redirect = searchParams.get("redirect") ?? "/dashboard";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
  }

  return (
    <div className="animate-fade-in relative z-10 w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-10 shadow-[0_24px_60px_rgba(16,24,40,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg shadow-indigo-600/30">
          $
        </div>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400">
          Prestação de Contas
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
          GRP-Parceria &amp; GPCOP
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Controle financeiro do convênio com cálculos automáticos, reativos e persistência
          segura na nuvem.
        </p>
      </div>

      {authError ? (
        <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-center text-sm text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
          Não foi possível concluir o login. Tente novamente.
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35 26.9 36 24 36c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.7 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
          />
        </svg>
        {loading ? "Redirecionando..." : "Entrar com Google"}
      </button>

      <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
        Seus dados ficam vinculados à sua conta e são protegidos por Row Level Security no
        Supabase.
      </p>
    </div>
  );
}
