import { SERVER } from "../config/site";

export interface ServerStatus {
  online: boolean;
  players: { online: number; max: number };
  version: string;
}

interface McsrvstatResponse {
  online: boolean;
  players?: { online: number; max: number };
  version?: string;
}

/**
 * Consulta el estado real del servidor vía mcsrvstat.us (API pública, con
 * soporte CORS, sin necesidad de backend propio). No se usan datos simulados:
 * si la API no responde, se propaga el error y la isla ServerStatus lo
 * refleja como "no disponible" en vez de inventar cifras.
 */
export async function fetchServerStatus(): Promise<ServerStatus> {
  const response = await fetch(`https://api.mcsrvstat.us/3/${SERVER.address}`);

  if (!response.ok) {
    throw new Error(`mcsrvstat.us respondió ${response.status}`);
  }

  const data = (await response.json()) as McsrvstatResponse;

  return {
    online: data.online,
    players: { online: data.players?.online ?? 0, max: data.players?.max ?? 0 },
    version: data.version ?? SERVER.minecraftVersion,
  };
}
