import { GITHUB } from "../../config/site";
import { formatBytes } from "../../lib/github-release";
import { useLatestRelease } from "../../lib/use-latest-release";

/**
 * CTA principal. Siempre apunta al último asset publicado en GitHub Releases:
 * nunca a un archivo fijo. Si la API falla, cae de vuelta a la página de
 * releases para que la descarga nunca quede rota.
 */
export default function DownloadButton() {
  const state = useLatestRelease();

  const downloadHref =
    state.status === "ready" ? (state.release.asset?.url ?? state.release.htmlUrl) : `${GITHUB.repoUrl}/releases/latest`;

  return (
    <div className="flex flex-col items-center gap-2 sm:items-start">
      <a
        href={downloadHref}
        data-ripple
        className="group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-core to-emerald-glow bg-[length:200%_100%] bg-left px-8 py-4 text-lg font-bold text-ink-950 shadow-glow-md transition-all duration-300 hover:bg-right hover:shadow-glow-lg active:scale-[0.97]"
      >
        <svg
          className="size-6 transition-transform duration-300 group-hover:translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        Descargar Modpack
      </a>

      <p className="h-4 text-xs text-mist-400" aria-live="polite">
        {state.status === "loading" && (
          <span className="inline-block h-3 w-40 animate-shimmer rounded bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700 bg-[length:200%_100%]" />
        )}
        {state.status === "ready" && (
          <>
            {state.release.version}
            {state.release.asset ? ` · ${formatBytes(state.release.asset.sizeBytes)}` : ""}
          </>
        )}
        {state.status === "error" && "No se pudo consultar la última versión — se abrirá la página de releases."}
      </p>
    </div>
  );
}
