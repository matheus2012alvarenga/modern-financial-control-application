import { Suspense } from "react";
import { LoginCard } from "@/components/auth/login-card";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl dark:bg-indigo-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/10" />
      <Suspense fallback={null}>
        <LoginCard />
      </Suspense>
    </main>
  );
}
