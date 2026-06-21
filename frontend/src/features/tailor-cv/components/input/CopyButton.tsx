import {useState} from "react";

interface Props {
  text: string;
  label?: string;
}

export function CopyButton({text, label = "Copy"}: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium shrink-0"
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}
