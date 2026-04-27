import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stars, PerspectiveCamera, OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { HUDControls } from "../src/components/HUDControls";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { AsteroidBelt } from "../src/components/AsteroidBelt";
import BackgroundEffects from "../src/components/BackgroundEffects";

import Head from 'next/head';

import Sun from "../src/components/planets/Sun";
import Earth from "../src/components/planets/Earth";
import Mars from "../src/components/planets/Mars";
import Jupiter from "../src/components/planets/Jupiter";
import Saturn from "../src/components/planets/saturn";
import Mercury from "../src/components/planets/mecury";
import Neptune from "../src/components/planets/neptune";
import Uranus from "../src/components/planets/uranus";
import Venus from "../src/components/planets/venus";

// ─── DỮ LIỆU HÀNH TINH ────────────────────────────────────────────────────────
const planetData: Record<string, any> = {
  "#mercury": {
    name: " MERCURY", type: "PLANET",
    visit: "Mercury is the smallest planet in our solar system and the closest to the Sun. It experiences extreme temperature fluctuations, freezing at night and scorching during the day.",
    encyclopedia: "A terrestrial planet with a heavily cratered surface, much like Earth's Moon. It has no moons and almost no atmosphere to retain heat.",
    structure: "Mercury has a large, dense metallic core that makes up about 85% of its radius, surrounded by a rocky mantle and a thin solid crust.",
    question: "Hành tinh nào gần Mặt Trời nhất?",
    options: ["A. Sao Kim", "B. Sao Thủy", "C. Sao Hỏa", "D. Sao Mộc"],
    correctAnswer: 1,
  },
  "#venus": {
    name: "VENUS", type: "PLANET",
    visit: "Often called Earth's twin due to its similar size, but its surface is a toxic, superheated wasteland with crushing atmospheric pressure.",
    encyclopedia: "The second planet from the Sun, featuring a thick atmosphere rich in carbon dioxide and clouds of sulfuric acid that trap heat in a runaway greenhouse effect.",
    structure: "Similar to Earth, Venus has an iron core, a rocky mantle, and a silicate crust. Its surface is dominated by volcanic features.",
    question: "Hành tinh nào nóng nhất hệ Mặt Trời?",
    options: ["A. Sao Thủy", "B. Trái Đất", "C. Sao Kim", "D. Sao Hỏa"],
    correctAnswer: 2,
  },
  "#earth": {
    name: "EARTH", type: "PLANET",
    visit: "Our home planet, the third from the Sun, and the only place we know of so far that's inhabited by living things.",
    encyclopedia: "Earth is a water world with 71% of its surface covered by oceans. It has a dynamic atmosphere that sustains life and protects us from meteoroids.",
    structure: "Earth is composed of four main layers: a solid inner core, a liquid outer core, a thick rocky mantle, and a rocky crust.",
    question: "Hành tinh nào chúng ta đang sống?",
    options: ["A. Sao Hỏa", "B. Trái Đất", "C. Sao Kim", "D. Sao Thổ"],
    correctAnswer: 1,
  },
  "#mars": {
    name: "MARS", type: "PLANET",
    visit: "The Red Planet, a dusty, cold, desert world with a very thin atmosphere. It is one of the most explored bodies in our solar system.",
    encyclopedia: "The fourth planet from the Sun. It features surface elements reminiscent of both the impact craters of the Moon and the valleys, deserts, and polar ice caps of Earth.",
    structure: "Mars has a dense core of iron, nickel, and sulfur, surrounded by a rocky mantle and a crust made of volcanic rock. Its red color comes from iron oxide (rust).",
    question: "Hành tinh nào được gọi là \"hành tinh đỏ\"?",
    options: ["A. Sao Mộc", "B. Sao Hỏa", "C. Sao Kim", "D. Sao Thủy"],
    correctAnswer: 1,
  },
  "#jupiter": {
    name: "JUPITER", type: "GAS GIANT",
    visit: "The largest planet in our solar system. It is a massive gas giant with swirling cloud stripes and massive storms, including the Great Red Spot.",
    encyclopedia: "The fifth planet from the Sun. It has dozens of moons and a dark, barely-visible ring system. It acts as a massive vacuum cleaner for the solar system.",
    structure: "Primarily composed of hydrogen and helium. It lacks a well-defined solid surface, transitioning gradually from gas to a vast ocean of liquid metallic hydrogen.",
    question: "Hành tinh nào lớn nhất hệ Mặt Trời?",
    options: ["A. Sao Thổ", "B. Sao Hải Vương", "C. Sao Mộc", "D. Sao Thiên Vương"],
    correctAnswer: 2,
  },
  "#saturn": {
    name: "SATURN", type: "GAS GIANT",
    visit: "Adorned with a dazzling, complex system of icy rings, Saturn is widely considered the most beautiful planet in our solar system.",
    encyclopedia: "The sixth planet from the Sun and the second-largest. It is a gas giant with an extensive moon system, including Titan, which has its own thick atmosphere.",
    structure: "Made mostly of hydrogen and helium. It likely has a dense, rocky core surrounded by a deep layer of liquid metallic hydrogen.",
    question: "Hành tinh nào có vành đai nổi bật nhất?",
    options: ["A. Sao Mộc", "B. Sao Thổ", "C. Sao Kim", "D. Sao Hỏa"],
    correctAnswer: 1,
  },
  "#uranus": {
    name: "URANUS", type: "ICE GIANT",
    visit: "An ice giant that is unique because it rotates on its side. It has a distinct pale blue-green color.",
    encyclopedia: "The seventh planet from the Sun. It was the first planet found with the aid of a telescope. It has 27 known moons and faint rings.",
    structure: "Mostly composed of flowing icy materials (water, ammonia, methane) above a small rocky core. Its atmosphere contains hydrogen, helium, and methane.",
    question: "Hành tinh nào có màu xanh do khí methane?",
    options: ["A. Sao Kim", "B. Sao Thiên Vương", "C. Sao Hỏa", "D. Sao Thủy"],
    correctAnswer: 1,
  },
  "#neptune": {
    name: "NEPTUNE", type: "ICE GIANT",
    visit: "Dark, cold, and whipped by supersonic winds, Neptune is the last of the major planets in our solar system.",
    encyclopedia: "The eighth and most distant major planet orbiting our Sun. It is an ice giant with a faint ring system and 14 known moons.",
    structure: "Its structure is similar to Uranus, consisting of a hot, dense fluid or 'icy' mantle (water, ammonia, and methane) over an Earth-sized solid core.",
    question: "Hành tinh xa Mặt Trời nhất là gì?",
    options: ["A. Sao Thiên Vương", "B. Sao Hải Vương", "C. Sao Thổ", "D. Sao Mộc"],
    correctAnswer: 1,
  },
};

// ─── CẤU HÌNH QUỸ ĐẠO ────────────────────────────────────────────────────────
const ORBIT_CONFIG: Record<
  string,
  {
    radius: number;
    speed: number;
    camOffset: [number, number, number];
    ufoHeight: number;
    ufoScale: number;
  }
> = {
  "#mercury": { radius: 80,   speed: 0.50, camOffset: [0, 10, 30],  ufoHeight: 7,  ufoScale: 0.22 },
  "#venus":   { radius: 140,  speed: 0.35, camOffset: [0, 10, 35],  ufoHeight: 9,  ufoScale: 0.26 },
  "#earth":   { radius: 210,  speed: 0.25, camOffset: [0, 10, 35],  ufoHeight: 10, ufoScale: 0.26 },
  "#mars":    { radius: 300,  speed: 0.20, camOffset: [0, 10, 35],  ufoHeight: 8,  ufoScale: 0.22 },
  "#jupiter": { radius: 480,  speed: 0.10, camOffset: [0, 30, 100], ufoHeight: 32, ufoScale: 0.75 },
  "#saturn":  { radius: 680,  speed: 0.08, camOffset: [0, 30, 100], ufoHeight: 36, ufoScale: 0.75 },
  "#uranus":  { radius: 880,  speed: 0.05, camOffset: [0, 20, 80],  ufoHeight: 22, ufoScale: 0.42 },
  "#neptune": { radius: 1050, speed: 0.03, camOffset: [0, 20, 80],  ufoHeight: 20, ufoScale: 0.38 },
};

