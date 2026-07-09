import { useState } from "react";
import { SERVER } from "../../config/site";

export default function CopyIpButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SERVER.address);
    } catch {
      // Clipboard API bloqueada (permisos/HTTP): degradamos en silencio, el usuario ve la IP igualmente.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-mist-200/15 bg-ink-800/60 px-5 py-3.5 font-mono text-sm text-mist-50 transition-all duration-200 hover:border-emerald-glow/40 active:scale-[0.98] sm:text-base"
      aria-label={`Copiar IP del servidor ${SERVER.address}`}
    >
      <span
        aria-hidden="true"
        className={`size-2 shrink-0 rounded-full transition-colors ${copied ? "bg-emerald-glow" : "bg-emerald-core"}`}
      />
      <span>{SERVER.address}</span>
      <span className="ml-1 text-mist-400 transition-colors group-hover:text-emerald-glow">
        {copied ? "¡Copiado!" : "Copiar"}
      </span>
    </button>
  );
}
