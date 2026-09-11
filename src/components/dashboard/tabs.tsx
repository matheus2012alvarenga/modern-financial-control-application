"use client";

import { motion } from "framer-motion";

export type TabKey = "dados" | "analise";

interface TabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const TAB_ITEMS: { key: TabKey; label: string }[] = [
  { key: "dados", label: "Dados" },
  { key: "analise", label: "Análise" },
];

export function Tabs({ active, onChange }: TabsProps) {
  return (
    <div className="inline-flex gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {TAB_ITEMS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`relative rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
            active === tab.key
              ? "text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          {active === tab.key ? (
            <motion.span
              layoutId="tab-highlight"
              className="absolute inset-0 rounded-xl bg-indigo-600"
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            />
          ) : null}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
