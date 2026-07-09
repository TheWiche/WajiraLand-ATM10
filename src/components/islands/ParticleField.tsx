import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  opacity: number;
}

const PARTICLE_COUNT = 42;
const COLOR = "52, 232, 158"; // --color-emerald-glow in rgb

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.6 + Math.random() * 1.8,
    speed: 0.08 + Math.random() * 0.22,
    drift: (Math.random() - 0.5) * 0.15,
    opacity: 0.15 + Math.random() * 0.35,
  };
}

/**
 * Fondo de partículas muy sutil, dibujado en canvas.
 * Se detiene automáticamente si el usuario prefiere menos movimiento
 * o si la pestaña no está visible, para no gastar CPU/batería.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrame = 0;
    let running = true;

    function resize() {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvasEl.clientWidth;
      height = canvasEl.clientHeight;
      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;
      ctx!.scale(dpr, dpr);
      particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(width, height));
    }

    function tick() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${COLOR}, ${p.opacity})`;
        ctx!.fill();
      }
      animationFrame = requestAnimationFrame(tick);
    }

    function handleVisibility() {
      running = document.visibilityState === "visible";
      if (running) animationFrame = requestAnimationFrame(tick);
      else cancelAnimationFrame(animationFrame);
    }

    resize();
    animationFrame = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
