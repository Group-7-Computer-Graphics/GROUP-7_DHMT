import { Box, Sphere } from "@react-three/drei";
import { useRouter } from "next/router";
import { TextureLoader } from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const TestComponent = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/projects");
  };
  const texture = new TextureLoader().load('/earth_map.jpeg');
  return (
    <>
      <Sphere onClick={handleClick}>
        <meshStandardMaterial map={texture} />
      </Sphere>
    </>
  );
};

export default TestComponent;
