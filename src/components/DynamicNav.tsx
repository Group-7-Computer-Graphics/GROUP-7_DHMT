import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import React from "react";
import { Html } from "@react-three/drei";

const DynamicNav = () => {
    const { camera } = useThree();
    const [animating, setAnimating] = React.useState(false);

    const easeInOut = (t: number) => {
        return 1 - Math.pow(1 - t, 9);
    };

    // Hàm animation dùng chung cho tất cả các nút
    const animateTo = (hash: string, x: number, y: number, z: number) => {
        window.history.pushState(null, "", hash);
        
        setAnimating(true);
        const targetPosition = new THREE.Vector3(x, y, z);
        const startTime = Date.now();
        const duration = 2000;
        const startPosition = camera.position.clone();

        const animateFrame = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easedProgress = easeInOut(progress);

            const newPosition = startPosition.clone().lerp(targetPosition, easedProgress);
            camera.position.copy(newPosition);

            if (progress < 1) {
                requestAnimationFrame(animateFrame);
            } else {
                setAnimating(false);
            }
        };

        animateFrame();
    };

    useFrame(() => {
        if (animating) {
            camera.updateMatrixWorld();
        }
    });

    const handleRealign = () => {
        const startPosition = camera.position.clone();
        // Giữ nguyên độ xa Z, nhưng đưa X và Y về 0 để nhìn thẳng
        animateTo(window.location.hash, 0, 0, Math.abs(startPosition.z));
    };

    return (
        <>
            {/* LOGO / TRANG CHỦ (#ABOUT) */}
            <Html style={{ position: "absolute", top: "-48vh", left: "-47vw", padding: "10px" }}>
                <button
                    style={{ fontFamily: "var(--font-nasa)", fontSize: 24, color: "#4D7FFF" }}
                    onClick={() => animateTo("#about", 0, 0, 500)}
                >
                    TRANG DOAN
                </button>
            </Html>

            {/* THANH NAVIGATION CHÍNH (HÀNH TINH) */}
            <Html
                style={{
                    position: "absolute",
                    top: "38vh", // Đẩy lên một chút để nhường chỗ cho hàng dưới
                    left: "-45vw",
                    width: "90vw",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: "20px",
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    color: "white",
                    fontSize: 14,
                }}
            >
                <button onClick={() => animateTo("#mercury", -15, 0, 25)}>Mercury</button>
                <button onClick={() => animateTo("#venus", 30, 0, -5)}>Venus</button>
                <button onClick={() => animateTo("#earth", 0, 0, 38)}>Earth</button>
                <button onClick={() => animateTo("#projects", 0, 0, 124)}>Mars</button>
                <button onClick={() => animateTo("#jupiter", 70, 0, 220)}>Jupiter</button>
                <button onClick={() => animateTo("#saturn", 110, 0, 300)}>Saturn</button>
                <button onClick={() => animateTo("#uranus", -60, 10, 350)}>Uranus</button>
                <button onClick={() => animateTo("#neptune", 80, -5, 440)}>Neptune</button>
            </Html>

            {/* CÁC NÚT CHỨC NĂNG PHỤ */}
            <Html
                style={{
                    position: "absolute",
                    top: "44vh",
                    left: "-25vw",
                    width: "50vw",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    fontFamily: "var(--font-inter)",
                    fontWeight: 600,
                    color: "white",
                    fontSize: 16,
                }}
            >
                <button onClick={() => animateTo("#earth", 0, 0, 38)}>Pleasures</button>
                <button onClick={() => animateTo("#connect", 0, 0, 20)}>Connect</button>
            </Html>

            {/* NÚT REALIGN (CĂN CHỈNH LẠI CAMERA) */}
            <Html style={{ position: "absolute", top: "45vh", right: "-48vw" }}>
                <button
                    onClick={handleRealign}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center",
                        color: "#BFBFBF",
                        fontSize: 16,
                    }}
                >
                    <img src="/icons/compass.svg" width={25} />
                    Realign
                </button>
            </Html>
        </>
    );
};

export default DynamicNav;