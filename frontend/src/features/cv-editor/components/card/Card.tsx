import type React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export function Card({title, children}: Props) {
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">{title}</h3>

      {children}
    </section>
  );
}
