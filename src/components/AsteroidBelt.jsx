import React, { useRef, useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

export const AsteroidBelt = ({
  count,
  innerRadius,
  outerRadius,
  speedFactor
}) => {
  const meshRef = useRef(null)

  const asteroids = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
      const angle = Math.random() * Math.PI * 2
      const speed = (0.01 + Math.random() * 0.02) * speedFactor
      const size = 0.1 + Math.random() * 0.3

      const yOffset = (Math.random() - 0.5) * 5

      temp.push({ radius, angle, speed, size, yOffset })
    }
    return temp
  }, [count, innerRadius, outerRadius, speedFactor])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    asteroids.forEach((ast, i) => {
      const currentAngle = ast.angle + t * ast.speed

      const x = Math.cos(currentAngle) * ast.radius
      const z = Math.sin(currentAngle) * ast.radius
      const y = ast.yOffset

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(ast.size * 15)
      dummy.rotation.set(t * ast.speed * 2, t * ast.speed * 2, 0)
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#ffffff" transparent={true} opacity={0.6} />
    </instancedMesh>
  )
}
