import { useEffect, useState } from "react";
import { fetchLatestRelease, type LatestRelease } from "./github-release";

type ReleaseState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; release: LatestRelease };

/** Comparte el fetch del último release de GitHub entre todas las islas que lo necesiten. */
export function useLatestRelease(): ReleaseState {
  const [state, setState] = useState<ReleaseState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchLatestRelease()
      .then((release) => {
        if (!cancelled) setState({ status: "ready", release });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
