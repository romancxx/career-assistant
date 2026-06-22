import type React from "react";

interface Props {
  children: React.ReactNode;
}

export function FormCard({ children }: Props) {
  return <div className="bg-white border border-slate-200 rounded-lg p-4">{children}</div>;
}
