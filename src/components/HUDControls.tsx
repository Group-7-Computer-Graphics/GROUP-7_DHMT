import React from "react";

// Định nghĩa kiểu dữ liệu cho Props (để hết báo đỏ TypeScript)
interface HUDControlsProps {
  solarSpeed: number;
  setSolarSpeed: (val: number) => void;
  bloomIntensity: number;
  setBloomIntensity: (val: number) => void;
  isCinematic: boolean;
  setIsCinematic: (val: boolean) => void;
}

export function HUDControls({ 
  solarSpeed, setSolarSpeed, 
  bloomIntensity, setBloomIntensity, 
  isCinematic, setIsCinematic 
}: HUDControlsProps) {
  return (
    <div style={{
      position: "fixed", top: "8%", right: "30px", width: "250px",
      display: "flex", flexDirection: "column", gap: "20px", zIndex: 100
    }}>
      {/* CARD TỐC ĐỘ HỆ THỐNG */}
      <div style={hudCardStyle}>
        <div style={labelStyle}>SYSTEM VELOCITY</div>
        <input 
          type="range" min="0" max="20" step="0.1" 
          value={solarSpeed} 
          onChange={(e) => setSolarSpeed(parseFloat(e.target.value))}
          style={sliderStyle}
        />
        <div style={{fontSize: "10px", textAlign: "right", color: "#00f3ff"}}>{solarSpeed}x</div>
      </div>

      {/* CARD HIỆU ỨNG ÁNH SÁNG */}
      <div style={hudCardStyle}>
        <div style={labelStyle}>BLOOM INTENSITY</div>
        <input 
          type="range" min="0" max="10" step="0.5" 
          value={bloomIntensity} 
          onChange={(e) => setBloomIntensity(parseFloat(e.target.value))}
          style={sliderStyle}
        />
      </div>

      {/* NÚT CINEMATIC MODE */}
      <button 
        onClick={() => setIsCinematic(!isCinematic)}
        style={{
          ...buttonStyle,
          backgroundColor: isCinematic ? "rgba(0, 243, 255, 0.4)" : "rgba(0, 0, 0, 0.6)",
          boxShadow: isCinematic ? "0 0 15px #00f3ff" : "none",
          borderColor: isCinematic ? "#00f3ff" : "rgba(0, 243, 255, 0.5)"
        }}
      >
        {isCinematic ? "DISABLE CINEMATIC" : "ENABLE CINEMATIC"}
      </button>
    </div>
  );
}

// --- Styles giữ nguyên ---
const hudCardStyle: React.CSSProperties = {
  background: "rgba(0, 20, 40, 0.7)",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid rgba(0, 243, 255, 0.3)",
  color: "#00f3ff",
  fontFamily: "monospace",
  backdropFilter: "blur(10px)"
};

const labelStyle: React.CSSProperties = { fontSize: "10px", letterSpacing: "2px", marginBottom: "10px" };

const sliderStyle: React.CSSProperties = { width: "100%", accentColor: "#00f3ff", cursor: "pointer" };

const buttonStyle: React.CSSProperties = {
  padding: "12px",
  border: "1px solid #00f3ff",
  color: "#fff",
  cursor: "pointer",
  fontSize: "10px",
  letterSpacing: "2px",
  transition: "0.3s",
  borderRadius: "4px"
};