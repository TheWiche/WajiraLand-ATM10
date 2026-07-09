import { GITHUB } from "../config/site";

export interface ReleaseAsset {
  name: string;
  url: string;
  sizeBytes: number;
  downloadCount: number;
}

export interface LatestRelease {
  version: string;
  publishedAt: string;
  changelog: string;
  htmlUrl: string;
  asset: ReleaseAsset | null;
}

interface GitHubReleaseAssetResponse {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

interface GitHubReleaseResponse {
  tag_name: string;
  name: string | null;
  published_at: string;
  body: string | null;
  html_url: string;
  assets: GitHubReleaseAssetResponse[];
}

const MODPACK_EXTENSIONS = [".mrpack", ".zip"];

function pickModpackAsset(assets: GitHubReleaseAssetResponse[]): ReleaseAsset | null {
  const match =
    assets.find((asset) => MODPACK_EXTENSIONS.some((ext) => asset.name.toLowerCase().endsWith(ext))) ??
    assets[0] ??
    null;

  if (!match) return null;

  return {
    name: match.name,
    url: match.browser_download_url,
    sizeBytes: match.size,
    downloadCount: match.download_count,
  };
}

/** Fetches the latest published release straight from the GitHub API. No build step involved. */
export async function fetchLatestRelease(): Promise<LatestRelease> {
  const response = await fetch(GITHUB.releasesApiUrl, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    throw new Error(`GitHub API respondió ${response.status}`);
  }

  const data = (await response.json()) as GitHubReleaseResponse;

  return {
    version: data.name?.trim() || data.tag_name,
    publishedAt: data.published_at,
    changelog: data.body ?? "",
    htmlUrl: data.html_url,
    asset: pickModpackAsset(data.assets),
  };
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 MB";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatReleaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
