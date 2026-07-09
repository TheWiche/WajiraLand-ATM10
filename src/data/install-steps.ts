import type { IconName } from "../components/ui/Icon.astro";

export interface InstallStep {
  icon: IconName;
  title: string;
  description: string;
}

export const INSTALL_STEPS: InstallStep[] = [
  {
    icon: "download",
    title: "Instala Prism Launcher",
    description: "Descarga e instala el launcher gratuito y de código abierto compatible con modpacks .mrpack.",
  },
  {
    icon: "server",
    title: "Descarga el modpack",
    description: "Pulsa \"Descargar Modpack\" en esta página para obtener siempre la última versión publicada.",
  },
  {
    icon: "cpu",
    title: "Abre el archivo .mrpack",
    description: "Arrastra el archivo descargado a Prism Launcher o impórtalo desde \"Añadir instancia\".",
  },
  {
    icon: "wifi",
    title: "Entra al servidor",
    description: "Inicia la instancia, añade la IP de Wajira Land en multijugador y comienza a jugar.",
  },
];
