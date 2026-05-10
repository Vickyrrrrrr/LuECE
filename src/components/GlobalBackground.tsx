"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number; opacity: number;
};

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    const COUNT = 65;
    const CONNECT_DIST = 130;
    const SPREAD = 500;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function init() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: (Math.random() - 0.5) * SPREAD,
          y: (Math.random() - 0.5) * SPREAD,
          z: (Math.random() - 0.5) * SPREAD,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          vz: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.3 + 0.05,
        });
      }
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const mx = (mouseRef.current.x - 0.5) * 20;
      const my = (mouseRef.current.y - 0.5) * 20;

      const projected = particles.map((p) => {
        const scale = 400 / (400 + p.z);
        return {
          px: p.x * scale + cx + mx * (p.z / SPREAD),
          py: p.y * scale + cy + my * (p.z / SPREAD),
          size: p.size * scale,
          opacity: p.opacity * Math.max(0.3, scale * 0.9),
        };
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.2;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.strokeStyle = `rgba(200, 170, 130, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const p of projected) {
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 180, 120, ${p.opacity * 0.5})`;
        ctx.fill();
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (Math.abs(p.x) > SPREAD / 2) p.vx *= -1;
        if (Math.abs(p.y) > SPREAD / 2) p.vy *= -1;
        if (Math.abs(p.z) > SPREAD / 2) p.vz *= -1;
      }
    }

    function loop() {
      draw();
      animId = requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    }

    resize();
    init();
    loop();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.35 }}
    />
  );
}
