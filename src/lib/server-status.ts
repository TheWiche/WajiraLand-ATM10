import { SERVER } from "../config/site";

export interface ServerStatus {
  online: boolean;
  players: { online: number; max: number };
  pingMs: number | null;
  version: string;
}

/**
 * Fuente de datos del estado del servidor.
 *
 * Hoy devuelve datos simulados. Para conectar datos reales, reemplaza el
 * cuerpo de esta función por una llamada a una API pública sin CORS issues,
 * por ejemplo:
 *
 *   const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER.address}`);
 *   const data = await res.json();
 *   return {
 *     online: data.online,
 *     players: { online: data.players?.online ?? 0, max: data.players?.max ?? 0 },
 *     pingMs: null,
 *     version: data.version ?? SERVER.minecraftVersion,
 *   };
 *
 * El resto de la app (isla ServerStatus) no necesita cambios: solo consume
 * esta función y el tipo ServerStatus.
 */
export async function fetchServerStatus(): Promise<ServerStatus> {
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

  return {
    online: true,
    players: { online: 7, max: 40 },
    pingMs: 28 + Math.round(Math.random() * 12),
    version: SERVER.minecraftVersion,
  };
}
