'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { GitHubData, PlanetData } from '@/types/github';

interface SceneProps {
  data: {
    user: GitHubData['user'];
    planets: PlanetData[];
  } | null;
  galaxySpeed?: number;
}

export function Scene({ data, galaxySpeed = 1 }: SceneProps) {
  if (!data) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 15, 20], fov: 60 }}
        gl={{ antialias: true }}
        shadows
      >
        {/* Ambient lighting for overall scene visibility */}
        <ambientLight intensity={0.3} />

        {/* Directional light for dramatic shadows */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Starry background */}
        <Stars
          radius={300}
          depth={50}
          count={5000}
          factor={4}
          saturation={0.5}
          fade
          speed={1 * galaxySpeed}
        />

        {/* Environment for reflections */}
        <Environment preset="sunset" />

        {/* The sun (user) at center */}
        <Sun user={data.user} rotationSpeed={galaxySpeed} />

        {/* Planets (repos) orbiting sun */}
        {data.planets.map((planetData) => (
          <Planet key={planetData.repo.id} planetData={planetData} galaxySpeed={galaxySpeed} />
        ))}

        {/* Orbit controls for user interaction */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
