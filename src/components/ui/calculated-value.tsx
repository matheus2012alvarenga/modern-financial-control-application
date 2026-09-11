"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/finance/types";

interface CalculatedValueProps {
  value: number;
  className?: string;
  emphasize?: boolean;
}

export function CalculatedValue({ value, className = "", emphasize = false }: CalculatedValueProps) {
  const [pulse, setPulse] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setPulse(true);
      const timeout = setTimeout(() => setPulse(false), 900);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <div
      className={`rounded-xl border border-dashed border-slate-300 bg-slate-100/80 px-3 py-2 text-right text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200 ${
        emphasize ? "text-base" : ""
      } ${pulse ? "animate-value-highlight" : ""} ${className}`}
    >
      {formatCurrency(value)}
    </div>
  );
}
