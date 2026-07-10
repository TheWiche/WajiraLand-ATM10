// Single source of truth for site-wide constants.
// Update values here — never hardcode them in components.

export const SITE = {
  name: "Wajira Land",
  tagline: "Una aventura de fantasía sin límites.",
  description:
    "Servidor de Minecraft con el modpack Otherworld [Dungeons & Dragons]. Explora, forja tu leyenda y sobrevive en Wajira Land: magia, combate y una comunidad activa en un mundo de fantasía.",
  url: "https://thewiche.github.io/WajiraLand-Otherworld/",
  locale: "es",
} as const;

export const GITHUB = {
  owner: "TheWiche",
  repo: "WajiraLand-Otherworld",
  get repoUrl() {
    return `https://github.com/${this.owner}/${this.repo}`;
  },
  get releasesApiUrl() {
    return `https://api.github.com/repos/${this.owner}/${this.repo}/releases/latest`;
  },
} as const;

export const SERVER = {
  ip: "15.204.68.134",
  port: 20280,
  get address() {
    return `${this.ip}:${this.port}`;
  },
  modpack: "Otherworld [Dungeons & Dragons]",
  minecraftVersion: "1.20.1",
} as const;

export const SOCIAL = {
  // Placeholder — reemplazar cuando exista el servidor de Discord.
  discord: "https://discord.gg/wajiraland",
  discordReady: false,
  github: GITHUB.repoUrl,
} as const;

export const LAUNCHER = {
  name: "Prism Launcher",
  url: "https://prismlauncher.org/download/",
} as const;
