import Planet from "./Planet"
import { useTexture } from "@react-three/drei"
import * as THREE from "three" // Thêm dòng này để dùng DoubleSide

const Uranus = ({ setControlsEnabled, isActive, onClick }) => {
  const pos = [0, 0, 880]
  const ringTexture = useTexture("/icons/nhanuranus.jpg")

  return (
    <group>
      <Planet
        position={pos}
        meshMaterialPath="/icons/2k_uranus.jpg"
        spinSpeed={0.003}
        size={25}
        onClick={onClick}
      />

      <mesh position={pos} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[35, 60, 128]} />
        <meshStandardMaterial
          map={ringTexture}
          transparent={true}
          opacity={0.8}
          side={THREE.DoubleSide}
          metalness={0.5}
          roughness={0.2}
          emissive={new THREE.Color("#9cd4df")}
          emissiveMap={ringTexture}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

export default Uranus
