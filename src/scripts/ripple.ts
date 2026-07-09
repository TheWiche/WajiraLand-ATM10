// Ripple effect delegado a nivel de documento: cualquier elemento con
// [data-ripple] lo recibe, sea un <a>/<button> de Astro o dentro de una isla React.
function spawnRipple(target: HTMLElement, event: PointerEvent) {
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.6;
  const span = document.createElement("span");

  span.className = "pointer-events-none absolute rounded-full bg-white/25";
  span.style.width = `${size}px`;
  span.style.height = `${size}px`;
  span.style.left = `${event.clientX - rect.left - size / 2}px`;
  span.style.top = `${event.clientY - rect.top - size / 2}px`;
  span.style.transform = "scale(0)";
  span.style.opacity = "1";
  span.style.transition = "transform 550ms cubic-bezier(0.16, 1, 0.3, 1), opacity 550ms ease-out";

  target.appendChild(span);
  requestAnimationFrame(() => {
    span.style.transform = "scale(1)";
    span.style.opacity = "0";
  });
  window.setTimeout(() => span.remove(), 600);
}

function initRipple() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.addEventListener("pointerdown", (event) => {
    const target = (event.target as HTMLElement)?.closest<HTMLElement>("[data-ripple]");
    if (!target) return;
    const style = getComputedStyle(target);
    if (style.position === "static") target.style.position = "relative";
    target.style.overflow = "hidden";
    spawnRipple(target, event);
  });
}

initRipple();
