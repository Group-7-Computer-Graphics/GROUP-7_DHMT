import Planet from "./Planet"
import { useTexture } from "@react-three/drei"
import * as THREE from "three" // Thêm dòng này để dùng DoubleSide

const Saturn = ({ setControlsEnabled, isActive, onClick }) => {
  const pos = [0, 0, 680]
  const ringTexture = useTexture("/icons/rings.jpg")

  return (
    <group>
      <Planet
        position={pos}
        meshMaterialPath="/icons/Saturn.jpg"
        spinSpeed={0.002}
        size={25}
        onClick={
          onClick ||
          (() => {
            window.location.hash = "#saturn"
          })
        }
      />

      <mesh position={pos} rotation={[Math.PI / 2.2, Math.PI / 6, 0]}>
        <ringGeometry args={[28,41 , 70]} />
        <meshStandardMaterial
          map={ringTexture}
          transparent={true}
          opacity={0.8}
          side={THREE.DoubleSide}
          metalness={0.5}
          roughness={0.2}
          emissive={new THREE.Color("#71532893")}
          emissiveMap={ringTexture}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

export default Saturn