// ─── [NHIỆM VỤ 1] ANIMATED BACKGROUND — MẠNH HƠN ──────────────────────────
// Nebula khổng lồ + sao băng + aurora sóng + warp streak + parallax 3 lớp
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    // ── Stars: 3 lớp parallax rõ ràng ──────────────────────────────────
    interface Star {
      x: number; y: number; r: number; alpha: number;
      twinkleSpeed: number; twinkleOffset: number; layer: number;
      color: string;
    }
    const STAR_COLORS = [
      "255,255,255", "200,220,255", "255,220,180", "180,200,255", "255,255,200"
    ];
    const stars: Star[] = [];
    for (let i = 0; i < 900; i++) {
      const layer = i < 400 ? 0 : i < 700 ? 1 : 2;
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: layer === 2 ? 1.2 + Math.random() * 2.2 : layer === 1 ? 0.7 + Math.random() * 1.3 : 0.3 + Math.random() * 0.7,
        alpha: 0.35 + Math.random() * 0.65,
        twinkleSpeed: 0.4 + Math.random() * 3,
        twinkleOffset: Math.random() * Math.PI * 2,
        layer,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      });
    }

    // ── Nebula blobs: to hơn, đậm hơn, nhiều lớp hơn ──────────────────
    interface Nebula {
      cx: number; cy: number; rx: number; ry: number;
      hue: number; hue2: number; alpha: number; vx: number; vy: number;
      rotSpeed: number; rot: number;
    }
    const nebulae: Nebula[] = [
      { cx: W*0.12, cy: H*0.20, rx: 520, ry: 360, hue: 215, hue2: 240, alpha: 0.18, vx:  0.10, vy:  0.05, rotSpeed: 0.0002, rot: 0 },
      { cx: W*0.78, cy: H*0.55, rx: 600, ry: 420, hue: 265, hue2: 290, alpha: 0.14, vx: -0.07, vy:  0.08, rotSpeed: 0.0003, rot: 1 },
      { cx: W*0.50, cy: H*0.85, rx: 480, ry: 300, hue: 185, hue2: 210, alpha: 0.16, vx:  0.05, vy: -0.06, rotSpeed: 0.0002, rot: 2 },
      { cx: W*0.88, cy: H*0.08, rx: 400, ry: 300, hue: 295, hue2: 320, alpha: 0.13, vx: -0.08, vy:  0.10, rotSpeed: 0.0004, rot: 3 },
      { cx: W*0.30, cy: H*0.65, rx: 360, ry: 280, hue: 160, hue2: 185, alpha: 0.12, vx:  0.09, vy:  0.04, rotSpeed: 0.0003, rot: 4 },
      // Extra accent nebula
      { cx: W*0.62, cy: H*0.30, rx: 300, ry: 220, hue: 340, hue2: 20,  alpha: 0.10, vx: -0.06, vy: -0.05, rotSpeed: 0.0002, rot: 5 },
    ];

    // ── Sao băng (shooting stars) ───────────────────────────────────────
    interface Meteor {
      x: number; y: number; vx: number; vy: number;
      len: number; alpha: number; active: boolean; timer: number; maxTimer: number;
    }
    const meteors: Meteor[] = Array.from({ length: 8 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, len: 0, alpha: 0, active: false, timer: 0, maxTimer: 0
    }));
    function spawnMeteor(m: Meteor) {
      m.x = Math.random() * W * 1.3 - W * 0.15;
      m.y = Math.random() * H * 0.4;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      const speed = 12 + Math.random() * 20;
      m.vx = Math.cos(angle) * speed;
      m.vy = Math.sin(angle) * speed;
      m.len = 80 + Math.random() * 160;
      m.alpha = 0.7 + Math.random() * 0.3;
      m.active = true;
      m.timer = 0;
      m.maxTimer = 40 + Math.random() * 30;
    }
    // Stagger initial spawn
    meteors.forEach((m, i) => { m.timer = -i * 80 - Math.random() * 200; });

    // ── Aurora waves ────────────────────────────────────────────────────
    interface AuroraWave {
      baseY: number; amplitude: number; freq: number; phase: number;
      phaseSpeed: number; hue: number; alpha: number; width: number;
    }
    const auroraWaves: AuroraWave[] = [
      { baseY: H * 0.15, amplitude: 55, freq: 0.0035, phase: 0,   phaseSpeed: 0.012, hue: 160, alpha: 0.055, width: 60 },
      { baseY: H * 0.20, amplitude: 40, freq: 0.0050, phase: 1.2, phaseSpeed: 0.009, hue: 190, alpha: 0.045, width: 40 },
      { baseY: H * 0.10, amplitude: 70, freq: 0.0028, phase: 2.5, phaseSpeed: 0.015, hue: 260, alpha: 0.040, width: 50 },
      { baseY: H * 0.80, amplitude: 45, freq: 0.0040, phase: 0.7, phaseSpeed: 0.011, hue: 180, alpha: 0.040, width: 45 },
    ];

    // ── Warp streaks (tia tốc độ nền) ──────────────────────────────────
    interface WarpStreak {
      x: number; y: number; len: number; alpha: number; speed: number; active: boolean; timer: number;
    }
    const warpStreaks: WarpStreak[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      len: 20 + Math.random() * 60,
      alpha: 0.1 + Math.random() * 0.3,
      speed: 0.3 + Math.random() * 1.2,
      active: Math.random() > 0.5,
      timer: Math.random() * 200,
    }));

    let t = 0;

    function drawAurora(w: AuroraWave) {
      w.phase += w.phaseSpeed;
      ctx!.beginPath();
      ctx!.moveTo(0, w.baseY);
      for (let x = 0; x <= W; x += 6) {
        const y = w.baseY + Math.sin(x * w.freq + w.phase) * w.amplitude
                           + Math.sin(x * w.freq * 1.7 + w.phase * 0.8) * w.amplitude * 0.4;
        ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = `hsla(${w.hue}, 90%, 65%, ${w.alpha * (0.6 + 0.4 * Math.sin(t * 0.5 + w.phase))})`;
      ctx!.lineWidth = w.width;
      ctx!.shadowColor = `hsla(${w.hue}, 100%, 60%, 0.3)`;
      ctx!.shadowBlur = 30;
      ctx!.stroke();
      ctx!.shadowBlur = 0;
    }

    function draw() {
      t += 0.01;
      ctx!.clearRect(0, 0, W, H);

      // ── Deep space base gradient ──────────────────────────────────────
      const bg = ctx!.createRadialGradient(W * 0.4, H * 0.3, 0, W * 0.5, H * 0.5, Math.max(W, H));
      bg.addColorStop(0,   "rgba(6, 8, 28, 1)");
      bg.addColorStop(0.3, "rgba(4, 5, 20, 1)");
      bg.addColorStop(0.7, "rgba(2, 3, 14, 1)");
      bg.addColorStop(1,   "rgba(1, 1, 8,  1)");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      // ── Aurora waves (bottom layer) ──────────────────────────────────
      ctx!.globalCompositeOperation = "screen";
      auroraWaves.forEach(drawAurora);
      ctx!.globalCompositeOperation = "source-over";

      // ── Nebulae: 2 passes each (core + outer glow) ──────────────────
      ctx!.globalCompositeOperation = "screen";
      nebulae.forEach((n) => {
        n.cx += n.vx; n.cy += n.vy; n.rot += n.rotSpeed;
        if (n.cx < -n.rx * 1.5) n.cx = W + n.rx * 1.5;
        if (n.cx > W + n.rx * 1.5) n.cx = -n.rx * 1.5;
        if (n.cy < -n.ry * 1.5) n.cy = H + n.ry * 1.5;
        if (n.cy > H + n.ry * 1.5) n.cy = -n.ry * 1.5;

        const pulse = 1 + 0.08 * Math.sin(t * 0.5 + n.hue * 0.05);
        const breathe = 0.85 + 0.15 * Math.sin(t * 0.3 + n.hue * 0.02);

        ctx!.save();
        ctx!.translate(n.cx, n.cy);
        ctx!.rotate(n.rot);

        // Outer glow (large, translucent)
        const outer = ctx!.createRadialGradient(0, 0, 0, 0, 0, n.rx * pulse * 1.4);
        outer.addColorStop(0,   `hsla(${n.hue}, 85%, 55%, ${n.alpha * breathe})`);
        outer.addColorStop(0.3, `hsla(${n.hue2}, 75%, 45%, ${n.alpha * breathe * 0.7})`);
        outer.addColorStop(0.65,`hsla(${n.hue + 10}, 70%, 35%, ${n.alpha * breathe * 0.3})`);
        outer.addColorStop(1,   `hsla(${n.hue}, 60%, 25%, 0)`);
        ctx!.scale(1, n.ry / n.rx);
        ctx!.beginPath();
        ctx!.arc(0, 0, n.rx * pulse * 1.4, 0, Math.PI * 2);
        ctx!.fillStyle = outer;
        ctx!.fill();

        // Bright core
        const core = ctx!.createRadialGradient(0, 0, 0, 0, 0, n.rx * pulse * 0.5);
        core.addColorStop(0,   `hsla(${n.hue2}, 100%, 75%, ${n.alpha * 2.2 * breathe})`);
        core.addColorStop(0.5, `hsla(${n.hue}, 90%, 60%, ${n.alpha * 1.2 * breathe})`);
        core.addColorStop(1,   `hsla(${n.hue}, 80%, 40%, 0)`);
        ctx!.beginPath();
        ctx!.arc(0, 0, n.rx * pulse * 0.5, 0, Math.PI * 2);
        ctx!.fillStyle = core;
        ctx!.fill();

        ctx!.restore();
      });
      ctx!.globalCompositeOperation = "source-over";

      // ── Milky Way diagonal band ──────────────────────────────────────
      ctx!.save();
      ctx!.translate(W * 0.5, H * 0.5);
      ctx!.rotate(-0.35);
      const mw = ctx!.createLinearGradient(-W, -H * 0.12, -W, H * 0.12);
      mw.addColorStop(0,    "rgba(70,90,160,0)");
      mw.addColorStop(0.25, "rgba(70,90,160,0.07)");
      mw.addColorStop(0.5,  "rgba(90,110,180,0.13)");
      mw.addColorStop(0.75, "rgba(70,90,160,0.07)");
      mw.addColorStop(1,    "rgba(70,90,160,0)");
      ctx!.fillStyle = mw;
      ctx!.fillRect(-W, -H * 0.12, W * 2, H * 0.24);
      ctx!.restore();

      // ── Stars ─────────────────────────────────────────────────────────
      stars.forEach((s) => {
        const driftSpeeds = [0, 0.025, 0.06];
        s.x = (s.x + driftSpeeds[s.layer] + W) % W;
        const twinkle = s.alpha * (0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));

        // Cross-flare for bright stars
        if (s.r > 1.8) {
          ctx!.save();
          ctx!.globalAlpha = twinkle * 0.25;
          ctx!.strokeStyle = `rgba(${s.color}, 1)`;
          ctx!.lineWidth = 0.5;
          const fl = s.r * 5;
          ctx!.beginPath(); ctx!.moveTo(s.x - fl, s.y); ctx!.lineTo(s.x + fl, s.y); ctx!.stroke();
          ctx!.beginPath(); ctx!.moveTo(s.x, s.y - fl); ctx!.lineTo(s.x, s.y + fl); ctx!.stroke();
          ctx!.restore();
        }

        // Bloom glow
        if (s.r > 1.0) {
          const glow = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          glow.addColorStop(0, `rgba(${s.color}, ${twinkle * 0.5})`);
          glow.addColorStop(1, "rgba(0,0,0,0)");
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          ctx!.fillStyle = glow;
          ctx!.fill();
        }

        // Core dot
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${s.color}, ${twinkle})`;
        ctx!.fill();
      });

      // ── Warp streaks ─────────────────────────────────────────────────
      ctx!.globalCompositeOperation = "screen";
      warpStreaks.forEach((ws) => {
        ws.timer++;
        if (!ws.active && ws.timer > 60 + Math.random() * 120) {
          ws.active = true;
          ws.x = Math.random() * W;
          ws.y = Math.random() * H;
          ws.len = 20 + Math.random() * 80;
          ws.alpha = 0.08 + Math.random() * 0.22;
          ws.timer = 0;
        }
        if (ws.active) {
          const fade = Math.sin((ws.timer / 30) * Math.PI);
          const grd = ctx!.createLinearGradient(ws.x, ws.y, ws.x + ws.len, ws.y);
          grd.addColorStop(0, `rgba(100,180,255,0)`);
          grd.addColorStop(0.4, `rgba(150,210,255,${ws.alpha * fade})`);
          grd.addColorStop(1, `rgba(200,230,255,0)`);
          ctx!.strokeStyle = grd;
          ctx!.lineWidth = 0.8;
          ctx!.beginPath();
          ctx!.moveTo(ws.x, ws.y);
          ctx!.lineTo(ws.x + ws.len, ws.y);
          ctx!.stroke();
          ws.x += ws.speed;
          if (ws.timer > 30 || ws.x > W + ws.len) { ws.active = false; ws.timer = 0; }
        }
      });
      ctx!.globalCompositeOperation = "source-over";

      // ── Shooting stars (meteors) ─────────────────────────────────────
      meteors.forEach((m) => {
        m.timer++;
        if (!m.active) {
          if (m.timer > 0 && Math.random() < 0.004) spawnMeteor(m);
          return;
        }
        const progress = m.timer / m.maxTimer;
        const fade = progress < 0.2
          ? progress / 0.2
          : progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;
        m.x += m.vx; m.y += m.vy;

        const tx = m.x - m.vx * (m.len / Math.hypot(m.vx, m.vy));
        const ty = m.y - m.vy * (m.len / Math.hypot(m.vx, m.vy));

        const grd = ctx!.createLinearGradient(tx, ty, m.x, m.y);
        grd.addColorStop(0, `rgba(200,220,255,0)`);
        grd.addColorStop(0.6, `rgba(220,235,255,${m.alpha * fade * 0.5})`);
        grd.addColorStop(1,   `rgba(255,255,255,${m.alpha * fade})`);

        ctx!.strokeStyle = grd;
        ctx!.lineWidth = 1.5;
        ctx!.shadowColor = "rgba(180,210,255,0.8)";
        ctx!.shadowBlur = 6;
        ctx!.beginPath();
        ctx!.moveTo(tx, ty);
        ctx!.lineTo(m.x, m.y);
        ctx!.stroke();
        ctx!.shadowBlur = 0;

        if (m.timer >= m.maxTimer) { m.active = false; m.timer = -Math.floor(Math.random() * 300); }
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }}
    />
  );
}

// ─── [NHIỆM VỤ 2] PLANET ARRIVAL EFFECT ─────────────────────────────────────
// Mỗi khi đổi hành tinh: warp flash trắng → shockwave ring tỏa ra → tên hành tinh
// đổ xuống giữa màn hình rồi fade out → scan-line quét ngang → accent color riêng

// Màu theme riêng cho từng hành tinh
const PLANET_THEME: Record<string, { color: string; glow: string; label: string }> = {
  "#mercury": { color: "#c0a060", glow: "rgba(192,160,96,",  label: "MERCURY"  },
  "#venus":   { color: "#ffcc66", glow: "rgba(255,204,102,", label: "VENUS"    },
  "#earth":   { color: "#44aaff", glow: "rgba(68,170,255,",  label: "EARTH"    },
  "#mars":    { color: "#ff5533", glow: "rgba(255,85,51,",   label: "MARS"     },
  "#jupiter": { color: "#cc8844", glow: "rgba(204,136,68,",  label: "JUPITER"  },
  "#saturn":  { color: "#ddcc88", glow: "rgba(221,204,136,", label: "SATURN"   },
  "#uranus":  { color: "#66ddcc", glow: "rgba(102,221,204,", label: "URANUS"   },
  "#neptune": { color: "#4466ff", glow: "rgba(68,102,255,",  label: "NEPTUNE"  },
  "#overview":{ color: "#ffffff", glow: "rgba(255,255,255,", label: ""         },
};

function PlanetArrivalEffect({ currentHash }: { currentHash: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef  = useRef<"idle"|"flash"|"ring"|"title"|"scan"|"fadeout">("idle");
  const timerRef  = useRef(0);
  const animRef   = useRef<number>(0);
  const prevHash  = useRef<string>("#overview");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width;
    const H = canvas.height;

    // Trigger khi hash thay đổi sang hành tinh mới
    if (currentHash === prevHash.current) return;
    prevHash.current = currentHash;

    if (currentHash === "#overview") {
      phaseRef.current = "idle";
      ctx.clearRect(0, 0, W, H);
      return;
    }

    const theme = PLANET_THEME[currentHash] ?? PLANET_THEME["#earth"];

    // Trạng thái animation
    let phase: "flash"|"ring"|"title"|"scan"|"fadeout" = "flash";
    let timer = 0;
    // Ring state
    let ringR = 0;
    // Title state
    let titleAlpha = 0;
    let titleY = H * 0.5 - 60;
    // Scan state
    let scanY = 0;
    let scanAlpha = 0;
    // Fadeout
    let overallAlpha = 1;

    cancelAnimationFrame(animRef.current);

    function tick() {
      ctx!.clearRect(0, 0, W, H);
      timer++;

      if (phase === "flash") {
        // Warp white flash: nhanh, sáng chói
        const a = timer < 6 ? timer / 6 : Math.max(0, 1 - (timer - 6) / 10);
        ctx!.fillStyle = `rgba(255,255,255,${a * 0.85})`;
        ctx!.fillRect(0, 0, W, H);
        // Radial burst from center
        const burst = ctx!.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H) * 0.7);
        burst.addColorStop(0,   `${theme.glow}${a * 0.6})`);
        burst.addColorStop(0.5, `${theme.glow}${a * 0.2})`);
        burst.addColorStop(1,   `${theme.glow}0)`);
        ctx!.fillStyle = burst;
        ctx!.fillRect(0, 0, W, H);

        if (timer >= 18) { phase = "ring"; timer = 0; }

      } else if (phase === "ring") {
        // Shockwave rings tỏa ra từ tâm
        ringR += 28;
        const maxR = Math.max(W, H) * 0.9;
        const a = Math.max(0, 1 - ringR / maxR);

        // 3 concentric rings at different offsets
        [0, 60, 120].forEach((offset) => {
          const r = ringR - offset;
          if (r <= 0) return;
          const ra = Math.max(0, 1 - r / maxR);
          ctx!.beginPath();
          ctx!.arc(W/2, H/2, r, 0, Math.PI * 2);
          ctx!.strokeStyle = `${theme.glow}${ra * 0.7})`;
          ctx!.lineWidth = 3 - offset * 0.015;
          ctx!.shadowColor = theme.color;
          ctx!.shadowBlur = 18;
          ctx!.stroke();
          ctx!.shadowBlur = 0;
        });

        // Light edge vignette tinted with planet color
        const vig = ctx!.createRadialGradient(W/2, H/2, Math.max(W,H)*0.3, W/2, H/2, Math.max(W,H)*0.8);
        vig.addColorStop(0, `${theme.glow}0)`);
        vig.addColorStop(1, `${theme.glow}${a * 0.25})`);
        ctx!.fillStyle = vig;
        ctx!.fillRect(0, 0, W, H);

        if (timer >= 1) { phase = "title"; timer = 0; }

      } else if (phase === "title") {
        // Rings still lingering
        const lingerR = ringR + timer * 28;
        const la = Math.max(0, 1 - lingerR / (Math.max(W,H) * 1.2));
        if (la > 0) {
          ctx!.beginPath();
          ctx!.arc(W/2, H/2, lingerR, 0, Math.PI * 2);
          ctx!.strokeStyle = `${theme.glow}${la * 0.3})`;
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }

        // Title drops in from above
        titleAlpha = Math.min(1, timer / 15);
        titleY = H * 0.5 - 40 - Math.max(0, (20 - timer) * 3);

        ctx!.save();
        ctx!.globalAlpha = titleAlpha;

        // Horizontal line above & below
        const lineW = 340;
        ctx!.strokeStyle = theme.color;
        ctx!.lineWidth = 1;
        ctx!.globalAlpha = titleAlpha * 0.6;
        ctx!.beginPath(); ctx!.moveTo(W/2 - lineW/2, titleY - 28); ctx!.lineTo(W/2 + lineW/2, titleY - 28); ctx!.stroke();
        ctx!.beginPath(); ctx!.moveTo(W/2 - lineW/2, titleY + 52); ctx!.lineTo(W/2 + lineW/2, titleY + 52); ctx!.stroke();

        // Sub label "ENTERING ORBIT"
        ctx!.globalAlpha = titleAlpha * 0.7;
        ctx!.fillStyle = theme.color;
        ctx!.font = "bold 11px 'Courier New', monospace";
        ctx!.textAlign = "center";
        ctx!.letterSpacing = "6px";
        ctx!.fillText("// ENTERING ORBIT //", W/2, titleY - 10);

        // Main planet name
        ctx!.globalAlpha = titleAlpha;
        ctx!.shadowColor = theme.color;
        ctx!.shadowBlur = 30;
        ctx!.fillStyle = "#ffffff";
        ctx!.font = `900 ${Math.min(90, W / 8)}px 'Arial Black', sans-serif`;
        ctx!.textAlign = "center";
        ctx!.fillText(theme.label, W/2, titleY + 40);

        // Double shadow for glow depth
        ctx!.shadowColor = theme.color;
        ctx!.shadowBlur = 60;
        ctx!.globalAlpha = titleAlpha * 0.5;
        ctx!.fillText(theme.label, W/2, titleY + 40);

        ctx!.shadowBlur = 0;
        ctx!.restore();

        if (timer >= 35) { phase = "scan"; scanY = 0; scanAlpha = 0; timer = 0; }

      } else if (phase === "scan") {
        // Lặp lại title nhưng mờ dần
        titleAlpha = Math.max(0, 1 - timer / 30);
        ctx!.save();
        ctx!.globalAlpha = titleAlpha;
        ctx!.shadowColor = theme.color;
        ctx!.shadowBlur = 20;
        ctx!.fillStyle = "#ffffff";
        ctx!.font = `900 ${Math.min(90, W / 8)}px 'Arial Black', sans-serif`;
        ctx!.textAlign = "center";
        ctx!.fillText(theme.label, W/2, titleY + 40);
        ctx!.restore();

        // Scan line quét từ trên xuống
        scanY = (timer / 30) * H;
        scanAlpha = Math.sin((timer / 30) * Math.PI) * 0.6;
        const scanGrd = ctx!.createLinearGradient(0, scanY - 40, 0, scanY + 40);
        scanGrd.addColorStop(0,   `${theme.glow}0)`);
        scanGrd.addColorStop(0.4, `${theme.glow}${scanAlpha * 0.3})`);
        scanGrd.addColorStop(0.5, `${theme.glow}${scanAlpha})`);
        scanGrd.addColorStop(0.6, `${theme.glow}${scanAlpha * 0.3})`);
        scanGrd.addColorStop(1,   `${theme.glow}0)`);
        ctx!.fillStyle = scanGrd;
        ctx!.fillRect(0, scanY - 40, W, 80);

        if (timer >= 38) { phase = "fadeout"; timer = 0; }

      } else if (phase === "fadeout") {
        overallAlpha = Math.max(0, 1 - timer / 20);
        ctx!.globalAlpha = overallAlpha;
        // faint lingering glow
        const fade = ctx!.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.6);
        fade.addColorStop(0, `${theme.glow}${overallAlpha * 0.06})`);
        fade.addColorStop(1, `${theme.glow}0)`);
        ctx!.fillStyle = fade;
        ctx!.fillRect(0, 0, W, H);
        ctx!.globalAlpha = 1;

        if (timer >= 20) {
          ctx!.clearRect(0, 0, W, H);
          return; // done — stop loop
        }
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [currentHash]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        zIndex: 5, pointerEvents: "none", display: "block",
      }}
    />
  );
}

// ─── NÚT BẤM PHONG CÁCH VIỄN TƯỞNG ─────────────────────────────────────────
function MenuButton({
  text,
  onClick,
  highlight = false,
}: {
  text: string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "16px 20px",
        backgroundColor: highlight ? "rgba(0, 243, 255, 0.15)" : "rgba(0, 0, 0, 0.4)",
        border: "none",
        borderLeft: `3px solid ${highlight ? "#00f3ff" : "rgba(0, 243, 255, 0.3)"}`,
        borderRight: "1px solid rgba(0, 243, 255, 0.1)",
        color: highlight ? "#fff" : "#b3e5fc",
        fontSize: "14px",
        fontWeight: "bold",
        letterSpacing: "3px",
        cursor: "pointer",
        textAlign: "left",
        textTransform: "uppercase",
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
        transition: "all 0.3s ease",
        boxShadow: highlight ? "inset 0 0 15px rgba(0, 243, 255, 0.2)" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0, 243, 255, 0.25)";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderLeft = "3px solid #00f3ff";
        e.currentTarget.style.boxShadow = "inset 0 0 15px rgba(0, 243, 255, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = highlight
          ? "rgba(0, 243, 255, 0.15)"
          : "rgba(0, 0, 0, 0.4)";
        e.currentTarget.style.color = highlight ? "#fff" : "#b3e5fc";
        e.currentTarget.style.borderLeft = `3px solid ${
          highlight ? "#00f3ff" : "rgba(0, 243, 255, 0.3)"
        }`;
        e.currentTarget.style.boxShadow = highlight
          ? "inset 0 0 15px rgba(0, 243, 255, 0.2)"
          : "none";
      }}
    >
      {text}
    </button>
  );
}

// ─── BẢNG THÔNG TIN ───────────────────────────────────────────────────────────
function PlanetInfoPanel({
  currentHash,
  onCorrect,
  onWrong,
}: {
  currentHash: string;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [activeView, setActiveView] = useState<string>("menu");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const data = planetData[currentHash];

  useEffect(() => {
    setActiveView("menu");
    setSelectedAnswer(null);
  }, [currentHash]);

  if (!data) return null;

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === data.correctAnswer) {
      setTimeout(() => onCorrect(), 1500);
    } else {
      onWrong();
      setTimeout(() => setSelectedAnswer(null), 800);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentHash}
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{
          position: "absolute",
          top: "8%",
          left: "60px",
          width: "380px",
          zIndex: 10,
          color: "white",
          fontFamily: "sans-serif",
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px),
            linear-gradient(135deg, rgba(2,11,26,0.85) 0%, rgba(0,34,68,0.6) 100%)`,
          border: "1px solid rgba(0, 243, 255, 0.3)",
          borderTop: "3px solid #00f3ff",
          borderBottom: "3px solid #00f3ff",
          boxShadow:
            "0 0 40px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 243, 255, 0.1)",
          borderRadius: "4px",
          padding: "30px",
          backdropFilter: "blur(15px)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "#00f3ff",
            marginBottom: "15px",
            opacity: 0.8,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <span>SYS.DAT // {currentHash.replace("#", "")}</span>
          <span>[ UFO LINKED ]</span>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            borderBottom: "1px dashed rgba(0, 243, 255, 0.4)",
            paddingBottom: "15px",
            position: "relative",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "44px",
              fontWeight: "900",
              letterSpacing: "6px",
              color: "#e0f7fa",
              textShadow: "0 0 20px #00f3ff, 0 0 40px #00f3ff",
            }}
          >
            {data.name}
          </h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#00f3ff", letterSpacing: "8px" }}>
            {data.type}
          </p>
          <div
            style={{
              position: "absolute",
              bottom: "-3px",
              left: "0",
              width: "5px",
              height: "5px",
              backgroundColor: "#00f3ff",
              boxShadow: "0 0 10px #00f3ff",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-3px",
              right: "0",
              width: "5px",
              height: "5px",
              backgroundColor: "#00f3ff",
              boxShadow: "0 0 10px #00f3ff",
            }}
          />
        </div>

        {activeView === "menu" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <MenuButton text="VISIT"           onClick={() => setActiveView("visit")} />
            <MenuButton text="ENCYCLOPEDIA"    onClick={() => setActiveView("encyclopedia")} />
            <MenuButton text="STRUCTURE"       onClick={() => setActiveView("structure")} />
            <MenuButton text="QUESTION (QUIZ)" highlight onClick={() => setActiveView("quiz")} />
          </motion.div>
        )}

        {["visit", "encyclopedia", "structure"].includes(activeView) && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3
              style={{
                marginTop: 0,
                color: "#00f3ff",
                fontSize: "16px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {activeView}
            </h3>
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#d0e8f2",
                marginBottom: "25px",
                fontWeight: "300",
              }}
            >
              {data[activeView]}
            </p>
            <MenuButton text="BACK TO MENU" onClick={() => setActiveView("menu")} highlight />
          </motion.div>
        )}

        {activeView === "quiz" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h3
              style={{
                marginTop: 0,
                color: "#00f3ff",
                fontSize: "16px",
                textTransform: "uppercase",
              }}
            >
              Quiz / System Test
            </h3>
            <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "20px", color: "#e0f7fa" }}>
              {data.question}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {data.options.map((option: string, index: number) => {
                let bgColor = "rgba(0,0,0,0.4)";
                let borderColor = "rgba(0, 243, 255, 0.2)";
                let textColor = "white";
                if (selectedAnswer !== null) {
                  if (index === data.correctAnswer) {
                    bgColor = "rgba(0,255,0,0.2)";
                    borderColor = "#00ff00";
                    textColor = "#00ff00";
                  } else if (index === selectedAnswer) {
                    bgColor = "rgba(255,0,0,0.4)";
                    borderColor = "#ff0000";
                    textColor = "#ff0000";
                  }
                }
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      cursor: selectedAnswer === null ? "pointer" : "default",
                      borderRadius: "4px",
                      transition: "all 0.3s",
                      clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {selectedAnswer !== null && (
              <MenuButton
                text="BACK TO MENU"
                onClick={() => { setActiveView("menu"); setSelectedAnswer(null); }}
                highlight
              />
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── ĐƯỜNG QUỸ ĐẠO ───────────────────────────────────────────────────────────
function OrbitLine({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * 2 * Math.PI;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);
  return <Line points={points} color="white" lineWidth={1} transparent opacity={0.25} />;
}

// ─── TRỤC QUAY CHO HÀNH TINH ─────────────────────────────────────────────────
function OrbitGroup({
  speed,
  children,
  planetHash,
  anglesRef,
}: {
  speed: number;
  children: React.ReactNode;
  planetHash?: string;
  anglesRef?: React.MutableRefObject<Record<string, number>>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (planetHash && anglesRef) {
      anglesRef.current[planetHash] = (anglesRef.current[planetHash] ?? 0) + speed * delta;
      groupRef.current.rotation.y = anglesRef.current[planetHash];
    } else {
      groupRef.current.rotation.y += speed * delta;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

// ─── [NHIỆM VỤ 3] ULTRA UFO TRAIL ───────────────────────────────────────────
// Vệt sáng: plasma core cực sáng, 8 outer cone lines, energy rings dọc trail,
// 24 sparks hào quang, rainbow color shift theo tốc độ
const TRAIL_RAW_MAX  = 120;
const TRAIL_STEPS    = 80;
const TRAIL_MAX_W    = 5.5;
const TRAIL_OUTER_N  = 8;
const SPARK_COUNT    = 24;
const RING_COUNT     = 6;   // energy rings cắt ngang trail

function RocketTrail({
  posRef,
  velRef,
  currentHash,
}: {
  posRef: React.MutableRefObject<THREE.Vector3>;
  velRef: React.MutableRefObject<THREE.Vector3>;
  currentHash: string;
}) {
  const rawBuffer = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_RAW_MAX }, () => new THREE.Vector3())
  );
  const rawCount        = useRef(0);
  const lastRecordedPos = useRef(new THREE.Vector3(Infinity, Infinity, Infinity));
  const curve = useMemo(() => new THREE.CatmullRomCurve3([], false, "catmullrom", 0.5), []);

  const _vel   = useRef(new THREE.Vector3());
  const _perpA = useRef(new THREE.Vector3());
  const _perpB = useRef(new THREE.Vector3());
  const _pt    = useRef(new THREE.Vector3());

  const outerDirs = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_OUTER_N }, () => new THREE.Vector3())
  );

  const makeGeo = (n: number) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("color",    new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setDrawRange(0, 0);
    return g;
  };

  // Geometries
  const coreGeo   = useMemo(() => makeGeo(TRAIL_STEPS), []);
  const core2Geo  = useMemo(() => makeGeo(TRAIL_STEPS), []); // second brighter core pass
  const haloGeo   = useMemo(() => makeGeo(TRAIL_STEPS), []);
  const outerGeos = useMemo(() => Array.from({ length: TRAIL_OUTER_N }, () => makeGeo(TRAIL_STEPS)), []);
  // Energy rings: each ring = small circle of 32 points
  const RING_PTS  = 32;
  const ringGeos  = useMemo(() => Array.from({ length: RING_COUNT }, () => makeGeo(RING_PTS + 1)), []);
  const sparkGeo  = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SPARK_COUNT * 3), 3));
    g.setAttribute("color",    new THREE.BufferAttribute(new Float32Array(SPARK_COUNT * 3), 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  // Materials
  const coreMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 1.0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);
  const core2Mat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);
  const haloMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);
  const outerMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.50,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);
  const ringMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.75,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);
  const sparkMat = useMemo(() => new THREE.PointsMaterial({
    vertexColors: true, transparent: true, size: 1.4,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }), []);

  const sparkState = useRef(
    Array.from({ length: SPARK_COUNT }, () => ({
      u: Math.random(),
      offset: new THREE.Vector3((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4),
      life: Math.random(),
      speed: 0.25 + Math.random() * 0.75,
    }))
  );

  useEffect(() => {
    rawCount.current = 0;
    lastRecordedPos.current.set(Infinity, Infinity, Infinity);
    coreGeo.setDrawRange(0, 0);
    core2Geo.setDrawRange(0, 0);
    haloGeo.setDrawRange(0, 0);
    outerGeos.forEach((g) => g.setDrawRange(0, 0));
    ringGeos.forEach((g) => g.setDrawRange(0, 0));
    sparkGeo.setDrawRange(0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHash]);

  useFrame(({ clock }, delta) => {
    const worldPos = posRef.current;
    if (!worldPos) return;

    const t     = clock.getElapsedTime();
    const speed = velRef.current.length();

    const MIN_DIST = 0.03;
    if (worldPos.distanceTo(lastRecordedPos.current) > MIN_DIST) {
      if (rawCount.current < TRAIL_RAW_MAX) {
        rawBuffer.current[rawCount.current].copy(worldPos);
        rawCount.current++;
      } else {
        for (let i = 0; i < TRAIL_RAW_MAX - 1; i++) rawBuffer.current[i].copy(rawBuffer.current[i + 1]);
        rawBuffer.current[TRAIL_RAW_MAX - 1].copy(worldPos);
      }
      lastRecordedPos.current.copy(worldPos);
    }

    if (rawCount.current < 3) return;

    const speedRatio  = Math.min(speed / 0.30, 1.0);
    const targetDepth = Math.max(10, Math.round(10 + speedRatio * (TRAIL_RAW_MAX - 10)));
    const usedCount   = Math.min(rawCount.current, targetDepth);
    const offset      = rawCount.current - usedCount;
    const activePts   = rawBuffer.current.slice(offset, rawCount.current);
    if (activePts.length < 3) return;

    curve.points = activePts;
    const steps = Math.min(TRAIL_STEPS, activePts.length * 4);

    _vel.current.copy(velRef.current);
    const velLen = _vel.current.length();
    if (velLen < 0.0005) return;
    _vel.current.divideScalar(velLen);

    const refUp = Math.abs(_vel.current.y) < 0.95
      ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    _perpA.current.crossVectors(_vel.current, refUp).normalize();
    _perpB.current.crossVectors(_vel.current, _perpA.current).normalize();

    for (let di = 0; di < TRAIL_OUTER_N; di++) {
      const angle = (di / TRAIL_OUTER_N) * Math.PI * 2;
      outerDirs.current[di]
        .copy(_perpA.current).multiplyScalar(Math.cos(angle))
        .addScaledVector(_perpB.current, Math.sin(angle));
    }

    // ── PLASMA CORE 1 — white-hot centre ────────────────────────────────
    const corePosA = coreGeo.attributes.position as THREE.BufferAttribute;
    const coreColA = coreGeo.attributes.color    as THREE.BufferAttribute;
    for (let i = 0; i < steps; i++) {
      const u  = i / (steps - 1);
      const pt = curve.getPoint(u, _pt.current);
      corePosA.setXYZ(i, pt.x, pt.y, pt.z);
      const a = Math.pow(u, 0.5);
      // Rainbow hue cycle: cyan→violet→cyan based on time & position
      const hue = (t * 0.3 + u * 0.5) % 1.0;
      const r = a * (0.2 + 0.8 * Math.max(0, Math.sin(hue * Math.PI * 2)));
      const g = a * (0.7 + 0.3 * Math.cos(hue * Math.PI * 2 + 1));
      const b = a * 1.0;
      coreColA.setXYZ(i, r, g, b);
    }
    coreGeo.setDrawRange(0, steps);
    corePosA.needsUpdate = true; coreColA.needsUpdate = true;

    // ── PLASMA CORE 2 — pure white near UFO ─────────────────────────────
    const c2PosA = core2Geo.attributes.position as THREE.BufferAttribute;
    const c2ColA = core2Geo.attributes.color    as THREE.BufferAttribute;
    for (let i = 0; i < steps; i++) {
      const u  = i / (steps - 1);
      const pt = curve.getPoint(u, _pt.current);
      c2PosA.setXYZ(i, pt.x, pt.y, pt.z);
      const a = Math.pow(u, 0.3) * (1 - u * 0.6);
      c2ColA.setXYZ(i, a, a, a); // pure white pulse near head
    }
    core2Geo.setDrawRange(0, steps);
    c2PosA.needsUpdate = true; c2ColA.needsUpdate = true;

    // ── HALO — wide translucent glow ────────────────────────────────────
    const haloPosA = haloGeo.attributes.position as THREE.BufferAttribute;
    const haloColA = haloGeo.attributes.color    as THREE.BufferAttribute;
    for (let i = 0; i < steps; i++) {
      const u   = i / (steps - 1);
      const pt  = curve.getPoint(u, _pt.current);
      const bob = Math.sin(t * 10 + u * 15) * 0.35 * (1 - u);
      haloPosA.setXYZ(i, pt.x + _perpA.current.x * bob, pt.y + bob, pt.z + _perpA.current.z * bob);
      const a = Math.pow(u, 0.8) * 0.9;
      haloColA.setXYZ(i, a * 0.1, a * 0.9, a * 1.0);
    }
    haloGeo.setDrawRange(0, steps);
    haloPosA.needsUpdate = true; haloColA.needsUpdate = true;

    // ── OUTER CONE LINES (8 lines, twisted, color-shifting) ─────────────
    outerGeos.forEach((geo, di) => {
      const dir      = outerDirs.current[di];
      const posAttr  = geo.attributes.position as THREE.BufferAttribute;
      const colAttr  = geo.attributes.color    as THREE.BufferAttribute;
      const phase    = di * (Math.PI * 2 / TRAIL_OUTER_N);
      for (let i = 0; i < steps; i++) {
        const u      = i / (steps - 1);
        const pt     = curve.getPoint(u, _pt.current);
        const coneU  = 1 - u;
        const radius = TRAIL_MAX_W * Math.pow(coneU, 0.45)
          * (0.65 + 0.35 * Math.sin(t * 16 + u * 10 + phase));
        const twist  = coneU * 0.5 * Math.sin(t * 4 + phase);
        const td = new THREE.Vector3(
          dir.x * Math.cos(twist) - dir.z * Math.sin(twist),
          dir.y,
          dir.x * Math.sin(twist) + dir.z * Math.cos(twist)
        );
        posAttr.setXYZ(i, pt.x + td.x * radius, pt.y + td.y * radius, pt.z + td.z * radius);
        // Alternating: teal / purple / gold outer rays
        const a = Math.pow(u, 1.1) * 0.65;
        const colorCycle = (di % 3);
        const r = a * (colorCycle === 2 ? 1.0 : colorCycle === 1 ? 0.5 : 0.05);
        const g = a * (colorCycle === 2 ? 0.8 : colorCycle === 1 ? 0.1 : 0.8);
        const b = a * (colorCycle === 2 ? 0.0 : colorCycle === 1 ? 1.0 : 1.0);
        colAttr.setXYZ(i, r, g, b);
      }
      geo.setDrawRange(0, steps);
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color    as THREE.BufferAttribute).needsUpdate = true;
    });

    // ── ENERGY RINGS — circles slicing through the trail ─────────────────
    ringGeos.forEach((geo, ri) => {
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const colAttr = geo.attributes.color    as THREE.BufferAttribute;
      // Each ring travels along the trail animated
      const ringU = ((t * 0.45 + ri / RING_COUNT) % 1.0);
      if (ringU < 0.02 || ringU > 0.98) { geo.setDrawRange(0, 0); return; }
      const ringPt = curve.getPoint(ringU, _pt.current);
      // Ring radius grows toward tail
      const rRadius = TRAIL_MAX_W * (1 - ringU) * 1.2 * (0.8 + 0.2 * Math.sin(t * 8 + ri));
      // Ring color pulses — each ring gets own hue
      const hue = (ri / RING_COUNT + t * 0.1) % 1.0;
      const rr = 0.3 + 0.7 * Math.sin(hue * Math.PI * 2);
      const rg = 0.5 + 0.5 * Math.cos(hue * Math.PI * 2);
      const rb = 1.0;
      const alpha = (1 - ringU) * 0.9;
      for (let pi = 0; pi <= RING_PTS; pi++) {
        const angle = (pi / RING_PTS) * Math.PI * 2;
        const px = ringPt.x + _perpA.current.x * Math.cos(angle) * rRadius + _perpB.current.x * Math.sin(angle) * rRadius;
        const py = ringPt.y + _perpA.current.y * Math.cos(angle) * rRadius + _perpB.current.y * Math.sin(angle) * rRadius;
        const pz = ringPt.z + _perpA.current.z * Math.cos(angle) * rRadius + _perpB.current.z * Math.sin(angle) * rRadius;
        posAttr.setXYZ(pi, px, py, pz);
        const fade = alpha * (0.7 + 0.3 * Math.sin(t * 20 + pi * 0.5));
        colAttr.setXYZ(pi, rr * fade, rg * fade, rb * fade);
      }
      geo.setDrawRange(0, RING_PTS + 1);
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color    as THREE.BufferAttribute).needsUpdate = true;
    });

    // ── SPARKS — 24 glittering particles ────────────────────────────────
    const spkPos = sparkGeo.attributes.position as THREE.BufferAttribute;
    const spkCol = sparkGeo.attributes.color    as THREE.BufferAttribute;
    let   spkDrawn = 0;
    sparkState.current.forEach((sp, si) => {
      sp.life += delta * sp.speed * 1.4;
      if (sp.life > 1.0) {
        sp.life = 0;
        sp.u    = Math.random() * 0.9;
        sp.offset.set(
          (Math.random()-0.5) * TRAIL_MAX_W * 2.2,
          (Math.random()-0.5) * TRAIL_MAX_W * 2.2,
          (Math.random()-0.5) * TRAIL_MAX_W * 2.2,
        );
        sp.speed = 0.25 + Math.random() * 0.75;
      }
      if (sp.u >= 0 && sp.u <= 1 && activePts.length >= 3) {
        const pt   = curve.getPoint(sp.u, _pt.current);
        const fade = (1 - sp.life) * (1 - sp.u * 0.5);
        spkPos.setXYZ(spkDrawn,
          pt.x + sp.offset.x * sp.life * 0.6,
          pt.y + sp.offset.y * sp.life * 0.6,
          pt.z + sp.offset.z * sp.life * 0.6
        );
        const flash = fade * (0.5 + 0.5 * Math.sin(t * 40 + si * 1.7));
        // sparks cycle: white / cyan / violet
        const sc = si % 3;
        spkCol.setXYZ(spkDrawn,
          flash * (sc === 0 ? 1.0 : sc === 2 ? 0.8 : 0.1),
          flash * (sc === 0 ? 1.0 : sc === 2 ? 0.1 : 1.0),
          flash * 1.0
        );
        spkDrawn++;
      }
    });
    sparkGeo.setDrawRange(0, spkDrawn);
    spkPos.needsUpdate = true;
    spkCol.needsUpdate = true;
  });

  return (
    <>
      {/* @ts-ignore */}
      <line geometry={coreGeo}   material={coreMat}  />
      {/* @ts-ignore */}
      <line geometry={core2Geo}  material={core2Mat} />
      {/* @ts-ignore */}
      <line geometry={haloGeo}   material={haloMat}  />
      {outerGeos.map((geo, i) => (
        // @ts-ignore
        <line key={`o${i}`} geometry={geo} material={outerMat} />
      ))}
      {ringGeos.map((geo, i) => (
        // @ts-ignore
        <line key={`r${i}`} geometry={geo} material={ringMat} />
      ))}
      {/* @ts-ignore */}
      <points geometry={sparkGeo} material={sparkMat} />
    </>
  );
}

