'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

interface MoonProps {
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  size: number;
  color: string;
}

export function Moon({ orbitRadius, orbitSpeed, orbitPhase, size, color }: MoonProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const angle = orbitPhase + time * orbitSpeed;

      // Calculate orbit position using sin/cos
      meshRef.current.position.x = Math.cos(angle) * orbitRadius;
      meshRef.current.position.z = Math.sin(angle) * orbitRadius;

      // Moon also rotates on its own axis
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 16, 16]}>
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        metalness={0.2}
      />
    </Sphere>
  );
}
