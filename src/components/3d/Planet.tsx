'use client';

import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { PlanetData } from '@/types/github';
import { Moon } from './Moon';

interface PlanetProps {
  planetData: PlanetData;
  galaxySpeed?: number;
}

export function Planet({ planetData, galaxySpeed = 1 }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { repo, orbitRadius, orbitSpeed, orbitPhase, size, color } = planetData;

  // Generate moons based on open_issues_count
  // Limit moons to prevent performance issues (max 5 moons per planet)
  const moonCount = Math.min(repo.open_issues_count, 5);

  // Create moon data
  const moons = Array.from({ length: moonCount }, (_, index) => ({
    orbitRadius: size * 1.8 + index * 0.3,
    orbitSpeed: (1.5 + index * 0.3) * galaxySpeed,
    orbitPhase: (index / moonCount) * Math.PI * 2,
    size: 0.08,
    color: '#AAAAAA',
  }));

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      const angle = orbitPhase + time * (orbitSpeed * galaxySpeed);

      // ORBIT MATH: Use sin/cos to calculate position on circular orbit
      // x = r * cos(θ), z = r * sin(θ) (y is up in Three.js)
      groupRef.current.position.x = Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    }

    if (meshRef.current) {
      // Self-rotation - controlled by speed
      meshRef.current.rotation.y += 0.01 * galaxySpeed;

      // Scale up on hover
      const targetScale = hovered ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  const handleClick = () => {
    window.open(repo.html_url, '_blank');
  };

  return (
    <group ref={groupRef}>
      {/* The planet sphere */}
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </Sphere>

      {/* Orbit path visualization (subtle ring) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Moons orbiting the planet */}
      {moons.map((moon, index) => (
        <Moon key={index} {...moon} />
      ))}

      {/* Tooltip on hover */}
      {hovered && (
        <mesh position={[0, size + 0.5, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      )}
    </group>
  );
}