// ─── UFO ERROR EFFECT — electric bolts + red shockwave khi trả lời sai ──────
function UFOErrorEffect({ isShaking, ufoPos }: { isShaking: boolean; ufoPos: React.MutableRefObject<THREE.Vector3> }) {
  const BOLT_COUNT = 8;
  const boltGeos = useMemo(() =>
    Array.from({ length: BOLT_COUNT }, () => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(12 * 3), 3));
      g.setDrawRange(0, 0);
      return g;
    }), []
  );
  const boltMat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color(1, 0.05, 0.05),
    transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  const shockGeos = useMemo(() =>
    Array.from({ length: 3 }, () => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(64 * 3), 3));
      g.setDrawRange(0, 0);
      return g;
    }), []
  );
  const shockMat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color(1, 0.08, 0.08),
    transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }), []);

  const errorTimer = useRef(0);
  const wasShaking = useRef(false);

  useFrame(({ clock }, delta) => {
    if (!wasShaking.current && isShaking) errorTimer.current = 0;
    wasShaking.current = isShaking;

    if (!isShaking) {
      boltGeos.forEach((g) => g.setDrawRange(0, 0));
      shockGeos.forEach((g) => g.setDrawRange(0, 0));
      return;
    }
    errorTimer.current += delta;
    const t = clock.getElapsedTime();
    const ox = ufoPos.current.x;
    const oy = ufoPos.current.y;
    const oz = ufoPos.current.z;

    // Electric bolts — jagged lightning radiating out
    boltGeos.forEach((geo, bi) => {
      const posA = geo.attributes.position as THREE.BufferAttribute;
      const baseAngle = (bi / BOLT_COUNT) * Math.PI * 2 + t * 15;
      const segments = 11;
      posA.setXYZ(0, ox, oy, oz);
      for (let si = 1; si <= segments; si++) {
        const r      = (si / segments) * (12 + 5 * Math.sin(t * 40 + bi * 1.4));
        const jitter = si > 0 && si < segments ? (Math.random() - 0.5) * 5 : 0;
        const a      = baseAngle + jitter * 0.5;
        posA.setXYZ(si,
          ox + Math.cos(a) * r + jitter,
          oy + Math.sin(t * 25 + bi) * r * 0.3 + jitter * 0.5,
          oz + Math.sin(a) * r + jitter
        );
      }
      geo.setDrawRange(0, segments + 1);
      posA.needsUpdate = true;
    });

    // Expanding red shockwave rings
    shockGeos.forEach((geo, ri) => {
      const delay = ri * 0.07;
      const et = Math.max(0, errorTimer.current - delay);
      const ringR = et * 50;
      if (ringR <= 0.5) { geo.setDrawRange(0, 0); return; }
      const posA = geo.attributes.position as THREE.BufferAttribute;
      for (let pi = 0; pi < 64; pi++) {
        const angle = (pi / 64) * Math.PI * 2;
        posA.setXYZ(pi,
          ox + Math.cos(angle) * ringR,
          oy + Math.sin(t * 6 + ri) * 2,
          oz + Math.sin(angle) * ringR
        );
      }
      geo.setDrawRange(0, 64);
      posA.needsUpdate = true;
    });
    shockMat.opacity = Math.max(0, 0.9 - errorTimer.current * 2.0);
    boltMat.opacity  = Math.max(0, 1.0 - errorTimer.current * 1.5);
  });

  return (
    <>
      {boltGeos.map((geo, i) => (
        // @ts-ignore
        <line key={`bolt${i}`} geometry={geo} material={boltMat} />
      ))}
      {shockGeos.map((geo, i) => (
        // @ts-ignore
        <line key={`shock${i}`} geometry={geo} material={shockMat} />
      ))}
    </>
  );
}

