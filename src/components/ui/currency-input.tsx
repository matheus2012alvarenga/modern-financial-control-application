"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/finance/types";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
  className?: string;
}

export function CurrencyInput({ value, onChange, ariaLabel, className = "" }: CurrencyInputProps) {
  const [display, setDisplay] = useState(formatCurrency(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) {
      setDisplay(formatCurrency(value));
    }
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const isNegative = raw.trim().startsWith("-");
    const digits = raw.replace(/\D/g, "");
    const numeric = (digits ? parseInt(digits, 10) / 100 : 0) * (isNegative ? -1 : 1);
    setDisplay(formatCurrency(numeric));
    onChange(numeric);
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={ariaLabel}
      value={display}
      onFocus={() => {
        focused.current = true;
      }}
      onBlur={() => {
        focused.current = false;
        setDisplay(formatCurrency(value));
      }}
      onChange={handleChange}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-indigo-500/20 ${className}`}
    />
  );
}
