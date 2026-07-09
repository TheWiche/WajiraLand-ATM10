import { useLatestRelease } from "../../lib/use-latest-release";

export default function VersionBadge() {
  const state = useLatestRelease();

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-mist-200/15 px-3 py-1 text-xs text-mist-400">
      <span className="size-1.5 rounded-full bg-emerald-glow" />
      {state.status === "ready" ? state.release.version : "cargando versión…"}
    </span>
  );
}
