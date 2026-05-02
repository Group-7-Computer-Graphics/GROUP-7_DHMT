import Planet from "./Planet"

const Earth = ({ setControlsEnabled, isActive, onClick }) => {
  const pos = [0, 0, 210]

  return (
    <group>
      {/* 1. KHỐI CẦU HÀNH TINH */}
      <Planet
        position={pos}
        meshMaterialPath="/earth_map.jpeg"
        spinSpeed={0.005}
        size={10}
        onClick={onClick}
      />
    </group>
  )
}

export default Earth