// ─── MÔ HÌNH ĐĨA BAY (UFO) ───────────────────────────────────────────────────
function UFO({
  currentHash,
  isShaking,
  worldPosRef,
  velWorldRef,
  anglesRef,
}: {
  currentHash: string;
  isShaking: boolean;
  worldPosRef: React.MutableRefObject<THREE.Vector3>;
  velWorldRef: React.MutableRefObject<THREE.Vector3>;
  anglesRef: React.MutableRefObject<Record<string, number>>;
}) {
  const ufoRef = useRef<THREE.Group>(null);

  const prevPosition  = useRef(new THREE.Vector3());
  const velocity      = useRef(new THREE.Vector3());
  const smoothedBank  = useRef(new THREE.Euler());
  const shouldSnap    = useRef(true);
  const prevHash      = useRef(currentHash);
  const _target       = useRef(new THREE.Vector3());

  const obj = useLoader(OBJLoader, "/models/ufo.obj");
  const [, normalMap, , glowMap] = useLoader(THREE.TextureLoader, [
    "/models/ufo_diffuse.png",
    "/models/ufo_normal.png",
    "/models/ufo_spec.png",
    "/models/ufo_diffuse_glow.png",
  ]);

  useMemo(() => {
    obj.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          normalMap,
          emissiveMap:       glowMap,
          color:             new THREE.Color("#ffffff"),
          emissive:          new THREE.Color("#ffffff"),
          emissiveIntensity: 1.2,
          metalness: 0.1,
          roughness: 0.6,
        });
      }
    });
  }, [obj, normalMap, glowMap]);

  useEffect(() => {
    if (prevHash.current !== currentHash) {
      shouldSnap.current = true;
      prevHash.current   = currentHash;
    }
  }, [currentHash]);

  useFrame(({ clock }) => {
    if (!ufoRef.current) return;
    const time = clock.getElapsedTime();

    _target.current.set(0, 30, 80);

    if (currentHash !== "#overview" && ORBIT_CONFIG[currentHash]) {
      const cfg   = ORBIT_CONFIG[currentHash];
      const angle = anglesRef.current[currentHash] ?? 0;
      const planetX = Math.sin(angle) * cfg.radius;
      const planetZ = Math.cos(angle) * cfg.radius;
      _target.current.set(planetX, cfg.ufoHeight, planetZ);
    }

    if (shouldSnap.current) {
      ufoRef.current.position.copy(_target.current);
      prevPosition.current.copy(_target.current);
      velocity.current.set(0, 0, 0);
      shouldSnap.current = false;
    }

    prevPosition.current.copy(ufoRef.current.position);
    ufoRef.current.position.lerp(_target.current, 0.10);
    velocity.current.subVectors(ufoRef.current.position, prevPosition.current);

    ufoRef.current.position.y += Math.sin(time * 2.2) * 0.09;
    ufoRef.current.rotation.y += 0.022;

    const targetBankZ = -velocity.current.x * 0.55;
    const targetBankX = -velocity.current.z * 0.55;
    smoothedBank.current.x = THREE.MathUtils.lerp(smoothedBank.current.x, targetBankX, 0.08);
    smoothedBank.current.z = THREE.MathUtils.lerp(smoothedBank.current.z, targetBankZ, 0.08);
    ufoRef.current.rotation.x = smoothedBank.current.x;
    ufoRef.current.rotation.z = smoothedBank.current.z;

    if (isShaking) {
      ufoRef.current.position.x += (Math.random() - 0.5) * 4;
      ufoRef.current.position.y += (Math.random() - 0.5) * 4;
      ufoRef.current.position.z += (Math.random() - 0.5) * 4;
    }

    worldPosRef.current.copy(ufoRef.current.position);
    velWorldRef.current.copy(velocity.current);
  });

  const ufoScale =
    currentHash !== "#overview" && ORBIT_CONFIG[currentHash]
      ? ORBIT_CONFIG[currentHash].ufoScale
      : 0.38;

  return (
    <group ref={ufoRef}>
      <primitive object={obj} scale={ufoScale} position={[0, 0, 0]} />
      <pointLight position={[0, 10, 0]}   intensity={100} color="#ffffff" distance={30} />
      <pointLight position={[10, -5, 10]} intensity={50}  color="#ffffff" distance={30} />
      {isShaking && (
        <pointLight position={[0, 0, 0]} color="#ff0000" intensity={200} distance={80} />
      )}
    </group>
  );
}

