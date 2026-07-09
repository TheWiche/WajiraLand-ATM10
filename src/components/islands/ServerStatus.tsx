import { useEffect, useState } from "react";
import { SERVER } from "../../config/site";
import { fetchServerStatus, type ServerStatus as ServerStatusData } from "../../lib/server-status";

type State = { status: "loading" } | { status: "error" } | { status: "ready"; data: ServerStatusData };

const REFRESH_INTERVAL_MS = 30_000;

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-mist-200/10 bg-ink-900/60 p-4 text-center">
      <dt className="text-xs font-medium uppercase tracking-wide text-mist-400">{label}</dt>
      <dd className="mt-1.5 font-display text-2xl font-bold text-mist-50">{value}</dd>
      {hint && <p className="mt-0.5 text-[11px] text-mist-400">{hint}</p>}
    </div>
  );
}

/**
 * Muestra el estado del servidor. Usa datos simulados vía fetchServerStatus()
 * (src/lib/server-status.ts) y se refresca sola cada 30s — al conectar una
 * API real ahí, este componente no necesita ningún cambio.
 */
export default function ServerStatus() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchServerStatus();
        if (!cancelled) setState({ status: "ready", data });
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    }

    load();
    const interval = window.setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const online = state.status === "ready" && state.data.online;

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glow-sm sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex size-3">
            {state.status === "ready" && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${online ? "bg-emerald-glow" : "bg-red-500"}`}
              />
            )}
            <span
              className={`relative inline-flex size-3 rounded-full ${
                state.status !== "ready" ? "bg-mist-400" : online ? "bg-emerald-glow" : "bg-red-500"
              }`}
            />
          </span>
          <span className="font-display text-lg font-semibold text-mist-50">
            {state.status === "loading" && "Consultando servidor…"}
            {state.status === "error" && "Estado no disponible"}
            {state.status === "ready" && (online ? "Servidor en línea" : "Servidor fuera de línea")}
          </span>
        </div>
        <code className="hidden rounded-lg bg-ink-900/70 px-3 py-1.5 text-xs text-mist-400 sm:block">
          {SERVER.address}
        </code>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        <StatCard
          label="Jugadores"
          value={state.status === "ready" ? `${state.data.players.online}/${state.data.players.max}` : "—"}
        />
        <StatCard label="Ping" value={state.status === "ready" && state.data.pingMs ? `${state.data.pingMs} ms` : "—"} />
        <StatCard label="Versión" value={state.status === "ready" ? state.data.version : "—"} />
      </dl>
    </div>
  );
}
