import Planet from "./Planet"

const Mercury = ({ setControlsEnabled, isActive, onClick }) => {
  const pos = [0, 0, 80]

  return (
    <group>
      <Planet
        position={pos}
        meshMaterialPath="/icons/2k_mercury.jpg"
        spinSpeed={0.004}
        size={3}
        onClick={onClick}
      />
    </group>
  )
}

export default Mercury
