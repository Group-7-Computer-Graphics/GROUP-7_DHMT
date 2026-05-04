import Planet from "./Planet"

const Venus = ({ setControlsEnabled, isActive, onClick }) => {
  const pos = [0, 0, 140]

  return (
    <group>
      <Planet
        position={pos}
        meshMaterialPath="/icons/2k_venus_surface.jpg"
        spinSpeed={0.002}
        size={6.8}
        onClick={onClick}
      />
    </group>
  )
}
export default Venus
