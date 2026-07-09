export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "#hero" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Instalación", href: "#instalacion" },
  { label: "Estado", href: "#estado" },
];