// ─── [NHIỆM VỤ 2] CAMERA CONTROLLER (FIX CINEMATIC LOCK) ────────────────────
// Thêm: khi isCinematic đổi từ true→false, reset isUserDragging để camera
// không bị kẹt ở vị trí cinematic. Dùng ref `cinematicWasActive` để detect edge.
function CameraController({
  currentHash,
  isCinematic,
  anglesRef,
}: {
  currentHash: string;
  isCinematic: boolean;
  anglesRef: React.MutableRefObject<Record<string, number>>;
}) {
  const { camera, controls } = useThree() as any;
  const isUserDragging   = useRef(false);
  const cinematicWasOn   = useRef(false);        // ← NEW: track previous cinematic state
  const orbitConfig      = useMemo(() => ORBIT_CONFIG, []);

  useEffect(() => {
    if (!controls) return;
    const onStart = () => { isUserDragging.current = true; };
    const onEnd   = () => { /* keep dragging true until hash changes */ };
    controls.addEventListener("start", onStart);
    return () => controls.removeEventListener("start", onStart);
  }, [controls]);

  // Reset drag lock on hash change
  useEffect(() => { isUserDragging.current = false; }, [currentHash]);

  // ── [FIX] Khi cinematic vừa tắt → bỏ khoá camera ───────────────────────
  useEffect(() => {
    if (!isCinematic && cinematicWasOn.current) {
      // Cinematic vừa bị tắt → cho phép auto-follow lại
      isUserDragging.current = false;
    }
    cinematicWasOn.current = isCinematic;
  }, [isCinematic]);

  useFrame((state) => {
    if (!controls) return;

    if (isCinematic) {
      const t = state.clock.getElapsedTime() * 0.08;
      camera.position.x = Math.sin(t) * 1200;
      camera.position.z = Math.cos(t) * 1200;
      camera.position.y = 80 + Math.sin(t * 0.5) * 60;
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
      return;
    }

    // ── Khi KHÔNG cinematic: luôn cho phép OrbitControls hoạt động ──────
    // Chỉ auto-move camera khi user chưa drag (isUserDragging = false)
    let targetCenter = new THREE.Vector3(0, 0, 0);
    let targetCamPos = new THREE.Vector3(250, 150, 500);

    if (currentHash !== "#overview" && orbitConfig[currentHash]) {
      const cfg   = orbitConfig[currentHash];
      const angle = anglesRef.current[currentHash] ?? 0;
      const px    = Math.sin(angle) * cfg.radius;
      const pz    = Math.cos(angle) * cfg.radius;
      targetCenter.set(px, 0, pz);
      targetCamPos.set(px + cfg.camOffset[0], cfg.camOffset[1], pz + cfg.camOffset[2]);
    }

    // Target (orbit pivot) always follows planet so you can orbit around it
    controls.target.lerp(targetCenter, 0.06);

    // Only move camera position if user hasn't manually dragged
    if (!isUserDragging.current) {
      camera.position.lerp(targetCamPos, 0.04);
    }

    controls.update();
  });

  return null;
}

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function SolarSystem() {
  const [currentHash,     setCurrentHash]     = useState("#overview");
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [isShaking,       setIsShaking]       = useState(false);
  const [solarSpeed,      setSolarSpeed]      = useState(1);
  const [bloomIntensity,  setBloomIntensity]  = useState(1.5);
  const [isCinematic,     setIsCinematic]     = useState(false);

  const ufoWorldPos = useRef(new THREE.Vector3());
  const ufoVelWorld = useRef(new THREE.Vector3());

  const planetAngles = useRef<Record<string, number>>({
    "#mercury": 0,
    "#venus":   0,
    "#earth":   0,
    "#mars":    0,
    "#jupiter": 0,
    "#saturn":  0,
    "#uranus":  0,
    "#neptune": 0,
  });

  const planetHashes = [
    "#overview",
    "#mercury", "#venus", "#earth", "#mars",
    "#jupiter", "#saturn", "#uranus", "#neptune",
  ];

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash || "#overview");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    const idx = planetHashes.indexOf(currentHash);
    if (e.deltaY > 50  && idx < planetHashes.length - 1) window.location.hash = planetHashes[idx + 1];
    else if (e.deltaY < -50 && idx > 0)                  window.location.hash = planetHashes[idx - 1];
  };

  const handleWrongAnswer = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleCorrectAnswer = () => {
    const idx = planetHashes.indexOf(currentHash);
    if (idx < planetHashes.length - 1) {
      window.location.hash = planetHashes[idx + 1];
    } else {
      window.location.hash = "#overview";
      setTimeout(() => alert("Chúc mừng Thuyền trưởng! Bạn đã chinh phục toàn bộ Hệ Mặt Trời!"), 500);
    }
  };

  return (
    <>
      <Head>
        <title>Solar System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        onWheel={handleWheel}
        style={{
          width: "100vw", height: "100vh",
          overflow: "hidden", position: "relative",
          background: "#01020a",   // fallback colour (canvas covers it)
        }}
      >
        {/* ── [NHIỆM VỤ 1] Animated Background Canvas ── */}
        <AnimatedBackground />

        {/* Three.js canvas must be transparent so background shows through */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <Canvas
            gl={{ antialias: true, alpha: true }}   // ← alpha:true để trong suốt
            style={{ background: "transparent" }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault fov={50} far={10000} />
              <OrbitControls
                makeDefault
                enablePan={false}
                minDistance={10}
                maxDistance={3000}
                enableDamping
                dampingFactor={0.06}
                rotateSpeed={0.8}
              />
              <CameraController
                currentHash={currentHash}
                isCinematic={isCinematic}
                anglesRef={planetAngles}
              />

              <ambientLight intensity={0.1} />
              <pointLight position={[0, 0, 0]} intensity={20} color="#fff8e1" distance={3000} />

              {/* Stars (Three.js layer — adds depth on top of CSS canvas) */}
              <Stars radius={3000} depth={150} count={10000} factor={50} saturation={1} fade speed={0.4} />

              <Sun isActive={currentHash === "#overview"} />

              <UFO
                currentHash={currentHash}
                isShaking={isShaking}
                worldPosRef={ufoWorldPos}
                velWorldRef={ufoVelWorld}
                anglesRef={planetAngles}
              />
              <UFOErrorEffect isShaking={isShaking} ufoPos={ufoWorldPos} />
              <RocketTrail
                posRef={ufoWorldPos}
                velRef={ufoVelWorld}
                currentHash={currentHash}
              />

              <OrbitLine radius={80}   />
              <OrbitLine radius={140}  />
              <OrbitLine radius={210}  />
              <OrbitLine radius={300}  />
              <OrbitLine radius={480}  />
              <OrbitLine radius={680}  />
              <OrbitLine radius={880}  />
              <OrbitLine radius={1050} />

              <OrbitGroup speed={0.50 * solarSpeed} planetHash="#mercury" anglesRef={planetAngles}>
                <Mercury isActive={currentHash === "#mercury"} setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#mercury")} />
              </OrbitGroup>
              <OrbitGroup speed={0.35 * solarSpeed} planetHash="#venus" anglesRef={planetAngles}>
                <Venus   isActive={currentHash === "#venus"}   setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#venus")}   />
              </OrbitGroup>
              <OrbitGroup speed={0.25 * solarSpeed} planetHash="#earth" anglesRef={planetAngles}>
                <Earth   isActive={currentHash === "#earth"}   setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#earth")}   />
              </OrbitGroup>
              <OrbitGroup speed={0.20 * solarSpeed} planetHash="#mars" anglesRef={planetAngles}>
                <Mars    isActive={currentHash === "#mars"}    setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#mars")}    />
              </OrbitGroup>

              <AsteroidBelt count={1200} innerRadius={360} outerRadius={420} speedFactor={0.3} />

              <OrbitGroup speed={0.10 * solarSpeed} planetHash="#jupiter" anglesRef={planetAngles}>
                <Jupiter isActive={currentHash === "#jupiter"} setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#jupiter")} />
              </OrbitGroup>
              <OrbitGroup speed={0.08 * solarSpeed} planetHash="#saturn" anglesRef={planetAngles}>
                <Saturn  isActive={currentHash === "#saturn"}  setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#saturn")}  />
              </OrbitGroup>
              <OrbitGroup speed={0.05 * solarSpeed} planetHash="#uranus" anglesRef={planetAngles}>
                <Uranus  isActive={currentHash === "#uranus"}  setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#uranus")}  />
              </OrbitGroup>
              <OrbitGroup speed={0.03 * solarSpeed} planetHash="#neptune" anglesRef={planetAngles}>
                <Neptune isActive={currentHash === "#neptune"} setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#neptune")} />
              </OrbitGroup>

              <AsteroidBelt count={4000} innerRadius={1300} outerRadius={1500} speedFactor={0.07} />

              <EffectComposer>
                <Bloom
                  intensity={bloomIntensity}
                  luminanceThreshold={0.2}
                  mipmapBlur
                  radius={0.5}
                />
              </EffectComposer>
              <BackgroundEffects />
            </Suspense>
          </Canvas>
        </div>

        {/* ── [NHIỆM VỤ 2] Planet arrival overlay ── */}
        <PlanetArrivalEffect currentHash={currentHash} />

        {/* Wrong answer red screen flash */}
        {isShaking && (
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
              background: "radial-gradient(ellipse at center, rgba(255,0,0,0.35) 0%, rgba(200,0,0,0.15) 50%, transparent 80%)",
              animation: "none",
              boxShadow: "inset 0 0 120px rgba(255,0,0,0.6)",
            }}
          />
        )}

        {/* HUD and UI above the canvas */}
        <div style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto" }}>
            <HUDControls
              solarSpeed={solarSpeed}
              setSolarSpeed={setSolarSpeed}
              bloomIntensity={bloomIntensity}
              setBloomIntensity={setBloomIntensity}
              isCinematic={isCinematic}
              setIsCinematic={setIsCinematic}
            />
          </div>

          {currentHash !== "#overview" && (
            <div style={{ pointerEvents: "auto" }}>
              <PlanetInfoPanel
                currentHash={currentHash}
                onCorrect={handleCorrectAnswer}
                onWrong={handleWrongAnswer}
              />
            </div>
          )}

          <button
            onClick={() => (window.location.hash = "#overview")}
            style={{
              position: "fixed", bottom: "40px", right: "40px",
              padding: "10px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "99px",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              pointerEvents: "auto",
            }}
          >
            BACK TO START
          </button>

          <div
            style={{
              position: "fixed", bottom: "20px", left: "50%",
              transform: "translateX(-50%)",
              display: "flex", gap: "10px",
              padding: "10px",
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              borderRadius: "50px",
              border: "1px solid rgba(0, 243, 255, 0.2)",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
              pointerEvents: "auto",
            }}
          >
            {Object.keys(ORBIT_CONFIG).map((hash) => (
              <button
                key={hash}
                onClick={() => (window.location.hash = hash)}
                style={{
                  padding: "8px 15px",
                  backgroundColor: currentHash === hash ? "rgba(0, 243, 255, 0.3)" : "transparent",
                  color: currentHash === hash ? "#00f3ff" : "#fff",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "12px", fontWeight: "bold",
                  cursor: "pointer", textTransform: "uppercase",
                  transition: "all 0.3s ease",
                  borderBottom: currentHash === hash ? "2px solid #00f3ff" : "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0, 243, 255, 0.2)"; }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    currentHash === hash ? "rgba(0, 243, 255, 0.3)" : "transparent";
                }}
              >
                {hash.replace("#", "")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
