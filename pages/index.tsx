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

import IntroScreen from "../src/components/IntroScreen";
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

// ─── [NHIỆM VỤ 4] DỮ LIỆU HÀNH TINH — BẢN TIẾNG ANH ─────────────────────────
const planetData: Record<string, any> = {
  "#mercury": {
    name: "MERCURY",
    type: "PLANET",
    visit: "Mercury is the smallest planet in the Solar System and the closest to the Sun. Its surface is heavily cratered from ancient impacts, looking like a giant, scorched moon. During the day, temperatures can reach hundreds of degrees Celsius, while at night they drop extremely low due to the lack of a protective atmosphere. With such harsh conditions, no known life can exist here, making Mercury a mysterious and extreme world worth exploring.",
    encyclopedia: "Mercury is the closest planet to the Sun and the smallest planet in the Solar System. It has a diameter of about 4,880 km and a rocky, cratered surface similar to the Moon. Mercury has almost no atmosphere to retain heat, leading to extreme temperature variations between day and night. It completes an orbit around the Sun in just 88 Earth days. Despite being closest to the Sun, it is not the hottest planet due to its lack of an atmosphere.",
    structure: "Mercury has a very large metallic core accounting for about 70% of its mass, which is unusual for its size. The core consists mainly of iron and nickel, partly in a molten state. Surrounding the core is a relatively thin silicate mantle and a hard rocky crust. Because of its large core, Mercury has a weak but global magnetic field.",
    question: "Which planet is closest to the Sun?",
    options: ["A. Venus", "B. Mercury", "C. Mars", "D. Jupiter"],
    correctAnswer: 1,
  },
  "#venus": {
    name: "VENUS",
    type: "PLANET",
    visit: "Venus is completely shrouded by a thick atmosphere composed primarily of carbon dioxide, along with clouds of sulfuric acid. A runaway greenhouse effect traps heat so effectively that the surface is hot enough to melt lead. The atmospheric pressure is also extremely high, enough to crush spacecraft. Despite its deadly conditions, Venus shines brightly in the night sky and is often called Earth's 'twin planet' due to their similar size and structure.",
    encyclopedia: "Venus is the second planet from the Sun, often referred to as Earth's 'sister planet' because of their similar size and composition. However, its environment is extremely harsh. The atmosphere is mostly carbon dioxide with thick clouds of sulfuric acid, creating a strong greenhouse effect. The average surface temperature is about 465°C, making it the hottest planet in the Solar System. Venus rotates very slowly and in the opposite direction to most planets.",
    structure: "Venus has a structure similar to Earth, consisting of a central iron core, a rocky mantle, and a solid crust. However, unlike Earth, Venus does not appear to have active plate tectonics. Its interior is very hot and volcanic activity may still be ongoing, although most of its surface is covered by ancient lava and volcanic plains.",
    question: "Which planet is the hottest in the solar system?",
    options: ["A. Mercury", "B. Earth", "C. Venus", "D. Mars"],
    correctAnswer: 2,
  },
  "#earth": {
    name: "EARTH",
    type: "PLANET",
    visit: "Earth is the only planet known to harbor life. With its vast oceans, breathable oxygen-rich atmosphere, and stable temperatures, it provides the perfect conditions for living organisms. From dense tropical rainforests to freezing polar regions, Earth contains an incredible diversity of life and dynamic ecosystems. It is truly a rare and precious world in the universe.",
    encyclopedia: "Earth is the third planet from the Sun and the only known planet to support life. It has a diverse environment with oceans, continents, and a nitrogen-oxygen atmosphere that sustains life. About 71% of Earth's surface is water, and its climate allows for a rich variety of ecosystems. Earth has one natural satellite, the Moon, which affects tides and stabilizes its axial tilt. Earth completes an orbit around the Sun in about 365.25 days.",
    structure: "Earth consists of four main layers: a solid inner core of iron and nickel, a liquid outer core, a viscous mantle, and a thin crust. The movement of molten iron in the outer core generates Earth's magnetic field. The mantle is responsible for plate tectonics, which shape continents and cause earthquakes and volcanoes.",
    question: "Which planet do we live on?",
    options: ["A. Mars", "B. Earth", "C. Venus", "D. Jupiter"],
    correctAnswer: 1,
  },
  "#mars": {
    name: "MARS",
    type: "PLANET",
    visit: "Mars is known as the Red Planet because its iron oxide-rich surface gives it a distinctive red color. It features giant volcanoes like Olympus Mons and deep canyons like Valles Marineris. Scientific evidence suggests that Mars once had liquid water on its surface, raising the possibility that it may have supported life in the distant past. Today, it remains one of the most explored planets in space research.",
    encyclopedia: "Mars is the fourth planet from the Sun, often called the Red Planet due to iron oxide on its surface. It hosts the largest volcano in the Solar System, Olympus Mons, and the deepest canyon, Valles Marineris. Mars has a thin atmosphere mainly composed of carbon dioxide and is very cold. Evidence suggests liquid water once existed on its surface, hinting at the possibility that Mars may have once supported microbial life. It has two small moons, Phobos and Deimos.",
    structure: "Mars has a dense core rich in iron, nickel, and sulfur, surrounded by a silicate mantle and a crust. The planet may have had an active core in the past but has cooled significantly, weakening its magnetic field. This cooling contributed to the loss of its thick atmosphere and surface water.",
    question: "Which planet is known as the 'Red Planet'?",
    options: ["A. Jupiter", "B. Mars", "C. Venus", "D. Mercury"],
    correctAnswer: 1,
  },
  "#jupiter": {
    name: "JUPITER",
    type: "GAS GIANT",
    visit: "Jupiter is the largest planet in the Solar System, composed primarily of hydrogen and helium. Its most famous feature is the Great Red Spot—a massive storm that has raged for centuries. Jupiter also has a powerful magnetic field and dozens of moons, some of which may harbor hidden oceans beneath their icy surfaces.",
    encyclopedia: "Jupiter is the fifth planet from the Sun and the largest planet in the Solar System. It is a gas giant composed mostly of hydrogen and helium. Its most prominent feature is the Great Red Spot, a giant storm larger than Earth that has existed for centuries. Jupiter has a strong magnetic field and at least 90 known moons, including Ganymede, the largest moon in the Solar System. Its rapid rotation creates a day lasting only about 10 hours.",
    structure: "Jupiter lacks a well-defined solid surface. It consists mostly of hydrogen and helium, transitioning from a gaseous outer layer to liquid metallic hydrogen inside. At its center, there may be a small rocky or metallic core, but its exact size and composition remain unknown due to extreme pressures.",
    question: "Which planet is the largest in the solar system?",
    options: ["A. Saturn", "B. Neptune", "C. Jupiter", "D. Uranus"],
    correctAnswer: 2,
  },
  "#saturn": {
    name: "SATURN",
    type: "GAS GIANT",
    visit: "Saturn is famous for its spectacular ring system made of ice, rock, and dust. These rings create one of the most beautiful sights in the Solar System. Though it appears ethereal and light, Saturn is actually a massive gas giant with a complex internal structure. Its moons, particularly Titan, are of great interest to scientists due to its unique atmosphere and potential for prebiotic chemistry.",
    encyclopedia: "Saturn is the sixth planet from the Sun, best known for its extensive ring system composed of ice, rock, and dust particles. Like Jupiter, it is a gas giant made primarily of hydrogen and helium. Saturn has such a low density that it could float in water if there were a large enough ocean. It has over 140 moons, including Titan, which has a thick atmosphere and lakes of liquid methane. Its rings make Saturn one of the most visually stunning planets.",
    structure: "Saturn is also a gas giant with no solid surface. It mainly consists of hydrogen and helium, with layers of liquid metallic hydrogen beneath its atmosphere. There may be a small rocky core surrounded by icy and metallic materials. Saturn has the lowest density of all the planets in the Solar System.",
    question: "Which planet has the most prominent ring system?",
    options: ["A. Jupiter", "B. Saturn", "C. Venus", "D. Mars"],
    correctAnswer: 1,
  },
  "#uranus": {
    name: "URANUS",
    type: "ICE GIANT",
    visit: "Uranus is an ice giant with a very unusual characteristic: it rotates on its side. This extreme tilt makes the planet look as if it's rolling around the Sun. Its blue-green color comes from methane gas in its atmosphere, which absorbs red light. Uranus also has faint rings and extremely cold temperatures, making it one of the most unusual planets in the Solar System.",
    encyclopedia: "Uranus is the seventh planet from the Sun, classified as an ice giant. It has a blue-green hue due to methane gas in its atmosphere. Its most unusual feature is its axial tilt of about 98 degrees, causing it to spin on its side and creating extreme seasonal variations. Uranus has a faint ring system and at least 27 known moons. It is one of the coldest planets, with temperatures dropping to about -224°C.",
    structure: "Uranus is an ice giant composed of water, ammonia, and methane ices, along with hydrogen and helium gas. Inside, there may be a small rocky core surrounded by a thick icy mantle and an outer gaseous envelope. Extreme internal pressures create unusual states of matter, including 'superionic ice'.",
    question: "Which planet has a blue-green color due to methane gas?",
    options: ["A. Venus", "B. Uranus", "C. Mars", "D. Mercury"],
    correctAnswer: 1,
  },
  "#neptune": {
    name: "NEPTUNE",
    type: "ICE GIANT",
    visit: "Dark, cold, and whipped by supersonic winds, Neptune is the farthest of the major planets in our solar system. It hides at the distant edge of the solar system, where the Sun's light is nothing more than a faint point of light in the dark sky.",
    encyclopedia: "Neptune is the eighth and farthest planet in the solar system. It is an ice giant with a faint ring system and 14 known moons. Its atmosphere contains hydrogen, helium, and methane, which gives it its characteristic blue color. The winds on Neptune are the strongest in the Solar System, reaching speeds of up to 2,100 km/h.",
    structure: "Its structure is similar to Uranus, consisting of a dense liquid or hot 'ice' mantle (water, ammonia, methane) surrounding a solid core about the size of Earth. The core temperature is estimated to be around 5,000°C.",
    question: "Which planet is the farthest from the Sun in the solar system?",
    options: ["A. Uranus", "B. Neptune", "C. Saturn", "D. Jupiter"],
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
  "#mercury": { radius: 80,   speed: 0.50, camOffset: [0, 10, 20],  ufoHeight: 7,  ufoScale: 0.22 },
  "#venus":   { radius: 140,  speed: 0.35, camOffset: [0, 10, 25],  ufoHeight: 9,  ufoScale: 0.26 },
  "#earth":   { radius: 210,  speed: 0.25, camOffset: [0, 10, 35],  ufoHeight: 10, ufoScale: 0.26 },
  "#mars":    { radius: 300,  speed: 0.20, camOffset: [0, 10, 35],  ufoHeight: 8,  ufoScale: 0.22 },
  "#jupiter": { radius: 480,  speed: 0.10, camOffset: [0, 30, 100], ufoHeight: 32, ufoScale: 0.75 },
  "#saturn":  { radius: 680,  speed: 0.08, camOffset: [0, 30, 100], ufoHeight: 36, ufoScale: 0.75 },
  "#uranus":  { radius: 880,  speed: 0.05, camOffset: [0, 20, 80],  ufoHeight: 22, ufoScale: 0.42 },
  "#neptune": { radius: 1050, speed: 0.03, camOffset: [0, 20, 80],  ufoHeight: 20, ufoScale: 0.38 },
};

// ─── [NHIỆM VỤ 1] ANIMATED BACKGROUND — NỀN CHUYỂN ĐỘNG MỰT MÀ ──────────────
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

    // ── Stars: 3 lớp parallax ──────────────────────────────────────────────
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

    // ── Nebula blobs ───────────────────────────────────────────────────────
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
      { cx: W*0.62, cy: H*0.30, rx: 300, ry: 220, hue: 340, hue2: 20,  alpha: 0.10, vx: -0.06, vy: -0.05, rotSpeed: 0.0002, rot: 5 },
    ];

    // ── [NHIỆM VỤ 3] SAO BĂNG — TRẮNG THUẦN, VỆT SÁNG DÀI ĐẸP ────────────
    interface Meteor {
      x: number; y: number; vx: number; vy: number;
      len: number; alpha: number; active: boolean;
      timer: number; maxTimer: number;
      tailLen: number; // chiều dài đuôi riêng biệt
    }
    const meteors: Meteor[] = Array.from({ length: 10 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, len: 0, alpha: 0,
      active: false, timer: 0, maxTimer: 0, tailLen: 0
    }));

    function spawnMeteor(m: Meteor) {
      // Xuất hiện từ vùng trên-phải hoặc trên, bay chéo xuống-phải
      m.x = Math.random() * W * 1.2 - W * 0.1;
      m.y = Math.random() * H * 0.35;
      const angle = Math.PI / 5 + (Math.random() - 0.5) * 0.35; // ~36° ± 10°
      const speed = 18 + Math.random() * 28; // nhanh hơn
      m.vx      = Math.cos(angle) * speed;
      m.vy      = Math.sin(angle) * speed;
      m.tailLen = 180 + Math.random() * 260; // đuôi dài hơn nhiều
      m.len     = m.tailLen;
      m.alpha   = 0.85 + Math.random() * 0.15;
      m.active  = true;
      m.timer   = 0;
      m.maxTimer = 35 + Math.random() * 25;
    }
    // Stagger ban đầu để không đồng loạt
    meteors.forEach((m, i) => { m.timer = -i * 90 - Math.random() * 250; });

    // ── Aurora waves ──────────────────────────────────────────────────────
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

    // ── Warp streaks ───────────────────────────────────────────────────────
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
      bg.addColorStop(0,   "rgba(6, 8, 28, 0.85)");
      bg.addColorStop(0.3, "rgba(4, 5, 20, 0.85)");
      bg.addColorStop(0.7, "rgba(2, 3, 14, 0.85)");
      bg.addColorStop(1,   "rgba(1, 1, 8,  0.85)");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      ctx!.globalCompositeOperation = "screen";
      auroraWaves.forEach(drawAurora);
      ctx!.globalCompositeOperation = "source-over";

      ctx!.globalCompositeOperation = "screen";
      nebulae.forEach((n) => {
        n.cx += n.vx; n.cy += n.vy; n.rot += n.rotSpeed;
        if (n.cx < -n.rx * 1.5) n.cx = W + n.rx * 1.5;
        if (n.cx > W + n.rx * 1.5) n.cx = -n.rx * 1.5;
        if (n.cy < -n.ry * 1.5) n.cy = H + n.ry * 1.5;
        if (n.cy > H + n.ry * 1.5) n.cy = -n.ry * 1.5;

        const pulse   = 1 + 0.08 * Math.sin(t * 0.5 + n.hue * 0.05);
        const breathe = 0.85 + 0.15 * Math.sin(t * 0.3 + n.hue * 0.02);

        ctx!.save();
        ctx!.translate(n.cx, n.cy);
        ctx!.rotate(n.rot);

        const outer = ctx!.createRadialGradient(0, 0, 0, 0, 0, n.rx * pulse * 1.4);
        outer.addColorStop(0,    `hsla(${n.hue}, 85%, 55%, ${n.alpha * breathe})`);
        outer.addColorStop(0.3,  `hsla(${n.hue2}, 75%, 45%, ${n.alpha * breathe * 0.7})`);
        outer.addColorStop(0.65, `hsla(${n.hue + 10}, 70%, 35%, ${n.alpha * breathe * 0.3})`);
        outer.addColorStop(1,    `hsla(${n.hue}, 60%, 25%, 0)`);
        ctx!.scale(1, n.ry / n.rx);
        ctx!.beginPath();
        ctx!.arc(0, 0, n.rx * pulse * 1.4, 0, Math.PI * 2);
        ctx!.fillStyle = outer;
        ctx!.fill();

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

      // Dải Ngân Hà mờ
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

      // Vẽ ngôi sao
      stars.forEach((s) => {
        const driftSpeeds = [0, 0.025, 0.06];
        s.x = (s.x + driftSpeeds[s.layer] + W) % W;
        const twinkle = s.alpha * (0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));

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

        if (s.r > 1.0) {
          const glow = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          glow.addColorStop(0, `rgba(${s.color}, ${twinkle * 0.5})`);
          glow.addColorStop(1, "rgba(0,0,0,0)");
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          ctx!.fillStyle = glow;
          ctx!.fill();
        }

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${s.color}, ${twinkle})`;
        ctx!.fill();
      });

      // Warp streaks
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
          grd.addColorStop(0,   `rgba(100,180,255,0)`);
          grd.addColorStop(0.4, `rgba(150,210,255,${ws.alpha * fade})`);
          grd.addColorStop(1,   `rgba(200,230,255,0)`);
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

      // ── [NHIỆM VỤ 3] VẼ SAO BĂNG — TRẮNG TINH KHIẾT, VỆT DÀI ĐẸP ─────
      meteors.forEach((m) => {
        m.timer++;
        if (!m.active) {
          // Tần suất xuất hiện cao hơn một chút (0.005)
          if (m.timer > 0 && Math.random() < 0.005) spawnMeteor(m);
          return;
        }

        const progress = m.timer / m.maxTimer;
        // Fade-in nhanh (0~15%), sáng đủ (15~75%), fade-out mượt (75~100%)
        const fade =
          progress < 0.15 ? progress / 0.15
          : progress > 0.75 ? 1 - (progress - 0.75) / 0.25
          : 1.0;

        m.x += m.vx;
        m.y += m.vy;

        const speed = Math.hypot(m.vx, m.vy);
        // Điểm đầu đuôi (cách đầu sao một đoạn tailLen)
        const tx = m.x - (m.vx / speed) * m.tailLen;
        const ty = m.y - (m.vy / speed) * m.tailLen;

        // ── Lớp 1: Hào quang rộng (glow halo) — trắng-xanh rất mờ ────────
        const haloGrd = ctx!.createLinearGradient(tx, ty, m.x, m.y);
        haloGrd.addColorStop(0,   `rgba(200,230,255,0)`);
        haloGrd.addColorStop(0.5, `rgba(220,240,255,${m.alpha * fade * 0.12})`);
        haloGrd.addColorStop(1,   `rgba(255,255,255,${m.alpha * fade * 0.18})`);
        ctx!.strokeStyle = haloGrd;
        ctx!.lineWidth = 10;
        ctx!.beginPath();
        ctx!.moveTo(tx, ty);
        ctx!.lineTo(m.x, m.y);
        ctx!.stroke();

        // ── Lớp 2: Đuôi ngoài — dày vừa, trắng ───────────────────────────
        const outerGrd = ctx!.createLinearGradient(tx, ty, m.x, m.y);
        outerGrd.addColorStop(0,    `rgba(240,248,255,0)`);
        outerGrd.addColorStop(0.35, `rgba(245,250,255,${m.alpha * fade * 0.30})`);
        outerGrd.addColorStop(0.75, `rgba(255,255,255,${m.alpha * fade * 0.65})`);
        outerGrd.addColorStop(1,    `rgba(255,255,255,${m.alpha * fade})`);
        ctx!.strokeStyle = outerGrd;
        ctx!.lineWidth = 3.5;
        ctx!.shadowColor = "rgba(255,255,255,0.5)";
        ctx!.shadowBlur  = 12;
        ctx!.beginPath();
        ctx!.moveTo(tx, ty);
        ctx!.lineTo(m.x, m.y);
        ctx!.stroke();

        // ── Lớp 3: Lõi sáng trắng thuần ──────────────────────────────────
        const coreGrd = ctx!.createLinearGradient(tx, ty, m.x, m.y);
        coreGrd.addColorStop(0,    `rgba(255,255,255,0)`);
        coreGrd.addColorStop(0.55, `rgba(255,255,255,${m.alpha * fade * 0.70})`);
        coreGrd.addColorStop(1,    `rgba(255,255,255,${m.alpha * fade})`);
        ctx!.strokeStyle = coreGrd;
        ctx!.lineWidth = 1.5;
        ctx!.shadowColor = "rgba(255,255,255,0.9)";
        ctx!.shadowBlur  = 8;
        ctx!.beginPath();
        ctx!.moveTo(tx, ty);
        ctx!.lineTo(m.x, m.y);
        ctx!.stroke();

        // ── Lớp 4: Đầu sao — điểm sáng chói ─────────────────────────────
        ctx!.beginPath();
        ctx!.arc(m.x, m.y, Math.max(0.01, 2.2 * fade), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${m.alpha * fade})`;
        ctx!.shadowColor = "rgba(255,255,255,1)";
        ctx!.shadowBlur  = 15;
        ctx!.fill();

        ctx!.shadowBlur = 0;

        if (m.timer >= m.maxTimer) {
          m.active = false;
          m.timer  = -Math.floor(Math.random() * 280);
        }
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

// ─── PLANET ARRIVAL EFFECT ────────────────────────────────────────────────────
const PLANET_THEME: Record<string, { color: string; glow: string; label: string }> = {
  "#mercury": { color: "#c0a060", glow: "rgba(192,160,96,",  label: "MERCURY" },
  "#venus":   { color: "#ffcc66", glow: "rgba(255,204,102,", label: "VENUS"   },
  "#earth":   { color: "#44aaff", glow: "rgba(68,170,255,",  label: "EARTH"   },
  "#mars":    { color: "#ff5533", glow: "rgba(255,85,51,",   label: "MARS"    },
  "#jupiter": { color: "#cc8844", glow: "rgba(204,136,68,",  label: "JUPITER" },
  "#saturn":  { color: "#ddcc88", glow: "rgba(221,204,136,", label: "SATURN"  },
  "#uranus":  { color: "#66ddcc", glow: "rgba(102,221,204,", label: "URANUS"  },
  "#neptune": { color: "#4466ff", glow: "rgba(68,102,255,",  label: "NEPTUNE" },
  "#overview":{ color: "#ffffff", glow: "rgba(255,255,255,", label: ""        },
};

function PlanetArrivalEffect({ currentHash }: { currentHash: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    if (currentHash === prevHash.current) return;
    prevHash.current = currentHash;

    if (currentHash === "#overview") {
      cancelAnimationFrame(animRef.current);
      ctx.clearRect(0, 0, W, H);
      return;
    }

    const theme = PLANET_THEME[currentHash] ?? PLANET_THEME["#earth"];

    let phase: "flash"|"ring"|"title"|"scan"|"fadeout" = "flash";
    let timer = 0;
    let ringR = 0;
    let titleAlpha = 0;
    let titleY = H * 0.5 - 60;
    let scanY = 0;
    let scanAlpha = 0;
    let overallAlpha = 1;

    cancelAnimationFrame(animRef.current);

    function tick() {
      ctx!.clearRect(0, 0, W, H);
      timer++;

      if (phase === "flash") {
        const a = timer < 6 ? timer / 6 : Math.max(0, 1 - (timer - 6) / 10);
        ctx!.fillStyle = `rgba(255,255,255,${a * 0.85})`;
        ctx!.fillRect(0, 0, W, H);
        const burst = ctx!.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H) * 0.7);
        burst.addColorStop(0,   `${theme.glow}${a * 0.6})`);
        burst.addColorStop(0.5, `${theme.glow}${a * 0.2})`);
        burst.addColorStop(1,   `${theme.glow}0)`);
        ctx!.fillStyle = burst;
        ctx!.fillRect(0, 0, W, H);
        if (timer >= 18) { phase = "ring"; timer = 0; }

      } else if (phase === "ring") {
        ringR += 28;
        const maxR = Math.max(W, H) * 0.9;
        const a = Math.max(0, 1 - ringR / maxR);
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
        const vig = ctx!.createRadialGradient(W/2, H/2, Math.max(W,H)*0.3, W/2, H/2, Math.max(W,H)*0.8);
        vig.addColorStop(0, `${theme.glow}0)`);
        vig.addColorStop(1, `${theme.glow}${a * 0.25})`);
        ctx!.fillStyle = vig;
        ctx!.fillRect(0, 0, W, H);
        if (timer >= 1) { phase = "title"; timer = 0; }

      } else if (phase === "title") {
        const lingerR = ringR + timer * 28;
        const la = Math.max(0, 1 - lingerR / (Math.max(W,H) * 1.2));
        if (la > 0) {
          ctx!.beginPath();
          ctx!.arc(W/2, H/2, lingerR, 0, Math.PI * 2);
          ctx!.strokeStyle = `${theme.glow}${la * 0.3})`;
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }
        titleAlpha = Math.min(1, timer / 15);
        titleY = H * 0.5 - 40 - Math.max(0, (20 - timer) * 3);
        ctx!.save();
        ctx!.globalAlpha = titleAlpha;
        const lineW = 340;
        ctx!.strokeStyle = theme.color;
        ctx!.lineWidth = 1;
        ctx!.globalAlpha = titleAlpha * 0.6;
        ctx!.beginPath(); ctx!.moveTo(W/2 - lineW/2, titleY - 28); ctx!.lineTo(W/2 + lineW/2, titleY - 28); ctx!.stroke();
        ctx!.beginPath(); ctx!.moveTo(W/2 - lineW/2, titleY + 52); ctx!.lineTo(W/2 + lineW/2, titleY + 52); ctx!.stroke();
        ctx!.globalAlpha = titleAlpha * 0.7;
        ctx!.fillStyle = theme.color;
        ctx!.font = "bold 11px 'Courier New', monospace";
        ctx!.textAlign = "center";
        ctx!.fillText("// ĐANG VÀO QUỸ ĐẠO //", W/2, titleY - 10);
        ctx!.globalAlpha = titleAlpha;
        ctx!.shadowColor = theme.color;
        ctx!.shadowBlur = 30;
        ctx!.fillStyle = "#ffffff";
        ctx!.font = `900 ${Math.min(78, W / 9)}px 'Arial Black', sans-serif`;
        ctx!.textAlign = "center";
        ctx!.fillText(theme.label, W/2, titleY + 40);
        ctx!.shadowColor = theme.color;
        ctx!.shadowBlur = 60;
        ctx!.globalAlpha = titleAlpha * 0.5;
        ctx!.fillText(theme.label, W/2, titleY + 40);
        ctx!.shadowBlur = 0;
        ctx!.restore();
        if (timer >= 35) { phase = "scan"; scanY = 0; scanAlpha = 0; timer = 0; }

      } else if (phase === "scan") {
        titleAlpha = Math.max(0, 1 - timer / 30);
        ctx!.save();
        ctx!.globalAlpha = titleAlpha;
        ctx!.shadowColor = theme.color;
        ctx!.shadowBlur = 20;
        ctx!.fillStyle = "#ffffff";
        ctx!.font = `900 ${Math.min(78, W / 9)}px 'Arial Black', sans-serif`;
        ctx!.textAlign = "center";
        ctx!.fillText(theme.label, W/2, titleY + 40);
        ctx!.restore();
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
        const fade = ctx!.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.6);
        fade.addColorStop(0, `${theme.glow}${overallAlpha * 0.06})`);
        fade.addColorStop(1, `${theme.glow}0)`);
        ctx!.fillStyle = fade;
        ctx!.fillRect(0, 0, W, H);
        ctx!.globalAlpha = 1;
        if (timer >= 20) { ctx!.clearRect(0, 0, W, H); return; }
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

// ─── NÚT BẤM PHONG CÁCH VIỄN TƯỞNG ──────────────────────────────────────────
function MenuButton({
  text, onClick, highlight = false,
}: {
  text: string; onClick?: () => void; highlight?: boolean;
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
        fontSize: "14px", fontWeight: "bold", letterSpacing: "3px",
        cursor: "pointer", textAlign: "left", textTransform: "uppercase",
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
        e.currentTarget.style.backgroundColor = highlight ? "rgba(0, 243, 255, 0.15)" : "rgba(0, 0, 0, 0.4)";
        e.currentTarget.style.color = highlight ? "#fff" : "#b3e5fc";
        e.currentTarget.style.borderLeft = `3px solid ${highlight ? "#00f3ff" : "rgba(0, 243, 255, 0.3)"}`;
        e.currentTarget.style.boxShadow = highlight ? "inset 0 0 15px rgba(0, 243, 255, 0.2)" : "none";
      }}
    >
      {text}
    </button>
  );
}

// ─── [NHIỆM VỤ 4] BẢNG THÔNG TIN — TIẾNG VIỆT ───────────────────────────────
function PlanetInfoPanel({
  currentHash, onCorrect, onWrong,
}: {
  currentHash: string; onCorrect: () => void; onWrong: () => void;
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

  // Tên hiển thị cho các tab — tiếng anh
  const VIEW_LABELS: Record<string, string> = {
    visit:        "VISIT",
    encyclopedia: "ENCYCLOPEDIA",
    structure:    "STRUCTURE",
    quiz:         "QUIZ",
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
          position: "absolute", top: "8%", left: "60px", width: "380px", zIndex: 10,
          color: "white", fontFamily: "sans-serif",
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px),
            linear-gradient(135deg, rgba(2,11,26,0.85) 0%, rgba(0,34,68,0.6) 100%)`,
          border: "1px solid rgba(0, 243, 255, 0.3)",
          borderTop: "3px solid #00f3ff", borderBottom: "3px solid #00f3ff",
          boxShadow: "0 0 40px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 243, 255, 0.1)",
          borderRadius: "4px", padding: "30px", backdropFilter: "blur(15px)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%)",
        }}
      >
        <div style={{
          display: "flex", justifyContent: "space-between", fontSize: "10px",
          color: "#00f3ff", marginBottom: "15px", opacity: 0.8,
          letterSpacing: "2px", textTransform: "uppercase",
        }}>
          <span>DATA // {currentHash.replace("#", "")}</span>
          <span>[ UFO CONNECTED ]</span>
        </div>

        <div style={{
          textAlign: "center", marginBottom: "30px",
          borderBottom: "1px dashed rgba(0, 243, 255, 0.4)", paddingBottom: "15px",
          position: "relative",
        }}>
          <h1 style={{
            margin: 0, fontSize: "36px", fontWeight: "900", letterSpacing: "4px",
            color: "#e0f7fa", textShadow: "0 0 20px #00f3ff, 0 0 40px #00f3ff",
          }}>
            {data.name}
          </h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#00f3ff", letterSpacing: "6px" }}>
            {data.type}
          </p>
          <div style={{ position: "absolute", bottom: "-3px", left: "0", width: "5px", height: "5px", backgroundColor: "#00f3ff", boxShadow: "0 0 10px #00f3ff" }} />
          <div style={{ position: "absolute", bottom: "-3px", right: "0", width: "5px", height: "5px", backgroundColor: "#00f3ff", boxShadow: "0 0 10px #00f3ff" }} />
        </div>

        {activeView === "menu" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <MenuButton text="VISIT"          onClick={() => setActiveView("visit")} />
            <MenuButton text="ENCYCLOPEDIA"          onClick={() => setActiveView("encyclopedia")} />
            <MenuButton text="STRUCTURE"           onClick={() => setActiveView("structure")} />
            <MenuButton text="QUIZ" highlight onClick={() => setActiveView("quiz")} />
          </motion.div>
        )}

        {["visit", "encyclopedia", "structure"].includes(activeView) && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{
              marginTop: 0, color: "#00f3ff", fontSize: "16px",
              textTransform: "uppercase", letterSpacing: "2px",
            }}>
              {VIEW_LABELS[activeView] ?? activeView}
            </h3>
            <p style={{
              fontSize: "14px", lineHeight: "1.7", color: "#d0e8f2",
              marginBottom: "25px", fontWeight: "300",
            }}>
              {data[activeView]}
            </p>
            <MenuButton text="BACK TO MENU" onClick={() => setActiveView("menu")} highlight />
          </motion.div>
        )}

        {activeView === "quiz" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h3 style={{ marginTop: 0, color: "#00f3ff", fontSize: "16px", textTransform: "uppercase" }}>
              Quiz Questions
            </h3>
            <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "20px", color: "#e0f7fa" }}>
              {data.question}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {data.options.map((option: string, index: number) => {
                let bgColor    = "rgba(0,0,0,0.4)";
                let borderColor = "rgba(0, 243, 255, 0.2)";
                let textColor  = "white";

                if (selectedAnswer !== null) {
                  if (index === selectedAnswer) {
                    if (index === data.correctAnswer) {
                      bgColor = "rgba(0,255,0,0.2)"; borderColor = "#00ff00"; textColor = "#00ff00";
                    } else {
                      bgColor = "rgba(255,0,0,0.4)"; borderColor = "#ff0000"; textColor = "#ff0000";
                    }
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    style={{
                      padding: "12px", textAlign: "left",
                      backgroundColor: bgColor, border: `1px solid ${borderColor}`,
                      color: textColor, cursor: selectedAnswer === null ? "pointer" : "default",
                      borderRadius: "4px", transition: "all 0.3s",
                      clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                      fontSize: "14px",
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

// ─── [NHIỆM VỤ 2] TRỤC QUAY HÀNH TINH — DELTA CAP + SMOOTH ──────────────────
function OrbitGroup({
  speed, children, planetHash, anglesRef,
}: {
  speed: number; children: React.ReactNode;
  planetHash?: string; anglesRef?: React.MutableRefObject<Record<string, number>>;
}) {
  const groupRef    = useRef<THREE.Group>(null);
  // Tích lũy góc riêng để tránh nhảy khi fps thấp
  const localAngle  = useRef<number>(0);
  const didInit     = useRef(false);

  useEffect(() => {
    // Đồng bộ góc local với anglesRef khi mount
    if (planetHash && anglesRef) {
      localAngle.current = anglesRef.current[planetHash] ?? 0;
    }
    didInit.current = false;
  }, [planetHash]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Cap delta tối đa 1/20s (50 fps tối thiểu tương đương) để tránh giật khi lag/tab switch
    const safeDelta = Math.min(delta, 0.05);
    localAngle.current += speed * safeDelta;

    if (planetHash && anglesRef) {
      anglesRef.current[planetHash] = localAngle.current;
    }
    groupRef.current.rotation.y = localAngle.current;
  });

  return <group ref={groupRef}>{children}</group>;
}

// ─── ĐUÔI SÁNG UFO ───────────────────────────────────────────────────────────
const TRAIL_RAW_MAX  = 120;
const TRAIL_STEPS    = 80;
const TRAIL_MAX_W    = 5.5;
const TRAIL_OUTER_N  = 8;
const SPARK_COUNT    = 24;
const RING_COUNT     = 6;

function RocketTrail({
  posRef, velRef, currentHash,
}: {
  posRef: React.MutableRefObject<THREE.Vector3>;
  velRef: React.MutableRefObject<THREE.Vector3>;
  currentHash: string;
}) {
  const rawBuffer       = useRef<THREE.Vector3[]>(Array.from({ length: TRAIL_RAW_MAX }, () => new THREE.Vector3()));
  const rawCount        = useRef(0);
  const lastRecordedPos = useRef(new THREE.Vector3(Infinity, Infinity, Infinity));
  const curve = useMemo(() => new THREE.CatmullRomCurve3([], false, "catmullrom", 0.5), []);

  const _vel   = useRef(new THREE.Vector3());
  const _perpA = useRef(new THREE.Vector3());
  const _perpB = useRef(new THREE.Vector3());
  const _pt    = useRef(new THREE.Vector3());

  const outerDirs = useRef<THREE.Vector3[]>(Array.from({ length: TRAIL_OUTER_N }, () => new THREE.Vector3()));

  const makeGeo = (n: number) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("color",    new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setDrawRange(0, 0);
    return g;
  };

  const coreGeo   = useMemo(() => makeGeo(TRAIL_STEPS), []);
  const core2Geo  = useMemo(() => makeGeo(TRAIL_STEPS), []);
  const haloGeo   = useMemo(() => makeGeo(TRAIL_STEPS), []);
  const outerGeos = useMemo(() => Array.from({ length: TRAIL_OUTER_N }, () => makeGeo(TRAIL_STEPS)), []);
  const RING_PTS  = 32;
  const ringGeos  = useMemo(() => Array.from({ length: RING_COUNT }, () => makeGeo(RING_PTS + 1)), []);
  const sparkGeo  = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SPARK_COUNT * 3), 3));
    g.setAttribute("color",    new THREE.BufferAttribute(new Float32Array(SPARK_COUNT * 3), 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  const coreMat  = useMemo(() => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const core2Mat = useMemo(() => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const haloMat  = useMemo(() => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const outerMat = useMemo(() => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.50, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const ringMat  = useMemo(() => new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const sparkMat = useMemo(() => new THREE.PointsMaterial({ vertexColors: true, transparent: true, size: 1.4, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }), []);

  const sparkState = useRef(Array.from({ length: SPARK_COUNT }, () => ({
    u: Math.random(), offset: new THREE.Vector3((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4),
    life: Math.random(), speed: 0.25 + Math.random() * 0.75,
  })));

  useEffect(() => {
    rawCount.current = 0;
    lastRecordedPos.current.set(Infinity, Infinity, Infinity);
    coreGeo.setDrawRange(0, 0); core2Geo.setDrawRange(0, 0); haloGeo.setDrawRange(0, 0);
    outerGeos.forEach((g) => g.setDrawRange(0, 0));
    ringGeos.forEach((g) => g.setDrawRange(0, 0));
    sparkGeo.setDrawRange(0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHash]);

  useFrame(({ clock }, delta) => {
    const worldPos = posRef.current;
    if (!worldPos) return;
    const t = clock.getElapsedTime();
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
    const refUp = Math.abs(_vel.current.y) < 0.95 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    _perpA.current.crossVectors(_vel.current, refUp).normalize();
    _perpB.current.crossVectors(_vel.current, _perpA.current).normalize();
    for (let di = 0; di < TRAIL_OUTER_N; di++) {
      const angle = (di / TRAIL_OUTER_N) * Math.PI * 2;
      outerDirs.current[di].copy(_perpA.current).multiplyScalar(Math.cos(angle)).addScaledVector(_perpB.current, Math.sin(angle));
    }
    const corePosA = coreGeo.attributes.position as THREE.BufferAttribute;
    const coreColA = coreGeo.attributes.color    as THREE.BufferAttribute;
    for (let i = 0; i < steps; i++) {
      const u = i / (steps - 1); const pt = curve.getPoint(u, _pt.current);
      corePosA.setXYZ(i, pt.x, pt.y, pt.z);
      const a = Math.pow(u, 0.5); const hue = (t * 0.3 + u * 0.5) % 1.0;
      coreColA.setXYZ(i, a * (0.2 + 0.8 * Math.max(0, Math.sin(hue * Math.PI * 2))), a * (0.7 + 0.3 * Math.cos(hue * Math.PI * 2 + 1)), a * 1.0);
    }
    coreGeo.setDrawRange(0, steps); corePosA.needsUpdate = true; coreColA.needsUpdate = true;
    const c2PosA = core2Geo.attributes.position as THREE.BufferAttribute;
    const c2ColA = core2Geo.attributes.color    as THREE.BufferAttribute;
    for (let i = 0; i < steps; i++) {
      const u = i / (steps - 1); const pt = curve.getPoint(u, _pt.current);
      c2PosA.setXYZ(i, pt.x, pt.y, pt.z);
      const a = Math.pow(u, 0.3) * (1 - u * 0.6); c2ColA.setXYZ(i, a, a, a);
    }
    core2Geo.setDrawRange(0, steps); c2PosA.needsUpdate = true; c2ColA.needsUpdate = true;
    const haloPosA = haloGeo.attributes.position as THREE.BufferAttribute;
    const haloColA = haloGeo.attributes.color    as THREE.BufferAttribute;
    for (let i = 0; i < steps; i++) {
      const u = i / (steps - 1); const pt = curve.getPoint(u, _pt.current);
      const bob = Math.sin(t * 10 + u * 15) * 0.35 * (1 - u);
      haloPosA.setXYZ(i, pt.x + _perpA.current.x * bob, pt.y + bob, pt.z + _perpA.current.z * bob);
      const a = Math.pow(u, 0.8) * 0.9; haloColA.setXYZ(i, a * 0.1, a * 0.9, a * 1.0);
    }
    haloGeo.setDrawRange(0, steps); haloPosA.needsUpdate = true; haloColA.needsUpdate = true;
    outerGeos.forEach((geo, di) => {
      const dir = outerDirs.current[di]; const posAttr = geo.attributes.position as THREE.BufferAttribute; const colAttr = geo.attributes.color as THREE.BufferAttribute;
      const phase = di * (Math.PI * 2 / TRAIL_OUTER_N);
      for (let i = 0; i < steps; i++) {
        const u = i / (steps - 1); const pt = curve.getPoint(u, _pt.current);
        const coneU = 1 - u;
        const radius = TRAIL_MAX_W * Math.pow(coneU, 0.45) * (0.65 + 0.35 * Math.sin(t * 16 + u * 10 + phase));
        const twist = coneU * 0.5 * Math.sin(t * 4 + phase);
        const td = new THREE.Vector3(dir.x * Math.cos(twist) - dir.z * Math.sin(twist), dir.y, dir.x * Math.sin(twist) + dir.z * Math.cos(twist));
        posAttr.setXYZ(i, pt.x + td.x * radius, pt.y + td.y * radius, pt.z + td.z * radius);
        const a = Math.pow(u, 1.1) * 0.65; const colorCycle = (di % 3);
        colAttr.setXYZ(i, a * (colorCycle === 2 ? 1.0 : colorCycle === 1 ? 0.5 : 0.05), a * (colorCycle === 2 ? 0.8 : colorCycle === 1 ? 0.1 : 0.8), a * (colorCycle === 2 ? 0.0 : colorCycle === 1 ? 1.0 : 1.0));
      }
      geo.setDrawRange(0, steps);
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color    as THREE.BufferAttribute).needsUpdate = true;
    });
    ringGeos.forEach((geo, ri) => {
      const posAttr = geo.attributes.position as THREE.BufferAttribute; const colAttr = geo.attributes.color as THREE.BufferAttribute;
      const ringU = ((t * 0.45 + ri / RING_COUNT) % 1.0);
      if (ringU < 0.02 || ringU > 0.98) { geo.setDrawRange(0, 0); return; }
      const ringPt = curve.getPoint(ringU, _pt.current);
      const rRadius = TRAIL_MAX_W * (1 - ringU) * 1.2 * (0.8 + 0.2 * Math.sin(t * 8 + ri));
      const hue = (ri / RING_COUNT + t * 0.1) % 1.0;
      const rr = 0.3 + 0.7 * Math.sin(hue * Math.PI * 2); const rg = 0.5 + 0.5 * Math.cos(hue * Math.PI * 2); const rb = 1.0;
      const alpha = (1 - ringU) * 0.9;
      for (let pi = 0; pi <= RING_PTS; pi++) {
        const angle = (pi / RING_PTS) * Math.PI * 2;
        posAttr.setXYZ(pi, ringPt.x + _perpA.current.x * Math.cos(angle) * rRadius + _perpB.current.x * Math.sin(angle) * rRadius, ringPt.y + _perpA.current.y * Math.cos(angle) * rRadius + _perpB.current.y * Math.sin(angle) * rRadius, ringPt.z + _perpA.current.z * Math.cos(angle) * rRadius + _perpB.current.z * Math.sin(angle) * rRadius);
        const fade = alpha * (0.7 + 0.3 * Math.sin(t * 20 + pi * 0.5));
        colAttr.setXYZ(pi, rr * fade, rg * fade, rb * fade);
      }
      geo.setDrawRange(0, RING_PTS + 1);
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color    as THREE.BufferAttribute).needsUpdate = true;
    });
    const spkPos = sparkGeo.attributes.position as THREE.BufferAttribute;
    const spkCol = sparkGeo.attributes.color    as THREE.BufferAttribute;
    let spkDrawn = 0;
    sparkState.current.forEach((sp, si) => {
      sp.life += delta * sp.speed * 1.4;
      if (sp.life > 1.0) { sp.life = 0; sp.u = Math.random() * 0.9; sp.offset.set((Math.random()-0.5)*TRAIL_MAX_W*2.2,(Math.random()-0.5)*TRAIL_MAX_W*2.2,(Math.random()-0.5)*TRAIL_MAX_W*2.2); sp.speed = 0.25 + Math.random() * 0.75; }
      if (sp.u >= 0 && sp.u <= 1 && activePts.length >= 3) {
        const pt = curve.getPoint(sp.u, _pt.current); const fade = (1 - sp.life) * (1 - sp.u * 0.5);
        spkPos.setXYZ(spkDrawn, pt.x + sp.offset.x * sp.life * 0.6, pt.y + sp.offset.y * sp.life * 0.6, pt.z + sp.offset.z * sp.life * 0.6);
        const flash = fade * (0.5 + 0.5 * Math.sin(t * 40 + si * 1.7)); const sc = si % 3;
        spkCol.setXYZ(spkDrawn, flash * (sc === 0 ? 1.0 : sc === 2 ? 0.8 : 0.1), flash * (sc === 0 ? 1.0 : sc === 2 ? 0.1 : 1.0), flash * 1.0);
        spkDrawn++;
      }
    });
    sparkGeo.setDrawRange(0, spkDrawn); spkPos.needsUpdate = true; spkCol.needsUpdate = true;
  });
  

  // Tạo vỏ bọc đánh lừa TypeScript
  const R3FLine = (props: any) => <line {...props} />;
  const R3FPoints = (props: any) => <points {...props} />;

  return (
    <>
      <R3FLine geometry={coreGeo}  material={coreMat}  />
      <R3FLine geometry={core2Geo} material={core2Mat} />
      <R3FLine geometry={haloGeo}  material={haloMat}  />
      
      {outerGeos.map((geo, i) => (
        <R3FLine key={`o${i}`} geometry={geo} material={outerMat} />
      ))}
      
      {ringGeos.map((geo, i) => (
        <R3FLine key={`r${i}`} geometry={geo} material={ringMat} />
      ))}
      
      <R3FPoints geometry={sparkGeo} material={sparkMat} />
    </>
  );
}

// ─── UFO ERROR EFFECT ─────────────────────────────────────────────────────────
function UFOErrorEffect({ isShaking, ufoPos }: { isShaking: boolean; ufoPos: React.MutableRefObject<THREE.Vector3> }) {
  const BOLT_COUNT = 8;
  const boltGeos = useMemo(() => Array.from({ length: BOLT_COUNT }, () => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(12 * 3), 3));
    g.setDrawRange(0, 0); return g;
  }), []);
  const boltMat = useMemo(() => new THREE.LineBasicMaterial({ color: new THREE.Color(1, 0.05, 0.05), transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const shockGeos = useMemo(() => Array.from({ length: 3 }, () => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(64 * 3), 3));
    g.setDrawRange(0, 0); return g;
  }), []);
  const shockMat = useMemo(() => new THREE.LineBasicMaterial({ color: new THREE.Color(1, 0.08, 0.08), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }), []);
  const errorTimer = useRef(0);
  const wasShaking = useRef(false);

  useFrame(({ clock }, delta) => {
    if (!wasShaking.current && isShaking) errorTimer.current = 0;
    wasShaking.current = isShaking;
    if (!isShaking) { boltGeos.forEach((g) => g.setDrawRange(0, 0)); shockGeos.forEach((g) => g.setDrawRange(0, 0)); return; }
    errorTimer.current += delta;
    const t = clock.getElapsedTime(); const ox = ufoPos.current.x; const oy = ufoPos.current.y; const oz = ufoPos.current.z;
    boltGeos.forEach((geo, bi) => {
      const posA = geo.attributes.position as THREE.BufferAttribute;
      const baseAngle = (bi / BOLT_COUNT) * Math.PI * 2 + t * 15; const segments = 11;
      posA.setXYZ(0, ox, oy, oz);
      for (let si = 1; si <= segments; si++) {
        const r = (si / segments) * (12 + 5 * Math.sin(t * 40 + bi * 1.4));
        const jitter = si > 0 && si < segments ? (Math.random() - 0.5) * 5 : 0;
        const a = baseAngle + jitter * 0.5;
        posA.setXYZ(si, ox + Math.cos(a) * r + jitter, oy + Math.sin(t * 25 + bi) * r * 0.3 + jitter * 0.5, oz + Math.sin(a) * r + jitter);
      }
      geo.setDrawRange(0, segments + 1); posA.needsUpdate = true;
    });
    shockGeos.forEach((geo, ri) => {
      const delay = ri * 0.07; const et = Math.max(0, errorTimer.current - delay); const ringR = et * 50;
      if (ringR <= 0.5) { geo.setDrawRange(0, 0); return; }
      const posA = geo.attributes.position as THREE.BufferAttribute;
      for (let pi = 0; pi < 64; pi++) {
        const angle = (pi / 64) * Math.PI * 2;
        posA.setXYZ(pi, ox + Math.cos(angle) * ringR, oy + Math.sin(t * 6 + ri) * 2, oz + Math.sin(angle) * ringR);
      }
      geo.setDrawRange(0, 64); posA.needsUpdate = true;
    });
    shockMat.opacity = Math.max(0, 0.9 - errorTimer.current * 2.0);
    boltMat.opacity  = Math.max(0, 1.0 - errorTimer.current * 1.5);
  });

  return (
    <>
      {boltGeos.map((geo, i) => (// @ts-ignore
        <line key={`bolt${i}`} geometry={geo} material={boltMat} />
      ))}
      {shockGeos.map((geo, i) => (// @ts-ignore
        <line key={`shock${i}`} geometry={geo} material={shockMat} />
      ))}
    </>
  );
}

// ─── UFO GLOW RING — VÀNH SÁNG BÊN DƯỚI ─────────────────────────────────────
function UFOGlowRing({ scale, color, pulseSpeed }: { scale: number; color: string; pulseSpeed: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshBasicMaterial>(null);
  const geo = useMemo(() => new THREE.TorusGeometry(3.2 * scale, 0.18 * scale, 16, 80), [scale]);
  useFrame(({ clock }) => {
    if (!ringRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 0.55 + 0.45 * Math.sin(t * pulseSpeed);
    matRef.current.opacity = pulse * 0.85;
    ringRef.current.rotation.z += 0.008;
  });
  return (
    <mesh ref={ringRef} geometry={geo} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3 * scale, 0]}>
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

// ─── UFO ENGINE THRUSTER — LUỒNG ĐẶC BIỆT ───────────────────────────────────
function UFOThruster({ scale, active }: { scale: number; active: boolean }) {
  const coneRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshBasicMaterial>(null);
  const geo = useMemo(() => new THREE.ConeGeometry(1.1 * scale, 3.5 * scale, 24, 1, true), [scale]);
  useFrame(({ clock }) => {
    if (!coneRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const flicker = 0.4 + 0.6 * Math.abs(Math.sin(t * 12 + Math.random() * 0.3));
    matRef.current.opacity = active ? flicker * 0.7 : 0.0;
    if (coneRef.current) coneRef.current.scale.y = 0.85 + 0.3 * Math.sin(t * 9);
  });
  return (
    <mesh ref={coneRef} geometry={geo} position={[0, -2.2 * scale, 0]}>
      <meshBasicMaterial ref={matRef} color="#00eeff" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── UFO SCAN BEAM — TIA QUÉT XUỐNG MẶT HÀNH TINH ───────────────────────────
function UFOScanBeam({ scale, active }: { scale: number; active: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshBasicMaterial>(null);
  const geo = useMemo(() => new THREE.CylinderGeometry(0.01, 2.8 * scale, 14 * scale, 32, 1, true), [scale]);
  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.getElapsedTime();
    matRef.current.opacity = active ? (0.12 + 0.08 * Math.sin(t * 3)) : 0;
  });
  return (
    <mesh ref={beamRef} geometry={geo} position={[0, -8 * scale, 0]}>
      <meshBasicMaterial ref={matRef} color="#00ffff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── MÔ HÌNH ĐĨA BAY — NÂNG CẤP ─────────────────────────────────────────────
function UFO({
  currentHash, isShaking, worldPosRef, velWorldRef, anglesRef,
}: {
  currentHash: string; isShaking: boolean;
  worldPosRef: React.MutableRefObject<THREE.Vector3>;
  velWorldRef: React.MutableRefObject<THREE.Vector3>;
  anglesRef: React.MutableRefObject<Record<string, number>>;
}) {
  const ufoRef        = useRef<THREE.Group>(null);
  const prevPosition  = useRef(new THREE.Vector3());
  const velocity      = useRef(new THREE.Vector3());
  const smoothedBank  = useRef(new THREE.Euler());
  const shouldSnap    = useRef(true);
  const prevHash      = useRef(currentHash);
  const _target       = useRef(new THREE.Vector3());
  // lerp factor riêng cho từng hành tinh xa
  const lerpFactor    = useRef(0.06);

  const obj = useLoader(OBJLoader, "/models/ufo.obj");
  const [, normalMap, , glowMap] = useLoader(THREE.TextureLoader, [
    "/models/ufo_diffuse.png", "/models/ufo_normal.png",
    "/models/ufo_spec.png",    "/models/ufo_diffuse_glow.png",
  ]);

  useMemo(() => {
    obj.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          normalMap, emissiveMap: glowMap,
          color: new THREE.Color("#c8eeff"),
          emissive: new THREE.Color("#00aaff"),
          emissiveIntensity: 2.2,
          metalness: 0.85,
          roughness: 0.18,
        });
      }
    });
  }, [obj, normalMap, glowMap]);

  useEffect(() => {
    if (prevHash.current !== currentHash) {
      shouldSnap.current = true;
      prevHash.current = currentHash;
      // Uranus rất xa — dùng lerp chậm hơn để không bị giật/va vào hành tinh
      lerpFactor.current = currentHash === "#uranus" || currentHash === "#neptune" ? 0.028 : 0.055;
    }
  }, [currentHash]);

  useFrame(({ clock }) => {
    if (!ufoRef.current) return;
    const time = clock.getElapsedTime();

    // ── Tính target — Uranus offset xa hơn để không va vào hành tinh ──────
    _target.current.set(0, 30, 80);
    if (currentHash !== "#overview" && ORBIT_CONFIG[currentHash]) {
      const cfg   = ORBIT_CONFIG[currentHash];
      const angle = anglesRef.current[currentHash] ?? 0;
      // Uranus: đẩy UFO ra xa hành tinh thêm 12 đơn vị, lên cao hơn 8
      const extraR = currentHash === "#uranus" ? 12 : 0;
      const extraY = currentHash === "#uranus" ? 8  : 0;
      _target.current.set(
        Math.sin(angle) * (cfg.radius + extraR),
        cfg.ufoHeight + extraY,
        Math.cos(angle) * (cfg.radius + extraR),
      );
    }

    if (shouldSnap.current) {
      ufoRef.current.position.copy(_target.current);
      prevPosition.current.copy(_target.current);
      velocity.current.set(0, 0, 0);
      shouldSnap.current = false;
    }

    prevPosition.current.copy(ufoRef.current.position);
    ufoRef.current.position.lerp(_target.current, lerpFactor.current);
    velocity.current.subVectors(ufoRef.current.position, prevPosition.current);

    // Nhẹ nhàng hơn — bobbing mượt
    ufoRef.current.position.y += Math.sin(time * 1.1) * 0.035;
    // Xoay từ từ, hiện đại hơn
    ufoRef.current.rotation.y += 0.012;

    // Banking mượt — phản ứng với vận tốc
    const speedMag = velocity.current.length();
    const bankScale = Math.min(speedMag * 120, 1.0); // scale theo tốc độ thực
    const targetBankZ = -velocity.current.x * 0.28 * bankScale;
    const targetBankX = -velocity.current.z * 0.28 * bankScale;
    smoothedBank.current.x = THREE.MathUtils.lerp(smoothedBank.current.x, targetBankX, 0.035);
    smoothedBank.current.z = THREE.MathUtils.lerp(smoothedBank.current.z, targetBankZ, 0.035);
    ufoRef.current.rotation.x = smoothedBank.current.x;
    ufoRef.current.rotation.z = smoothedBank.current.z;

    if (isShaking) {
      ufoRef.current.position.x += (Math.random() - 0.5) * 3;
      ufoRef.current.position.y += (Math.random() - 0.5) * 3;
      ufoRef.current.position.z += (Math.random() - 0.5) * 3;
    }
    worldPosRef.current.copy(ufoRef.current.position);
    velWorldRef.current.copy(velocity.current);
  });

  const ufoScale   = currentHash !== "#overview" && ORBIT_CONFIG[currentHash] ? ORBIT_CONFIG[currentHash].ufoScale : 0.38;
  const isAtPlanet = currentHash !== "#overview";
  // màu nhẫn thay đổi theo hành tinh
  const ringColor  = currentHash === "#uranus"  ? "#00ffcc"
                   : currentHash === "#neptune" ? "#4488ff"
                   : currentHash === "#saturn"  ? "#ffcc44"
                   : "#00eeff";

  return (
    <group ref={ufoRef}>
      <primitive object={obj} scale={ufoScale} position={[0, 0, 0]} />

      {/* Vành sáng xoay — 2 lớp */}
      <UFOGlowRing scale={ufoScale} color={ringColor}  pulseSpeed={2.8} />
      <UFOGlowRing scale={ufoScale * 0.72} color="#ffffff" pulseSpeed={4.2} />

      {/* Engine thruster dưới đáy */}
      <UFOThruster scale={ufoScale} active={isAtPlanet} />

      {/* Tia quét xuống hành tinh khi đang orbit */}
      <UFOScanBeam scale={ufoScale} active={isAtPlanet} />

      {/* Đèn chính + accent */}
      <pointLight position={[0, 6 * ufoScale, 0]}   intensity={180} color="#aaddff" distance={60} />
      <pointLight position={[0, -4 * ufoScale, 0]}  intensity={120} color={ringColor} distance={45} />
      <pointLight position={[8 * ufoScale, 2 * ufoScale, 0]}  intensity={40} color="#ffffff" distance={25} />
      <pointLight position={[-8 * ufoScale, 2 * ufoScale, 0]} intensity={40} color="#ffffff" distance={25} />

      {/* Đèn đỏ báo động khi rung */}
      {isShaking && <pointLight position={[0, 0, 0]} color="#ff2200" intensity={300} distance={100} />}
    </group>
  );
}

// ─── [NHIỆM VỤ 2] CAMERA CONTROLLER — TOÀN CẢNH VÀ CHUYỂN ĐỘNG VŨ TRỤ ───
function CameraController({
  currentHash, isCinematic, anglesRef, isBackingToStart, isDraggingRef, hasInteractedRef
}: {
  currentHash: string; isCinematic: boolean;
  anglesRef: React.MutableRefObject<Record<string, number>>;
  isBackingToStart: boolean;
  isDraggingRef: React.MutableRefObject<boolean>;
  hasInteractedRef: React.MutableRefObject<boolean>;
}) {
  const { camera, controls, size } = useThree() as any;
  const backStartTimer = useRef(0);
  const prevPlanetPos  = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (hasInteractedRef) hasInteractedRef.current = false;
  }, [currentHash, isCinematic, hasInteractedRef]);

  // TẠO BỐ CỤC CHIA ĐÔI MÀN HÌNH KHI BẤM VÀO HÀNH TINH
  useEffect(() => {
    if (currentHash !== "#overview") {
      camera.setViewOffset(size.width, size.height, -size.width * 0.2, 0, size.width, size.height);
    } else {
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
  }, [currentHash, size, camera]);

  useFrame((state, delta) => {
    if (!controls) return;
    const safeDelta = Math.min(delta, 0.05);

    // ── CHẾ ĐỘ QUÉT VỀ TỔNG QUAN ──
    if (isBackingToStart) {
      backStartTimer.current += safeDelta;
      const t = backStartTimer.current;
      const sweepAngle = t * 0.55; 
      const startDist  = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      const dist = Math.min(startDist + t * 180, 2200); 
      const height = 80 + t * 35 + Math.sin(t * 0.4) * 40;
      
      camera.position.set(Math.sin(sweepAngle) * dist, height, Math.cos(sweepAngle) * dist);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
      return;
    }

    if (isDraggingRef?.current) {
      if (hasInteractedRef) hasInteractedRef.current = true;
      controls.update();
      return;
    }

    // ── CHẾ ĐỘ CINEMATIC ──
    if (isCinematic) {
      if (!hasInteractedRef?.current) {
        controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
        const t = state.clock.getElapsedTime() * 0.08;
        const targetPos = new THREE.Vector3(Math.sin(t) * 1200, 80 + Math.sin(t * 0.5) * 60, Math.cos(t) * 1200);
        camera.position.lerp(targetPos, 0.02);
      }
      controls.update();
      return; 
    }

    // ── CHẾ ĐỘ BÁM HÀNH TINH / TOÀN CẢNH VŨ TRỤ ──
    let planetPos = new THREE.Vector3(0, 0, 0);
    // Mặc định góc nhìn toàn cảnh xa và rộng
    let idealCamPos = new THREE.Vector3(0, 800, 2200); 

    if (currentHash !== "#overview" && ORBIT_CONFIG[currentHash]) {
      const cfg = ORBIT_CONFIG[currentHash];
      const angle = anglesRef.current[currentHash] ?? 0;
      planetPos.set(Math.sin(angle) * cfg.radius, 0, Math.cos(angle) * cfg.radius);

      // ZOOM VỪA PHẢI, KHÔNG BỊ CHUI VÀO LÕI
      const zoomF = 0.28;
      idealCamPos.set(
        planetPos.x + cfg.camOffset[0] * zoomF,
        planetPos.y + cfg.camOffset[1] * zoomF + 2,
        planetPos.z + cfg.camOffset[2] * zoomF
      );
    } else {
      // 🌟 KHI Ở MÀN HÌNH CHÍNH: Tự động cho camera trôi quanh Hệ mặt trời
      const t = state.clock.getElapsedTime() * 0.03;
      idealCamPos.set(
        Math.sin(t) * 2200, 
        800, 
        Math.cos(t) * 2200
      );
    }

    const deltaMove = planetPos.clone().sub(prevPlanetPos.current);
    prevPlanetPos.current.copy(planetPos);

    if (!hasInteractedRef?.current) {
      const camF  = 1 - Math.exp(-2.5 * safeDelta);
      const targF = 1 - Math.exp(-3.0 * safeDelta);
      camera.position.lerp(idealCamPos, camF);
      controls.target.lerp(planetPos, targF);
    } 
    else {
      if (currentHash !== "#overview") {
         controls.target.add(deltaMove);
         camera.position.add(deltaMove);
      }
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
  const [showIntro,       setShowIntro]       = useState(true);
  const [sceneVisible,    setSceneVisible]    = useState(false);
  const [bgPanning,       setBgPanning]       = useState(false);
  const [showSettings,    setShowSettings]    = useState(false);
  const isDraggingRef = useRef(false);
  const hasInteractedRef = useRef(false);

  const ufoWorldPos  = useRef(new THREE.Vector3());
  const ufoVelWorld  = useRef(new THREE.Vector3());

  const planetAngles = useRef<Record<string, number>>({
    "#mercury": 0, "#venus": 0, "#earth": 0, "#mars": 0,
    "#jupiter": 0, "#saturn": 0, "#uranus": 0, "#neptune": 0,
  });

  const planetHashes = [
    "#overview",
    "#mercury", "#venus", "#earth", "#mars",
    "#jupiter", "#saturn", "#uranus", "#neptune",
  ];

  // Nhãn tiếng Anh cho nav bar
  const PLANET_VI: Record<string, string> = {
    "#mercury": "MERCURY",
    "#venus":   "VENUS",
    "#earth":   "EARTH",
    "#mars":    "MARS",
    "#jupiter": "JUPITER",
    "#saturn":  "SATURN",
    "#uranus":  "URANUS",
    "#neptune": "NEPTUNE",
  };

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash || "#overview");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (showIntro) return;
    const idx = planetHashes.indexOf(currentHash);
    if (e.deltaY > 50  && idx < planetHashes.length - 1) window.location.hash = planetHashes[idx + 1];
    else if (e.deltaY < -50 && idx > 0)                  window.location.hash = planetHashes[idx - 1];
  };

  const handleEnterScene = () => {
    setShowIntro(false);
    setTimeout(() => { setSceneVisible(true); }, 500);
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
        <title>Hệ Mặt Trời</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
     <div
        onWheel={handleWheel}
        style={{
          width: "100vw", height: "100vh", overflow: "hidden", position: "relative",
          background: "#01020a" // Xóa bỏ cấu hình ảnh nền tĩnh ở đây
        }}
      >
     <style jsx global>{`
  @keyframes bgPan {
    0% { transform: translateX(0vw); }
    100% { transform: translateX(-100vw); }
  }
  .bg-pan {
    animation: bgPan 45s linear infinite;
  }
`}</style>

<div className="bg-pan" style={{
  position: "absolute", top: 0, left: 0, width: "200vw", height: "100vh",
  display: "flex", backgroundImage: "url(/b2.jpg)", backgroundSize: "cover"
}}>
  <div style={{width: "100vw", height: "100vh", flexShrink: 0}} />
  <div style={{width: "100vw", height: "100vh", flexShrink: 0}} />
</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: sceneVisible ? 1 : 0 }}
          transition={{ duration: 1 }}
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 1 }}
        >
          <AnimatedBackground />
          <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
            <Canvas
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
              dpr={[1, 2]}
            >
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault 
                  position={[0, 800, 2200]} 
                  fov={50} 
                  far={10000} />
                <OrbitControls
                  makeDefault
                  enablePan={false}
                  minDistance={10}
                  maxDistance={3000}
                  enableDamping
                  dampingFactor={0.06}
                  rotateSpeed={0.8}
                  // Cập nhật giá trị cho các Ref ở đây
                 onChange={() => { if (hasInteractedRef) hasInteractedRef.current = true; }}
                 onStart={() => { if (isDraggingRef) isDraggingRef.current = true; }}
                 onEnd={() => { if (isDraggingRef) isDraggingRef.current = false; }}
                />
                <CameraController
                  currentHash={currentHash}
                  isCinematic={isCinematic}
                  anglesRef={planetAngles}
                  isBackingToStart={bgPanning}
                  // Truyền biến xuống Camera
                  isDraggingRef={isDraggingRef}
                  hasInteractedRef={hasInteractedRef}
                />

                <ambientLight intensity={0.1} />
                <pointLight position={[0, 0, 0]} intensity={20} color="#fff8e1" distance={3000} />

                <Stars radius={3000} depth={150} count={10000} factor={50} saturation={1} fade speed={0.4} />

                <Sun isActive={currentHash === "#overview"} />

                <UFO currentHash={currentHash} isShaking={isShaking} worldPosRef={ufoWorldPos} velWorldRef={ufoVelWorld} anglesRef={planetAngles} />
                <UFOErrorEffect isShaking={isShaking} ufoPos={ufoWorldPos} />
                <RocketTrail posRef={ufoWorldPos} velRef={ufoVelWorld} currentHash={currentHash} />

                <OrbitLine radius={80}   /><OrbitLine radius={140}  /><OrbitLine radius={210}  />
                <OrbitLine radius={300}  /><OrbitLine radius={480}  /><OrbitLine radius={680}  />
                <OrbitLine radius={880}  /><OrbitLine radius={1050} />

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
                  <Bloom intensity={bloomIntensity} luminanceThreshold={0.2} mipmapBlur radius={0.5} />
                </EffectComposer>
                <BackgroundEffects />
              </Suspense>
            </Canvas>
          </div>

          <PlanetArrivalEffect currentHash={currentHash} />

          {isShaking && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
              background: "radial-gradient(ellipse at center, rgba(255,0,0,0.35) 0%, rgba(200,0,0,0.15) 50%, transparent 80%)",
              boxShadow: "inset 0 0 120px rgba(255,0,0,0.6)",
            }} />
          )}

          <div style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }}>
            {/* ── NÚT BẤM ĐÓNG/MỞ HUD CONTROLS ── */}
            <div style={{ position: "absolute", top: "20px", right: "20px", pointerEvents: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", zIndex: 50 }}>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  padding: "10px 18px",
                  backgroundColor: showSettings ? "rgba(0, 243, 255, 0.2)" : "rgba(0, 0, 0, 0.5)",
                  color: showSettings ? "#ffffff" : "#00f3ff",
                  border: "1px solid rgba(0, 243, 255, 0.3)",
                  borderRight: "3px solid #00f3ff",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "12px",
                  letterSpacing: "2px",
                  backdropFilter: "blur(10px)",
                  boxShadow: showSettings ? "0 0 20px rgba(0, 243, 255, 0.4)" : "0 0 10px rgba(0,0,0,0.5)",
                  transition: "all 0.3s ease",
                  marginBottom: "10px",
                }}
              >
                {showSettings ? "CLOSE SETTINGS" : "⚙️ SETTINGS"}
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: -15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: "relative" }}
                  >
                    <div style={{ position: "relative", transform: "translate(20px, -20px)" }}>
                      <HUDControls
                        solarSpeed={solarSpeed} setSolarSpeed={setSolarSpeed}
                        bloomIntensity={bloomIntensity} setBloomIntensity={setBloomIntensity}
                        isCinematic={isCinematic} setIsCinematic={setIsCinematic}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
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
              onClick={() => {
                // Navigate về overview sau 7s (camera đã sweep xong)
                setTimeout(() => {
                  window.location.hash = "#overview";
                  setTimeout(() => setBgPanning(false), 1000);
                }, 7000);
              }}
              style={{
                position: "fixed", bottom: "40px", right: "40px",
                padding: "10px 24px",
                backgroundColor: bgPanning ? "rgba(0,243,255,0.15)" : "rgba(255,255,255,0.1)",
                color: bgPanning ? "#00f3ff" : "white",
                border: bgPanning ? "1px solid #00f3ff" : "1px solid rgba(255,255,255,0.3)",
                borderRadius: "99px", cursor: bgPanning ? "default" : "pointer",
                backdropFilter: "blur(10px)",
                pointerEvents: "auto", fontSize: "13px", letterSpacing: "2px",
                transition: "all 0.5s ease",
                boxShadow: bgPanning ? "0 0 20px rgba(0,243,255,0.4)" : "none",
              }}
              onMouseEnter={(e) => { if (!bgPanning) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.2)"; }}}
              onMouseLeave={(e) => { if (!bgPanning) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}}
            >
              {bgPanning ? "RETURNING..." : "BACK TO START"}
            </button>

            {/* Nav bar hành tinh — tiếng Việt */}
            <div style={{
              position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: "8px", padding: "10px",
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
              borderRadius: "50px", border: "1px solid rgba(0,243,255,0.2)",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)", pointerEvents: "auto",
            }}>
              {Object.keys(ORBIT_CONFIG).map((hash) => (
                <button
                  key={hash}
                  onClick={() => (window.location.hash = hash)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: currentHash === hash ? "rgba(0,243,255,0.3)" : "transparent",
                    color: currentHash === hash ? "#00f3ff" : "#fff",
                    border: "none", borderRadius: "20px",
                    fontSize: "11px", fontWeight: "bold",
                    cursor: "pointer", textTransform: "uppercase", transition: "all 0.3s ease",
                    borderBottom: currentHash === hash ? "2px solid #00f3ff" : "none",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0,243,255,0.2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = currentHash === hash ? "rgba(0,243,255,0.3)" : "transparent"; }}
                >
                  {PLANET_VI[hash] ?? hash.replace("#", "")}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showIntro && <IntroScreen onEnter={handleEnterScene} />}
        </AnimatePresence>
      </div>
    </>
  );
}
