import type { IconName } from "../components/ui/Icon.astro";

export interface Feature {
  icon: IconName;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "compass",
    title: "Exploración",
    description:
      "Nuevas dimensiones, biomas y estructuras por descubrir. Un mundo generado para recompensar la curiosidad.",
  },
  {
    icon: "cpu",
    title: "Tecnología",
    description:
      "Automatización, energía e industria de principio a fin: desde una simple prensa hasta líneas de producción completas.",
  },
  {
    icon: "sparkles",
    title: "Magia",
    description:
      "Sistemas mágicos profundos que conviven con la tecnología, con progresión propia y builds alternativas al endgame.",
  },
  {
    icon: "users",
    title: "Multijugador",
    description:
      "Un servidor pensado para jugar en comunidad: economía, protección de terrenos y una base de jugadores activa.",
  },
  {
    icon: "gauge",
    title: "Optimización",
    description:
      "Servidor ajustado para TPS estables incluso con el modpack cargado al máximo. Menos lag, más progreso.",
  },
];
