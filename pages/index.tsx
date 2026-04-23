import css from "@/styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import { ChakraProvider } from "@chakra-ui/react";
import DynamicNav from "@/components/DynamicNav";
import { Loader } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Sun from "../src/components/planets/Sun";
import Earth from "../src/components/planets/Earth";
import Mars from "../src/components/planets/Mars";
import Jupiter from "../src/components/planets/Jupiter";
import Saturn from "../src/components/planets/saturn";
import Mercury from "../src/components/planets/mecury";
import Neptune from "../src/components/planets/neptune";
import Uranus from "../src/components/planets/uranus";
import Venus from "../src/components/planets/venus";
// ✏️  Import component màn hình intro
import IntroScreen from "@/components/IntroScreen";

// ─────────────────────────────────────────────────────────────
// Component nội bộ: bật/tắt OrbitControls
// ─────────────────────────────────────────────────────────────
interface ToggleOrbitControlsProps {
  enabled: boolean;
}

const ToggleOrbitControls: React.FC<ToggleOrbitControlsProps> = ({
  enabled,
}) => {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // Null check từ File 1 — tránh lỗi khi controls chưa mount
    if (controlsRef.current) {
      controlsRef.current.enabled = enabled;
    }
  }, [enabled]);

  return (
    <OrbitControls zoomSpeed={0.3} enablePan={false} ref={controlsRef} />
  );
};

// ─────────────────────────────────────────────────────────────
// Trang chính
// ─────────────────────────────────────────────────────────────

export default function App() {
  // ── State: màn hình intro ──────────────────────────────
  // true  → đang hiển thị intro screen
  // false → đã chuyển sang không gian 3D
  const [showIntro, setShowIntro] = useState(true);

  // Khi Canvas 3D xuất hiện, cho phép fade-in mượt
  const [sceneVisible, setSceneVisible] = useState(false);

  // ── State: điều hướng camera ──────────────────────────
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [initialCameraPosition, setInitialCameraPosition] = useState<
    [number, number, number]
  >([0, 0, 500]);

  // initialHash — giữ lại để tracking nếu cần dùng sau
  const [initialHash, setInitialHash] = useState("");

  // ── State: các panel đang mở ──────────────────────────
  const [shouldShowVisuals, setShouldShowVisuals] = useState(false);
  const [shouldShowWriting, setShouldShowWriting] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // ── Xử lý chuyển từ Intro → 3D ───────────────────────
  const handleEnterScene = () => {
    // Bước 1: Ẩn intro screen (IntroScreen tự chạy animation mờ dần)
    setShowIntro(false);
    // Bước 2: Sau 0.5s, bắt đầu fade-in Canvas 3D
    setTimeout(() => {
      setSceneVisible(true);
    }, 500);
  };

  // ── Xử lý URL hash (điều hướng qua URL) ──────────────
  const processHash = (hash: string) => {
    if (hash.startsWith("#projects")) {
      setInitialCameraPosition([0, 0, 124]);

      if (hash === "#projects-dance") {
        setActiveProject("dance");
        setControlsEnabled(false);
      } else if (hash === "#projects-scios") {
        setActiveProject("scios");
        setControlsEnabled(false);
      } else if (hash === "#projects-personal") {
        setActiveProject("personal");
        setControlsEnabled(false);
      // ── Bổ sung từ File 2 ──────────────────────────────
      } else if (hash === "#projects-brex") {
        setActiveProject("brex");
        setControlsEnabled(false);
      } else if (hash === "#projects-wiki") {
        setActiveProject("wiki");
        setControlsEnabled(false);
      // ───────────────────────────────────────────────────
      } else {
        setActiveProject(null);
        setControlsEnabled(true);
      }

      setShouldShowVisuals(false);
      setShouldShowWriting(false);
    } else if (hash === "#visuals") {
      setInitialCameraPosition([0, 0, 38]);
      setShouldShowVisuals(true);
      setShouldShowWriting(false);
      setActiveProject(null);
      setControlsEnabled(false);
    } else if (hash === "#writing") {
      setInitialCameraPosition([0, 0, 38]);
      setShouldShowVisuals(false);
      setShouldShowWriting(true);
      setActiveProject(null);
      setControlsEnabled(false);
    } else if (hash === "#earth") {
      setInitialCameraPosition([0, 0, 38]);
      setShouldShowVisuals(false);
      setShouldShowWriting(false);
      setActiveProject(null);
      setControlsEnabled(true);
    } else if (hash === "#connect") {
      setInitialCameraPosition([0, 0, 20]);
      setShouldShowVisuals(false);
      setShouldShowWriting(false);
      setActiveProject(null);
      setControlsEnabled(true);
    } else if (hash === "#about") {
      setInitialCameraPosition([0, 0, 500]);
      setShouldShowVisuals(false);
      setShouldShowWriting(false);
      setActiveProject(null);
      setControlsEnabled(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      setInitialHash(hash);
      processHash(hash);

      const handleHashChange = () => {
        processHash(window.location.hash.toLowerCase());
      };

      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, []);

  return (
    <ChakraProvider>
      <div className={css.scene} style={{ position: "relative" }}>

        {/* ── Canvas 3D (luôn render phía dưới) ──────────── */}
        {/*
          Canvas bắt đầu với opacity=0 và fade-in khi sceneVisible=true.
          Điều này tạo hiệu ứng "xuất hiện dần" sau khi rời intro.
        */}
        <motion.div
          animate={{ opacity: sceneVisible ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeIn" }}
          style={{ width: "100%", height: "100%" }}
        >
          <Canvas>
            <PerspectiveCamera
              makeDefault
              position={initialCameraPosition}
              ref={cameraRef}
            />

            {/* Ẩn nav khi controls bị tắt (đang xem project) */}
            {controlsEnabled ? <DynamicNav /> : null}

            <ToggleOrbitControls enabled={controlsEnabled} />

            <ambientLight intensity={0.2} />
            <spotLight position={[30, 30, 10]} />

            <Stars
              count={10000}
              radius={100}
              speed={2}
              factor={8}
              fade={true}
            />

            {/* Các hành tinh */}
            <Sun />
            <Mars
              setControlsEnabled={setControlsEnabled}
              initialProject={activeProject}
            />
            <Earth
              setControlsEnabled={setControlsEnabled}
              initialShowVisuals={shouldShowVisuals}
              initialShowWriting={shouldShowWriting}
            />
            <Mercury setControlsEnabled={setControlsEnabled} />
            <Jupiter setControlsEnabled={setControlsEnabled} />
            <Neptune setControlsEnabled={setControlsEnabled} />
            <Saturn setControlsEnabled={setControlsEnabled} />
            <Uranus setControlsEnabled={setControlsEnabled} />
            <Venus setControlsEnabled={setControlsEnabled} />
          </Canvas>
          <Loader />
        </motion.div>

        {/* ── Intro Screen (nằm phủ lên trên Canvas) ───── */}
        {/*
          AnimatePresence cho phép component chạy exit animation
          trước khi bị xóa khỏi DOM.
          Khi showIntro = false, IntroScreen sẽ mờ dần rồi biến mất.
        */}
        <AnimatePresence>
          {showIntro && (
            <IntroScreen onEnter={handleEnterScene} />
          )}
        </AnimatePresence>

      </div>
    </ChakraProvider>
  );
}