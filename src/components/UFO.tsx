import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

interface UFOProps {
  currentPlanet: string;
  targetPlanet: string;
  isMoving: boolean;
  isShaking: boolean;
  onArrive: () => void;
}

const ORBIT_CONFIG: Record<string, { radius: number }> = {
  "#mercury": { radius: 80 },
  "#venus": { radius: 140 },
  "#earth": { radius: 210 },
  "#mars": { radius: 300 },
  "#jupiter": { radius: 480 },
  "#saturn": { radius: 680 },
  "#uranus": { radius: 880 },
  "#neptune": { radius: 1050 },
};

export default function UFO({ currentPlanet, targetPlanet, isMoving, isShaking, onArrive }: UFOProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [ufoModel, setUfoModel] = React.useState<THREE.Object3D | null>(null);
  const [startPosition, setStartPosition] = React.useState<THREE.Vector3 | null>(null);
  const [targetPosition, setTargetPosition] = React.useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    const objLoader = new OBJLoader();
    objLoader.load('/models/ufo.obj', (object) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#1f1f1f',
            emissive: '#16d450',
            emissiveIntensity: 0.6,
            roughness: 0.35,
            metalness: 0.9,
          });
        }
      });
      setUfoModel(object);
    }, undefined, (error) => {
      console.error('Error loading UFO model:', error);
    });
  }, []);

  React.useEffect(() => {
    if (isMoving && targetPlanet !== "#overview" && ORBIT_CONFIG[targetPlanet]) {
      const config = ORBIT_CONFIG[targetPlanet];
      const time = 0; // Start from angle 0 for simplicity
      const angle = time;
      const x = Math.cos(angle) * config.radius;
      const z = Math.sin(angle) * config.radius;
      setTargetPosition(new THREE.Vector3(x, 50, z));
      if (groupRef.current) {
        setStartPosition(groupRef.current.position.clone());
      }
    } else {
      setStartPosition(null);
      setTargetPosition(null);
    }
  }, [isMoving, targetPlanet]);

  const lerpFactor = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isMoving && startPosition && targetPosition) {
      lerpFactor.current += delta * 0.5; // Adjust speed
      if (lerpFactor.current >= 1) {
        lerpFactor.current = 1;
        onArrive();
      }
      groupRef.current.position.lerpVectors(startPosition, targetPosition, lerpFactor.current);
    } else {
      let position = new THREE.Vector3(0, 50, 0); // Default above sun

      const planetToFollow = currentPlanet;

      if (planetToFollow !== "#overview" && ORBIT_CONFIG[planetToFollow]) {
        const config = ORBIT_CONFIG[planetToFollow];
        const time = state.clock.getElapsedTime() * 0.1;
        const angle = time;
        const x = Math.cos(angle) * config.radius;
        const z = Math.sin(angle) * config.radius;
        position.set(x, 50, z);
      } else {
        // If overview, place near Earth for visibility
        const config = ORBIT_CONFIG["#earth"];
        const time = state.clock.getElapsedTime() * 0.1;
        const angle = time;
        const x = Math.cos(angle) * config.radius;
        const z = Math.sin(angle) * config.radius;
        position.set(x, 50, z);
      }

      groupRef.current.position.copy(position);
    }

    if (isShaking) {
      const shake = Math.sin(state.clock.getElapsedTime() * 50) * 2;
      groupRef.current.position.y += shake;
    }

    // Rotate UFO
    groupRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={groupRef}>
      {ufoModel ? (
        <primitive object={ufoModel} scale={[1, 1, 1]} />
      ) : (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
            <cylinderGeometry args={[36, 40, 6, 100]} />
            <meshStandardMaterial color="#181818" roughness={0.28} metalness={0.95} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[31.5, 2.2, 16, 120]} />
            <meshStandardMaterial color="#0e350f" emissive="#18d75a" emissiveIntensity={1.1} roughness={0.18} metalness={0.7} />
          </mesh>
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[18, 64, 32]} />
            <meshStandardMaterial color="#0b2b08" emissive="#0e7a15" emissiveIntensity={0.5} roughness={0.22} metalness={0.5} transparent opacity={0.78} />
          </mesh>
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[28.5, 1.5, 12, 100]} />
            <meshStandardMaterial color="#16d450" emissive="#16d450" emissiveIntensity={1.4} roughness={0.15} metalness={0.45} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, index) => (
            <mesh key={index} position={[Math.cos(rot) * 24, 0.5, Math.sin(rot) * 24]} rotation={[0, rot, 0]}>
              <boxGeometry args={[6, 1, 3]} />
              <meshStandardMaterial color="#16d450" emissive="#16d450" emissiveIntensity={1.2} roughness={0.1} metalness={0.3} />
            </mesh>
          ))}
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, index) => (
            <mesh key={`panel-${index}`} position={[Math.cos(rot) * 20, 1.8, Math.sin(rot) * 20]} rotation={[0, rot, 0]}>
              <boxGeometry args={[3.5, 0.5, 1.2]} />
              <meshStandardMaterial color="#0a8c17" emissive="#0a8c17" emissiveIntensity={0.8} roughness={0.25} metalness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, 5.5, 0]}>
            <sphereGeometry args={[7.5, 40, 20]} />
            <meshStandardMaterial color="#0c520f" emissive="#0dde44" emissiveIntensity={0.6} roughness={0.2} metalness={0.4} transparent opacity={0.72} />
          </mesh>
        </group>
      )}
    </group>
  );
}