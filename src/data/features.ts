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
      "Worldgen de fantasía a gran escala: biomas propios, ciudades y aldeas mejoradas esperando a ser descubiertas.",
  },
  {
    icon: "sparkles",
    title: "Magia",
    description:
      "Sistema de cantrips y feats inspirado en el manual de D&D 5e: elige tu clase y desarrolla tu propio estilo de juego.",
  },
  {
    icon: "sword",
    title: "Combate",
    description:
      "Enemigos con niveles al estilo RPG y loot legendario. Cada encuentro es una razón para mejorar tu equipo.",
  },
  {
    icon: "trending-up",
    title: "Progresión",
    description:
      "Habilidades y estadísticas que se desbloquean jugando, con una historia inspirada en Baldur's Gate 3 de fondo.",
  },
  {
    icon: "users",
    title: "Multijugador",
    description:
      "Un servidor pensado para jugar en comunidad: economía, protección de terrenos y una base de jugadores activa.",
  },
];
