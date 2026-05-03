import { Sphere, useCursor } from "@react-three/drei"
import { useFrame, useLoader } from "@react-three/fiber"
import { useRef, useState } from "react"
import * as THREE from "three"

const Planet = props => {
  const planetRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const texture = useLoader(THREE.TextureLoader, props.meshMaterialPath)

  useCursor(hovered)

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += props.spinSpeed
    }
  })

  return (
    <Sphere
      args={[props.size || 1, 64, 64]}
      ref={planetRef}
      position={props.position}
      onClick={e => {
        e.stopPropagation()
        if (props.onClick) props.onClick()
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Đã xóa dòng antialiasing lỗi */}
      <meshBasicMaterial map={texture} />
    </Sphere>
  )
}

export default Planet
