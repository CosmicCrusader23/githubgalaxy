'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { GitHubUser } from '@/types/github';

interface SunProps {
  user: GitHubUser;
  rotationSpeed?: number;
}

export function Sun({ user, rotationSpeed = 1 }: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Calculate sun size based on followers (logarithmic scale)
  // Base size: 1.5, Max size: 3.0
  const logFollowers = Math.log10(Math.max(user.followers, 1));
  const sunSize = 1.5 + Math.min(logFollowers * 0.3, 1.5);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation for the sun - controlled by speed
      meshRef.current.rotation.y += 0.002 * rotationSpeed;
    }
  });

  return (
    <group>
      {/* The sun sphere with user avatar */}
      <Sphere ref={meshRef} args={[sunSize, 32, 32]}>
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFA500"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.6}
        />
      </Sphere>

      {/* Point light inside the sun to illuminate planets */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        intensity={2}
        distance={100}
        color="#FFD700"
        castShadow
      />

      {/* Ambient glow effect */}
      <Sphere args={[sunSize * 1.2, 32, 32]}>
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}
