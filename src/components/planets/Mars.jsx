import Planet from "./Planet"

const Mars = ({
  setControlsEnabled,
  isActive,
  initialProject = null,
  onClick // 2. NHẬN BIẾN onClick Ở ĐÂY
}) => {
  const pos = [0, 0, 300]

  return (
    <group>
      <Planet
        position={pos}
        meshMaterialPath="/mars.jpeg"
        spinSpeed={0.002}
        size={5}
        onClick={onClick}
      />
    </group>
  )
}

export default Mars
