"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

interface HeaderProps {
  email: string;
  name: string;
  avatarUrl?: string;
}

export function Header({ email, name, avatarUrl }: HeaderProps) {
  const initials = (name || email).slice(0, 2).toUpperCase();

  return (
    <header className="animate-fade-in sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-600/30">
            $
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Prestação de Contas
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">GRP-Parceria &amp; GPCOP</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm sm:flex dark:border-slate-700 dark:bg-slate-800">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={name} className="h-7 w-7 rounded-full" />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {initials}
              </span>
            )}
            <span className="max-w-[160px] truncate text-xs font-medium text-slate-600 dark:text-slate-300">
              {email}
            </span>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
