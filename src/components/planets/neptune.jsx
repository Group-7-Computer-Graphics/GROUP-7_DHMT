import Planet from "./Planet"

const Neptune = ({ setControlsEnabled, isActive, onClick }) => {
  const pos = [0, 0, 1050]

  return (
    <group>
      <Planet
        position={pos}
        meshMaterialPath="/icons/2k_neptune.jpg"
        spinSpeed={0.003}
        size={20}
        onClick={onClick}
      />
    </group>
  )
}
export default Neptune
