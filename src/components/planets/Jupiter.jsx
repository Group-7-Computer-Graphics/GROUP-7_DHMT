import Planet from "./Planet"

const Jupiter = ({ setControlsEnabled, isActive, onClick }) => {
  const pos = [0, 0, 480]
  const size = 50

  return (
    <group>
      <Planet
        position={pos}
        meshMaterialPath="/icons/2k_jupiter.jpg"
        spinSpeed={0.001}
        size={size}
        onClick={onClick}
      />
    </group>
  )
}

export default Jupiter
