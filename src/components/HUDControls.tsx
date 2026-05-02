import React from "react";

export function HUDControls({
  solarSpeed,
  setSolarSpeed,
  bloomIntensity,
  setBloomIntensity,
  isCinematic,
  setIsCinematic,
  playHover, // 👉 Nhận hàm âm thanh lướt chuột
  playClick, // 👉 Nhận hàm âm thanh bấm
}: {
  solarSpeed: number;
  setSolarSpeed: (v: number) => void;
  bloomIntensity: number;
  setBloomIntensity: (v: number) => void;
  isCinematic: boolean;
  setIsCinematic: (v: boolean) => void;
  playHover?: () => void;
  playClick?: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", color: "#00f3ff", fontFamily: "'Courier New', Courier, monospace" }}>
      
      <h3 style={{ 
        margin: "0", fontSize: "14px", letterSpacing: "3px", 
        borderBottom: "1px dashed rgba(0,243,255,0.4)", paddingBottom: "10px", textTransform: "uppercase",
        textShadow: "0 0 10px rgba(0,243,255,0.5)"
      }}>
        // System Settings
      </h3>

      {/* Orbit Speed Slider */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "12px", letterSpacing: "1px", fontWeight: "bold" }}>
          ORBIT SPEED: <span style={{ color: "white" }}>{solarSpeed.toFixed(1)}x</span>
        </label>
        <input
          type="range" min="0" max="5" step="0.1"
          value={solarSpeed}
          onChange={(e) => setSolarSpeed(parseFloat(e.target.value))}
          onMouseEnter={() => playHover && playHover()} // 👉 Âm thanh chạm
          onMouseDown={() => playClick && playClick()}  // 👉 Âm thanh bấm
          style={{ 
            accentColor: "#00f3ff", cursor: "pointer", height: "4px", 
            background: "rgba(0,243,255,0.2)", outline: "none", borderRadius: "2px" 
          }}
        />
      </div>

      {/* Bloom Intensity Slider */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "12px", letterSpacing: "1px", fontWeight: "bold" }}>
          GLOW INTENSITY: <span style={{ color: "white" }}>{bloomIntensity.toFixed(1)}</span>
        </label>
        <input
          type="range" min="0" max="3" step="0.1"
          value={bloomIntensity}
          onChange={(e) => setBloomIntensity(parseFloat(e.target.value))}
          onMouseEnter={() => playHover && playHover()} // 👉 Âm thanh chạm
          onMouseDown={() => playClick && playClick()}  // 👉 Âm thanh bấm
          style={{ 
            accentColor: "#00f3ff", cursor: "pointer", height: "4px", 
            background: "rgba(0,243,255,0.2)", outline: "none", borderRadius: "2px" 
          }}
        />
      </div>

      {/* Cinematic Mode Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
        <label style={{ fontSize: "12px", letterSpacing: "1px", fontWeight: "bold" }}>CINEMATIC CAM</label>
        <button
          onClick={() => {
            if (playClick) playClick(); // 👉 Âm thanh bấm
            setIsCinematic(!isCinematic);
          }}
          onMouseEnter={(e) => {
            if (playHover) playHover(); // 👉 Âm thanh chạm
            e.currentTarget.style.backgroundColor = isCinematic ? "rgba(0, 243, 255, 0.4)" : "rgba(0, 243, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isCinematic ? "rgba(0, 243, 255, 0.3)" : "rgba(0, 0, 0, 0.5)";
          }}
          style={{
            padding: "6px 12px",
            backgroundColor: isCinematic ? "rgba(0, 243, 255, 0.3)" : "rgba(0, 0, 0, 0.5)",
            color: isCinematic ? "#fff" : "#00f3ff",
            border: `1px solid ${isCinematic ? "#00f3ff" : "rgba(0, 243, 255, 0.4)"}`,
            borderRadius: "2px", cursor: "pointer",
            fontSize: "11px", fontWeight: "bold", letterSpacing: "1px",
            boxShadow: isCinematic ? "0 0 10px rgba(0,243,255,0.4)" : "none",
            transition: "all 0.3s ease"
          }}
        >
          {isCinematic ? "ACTIVE" : "STANDBY"}
        </button>
      </div>

    </div>
  );
}