import React, { useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import * as THREE from "three"

const Sun = ({ isActive, onClick, emissiveIntensity = 4 }) => {
  const sunRef = useRef(null)

  const texture = useLoader(THREE.TextureLoader, "/sun.jpeg")

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh ref={sunRef} position={[0, 0, 0]} onClick={onClick}>
      <sphereGeometry args={[65, 64, 64]} />

      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="yellow"
        emissiveIntensity={emissiveIntensity}
        toneMapped={false}
      />
    </mesh>
  )
}

export default Sun
