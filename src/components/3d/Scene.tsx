'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'

interface SceneProps {
  children: React.ReactNode
  enableControls?: boolean
  cameraPosition?: [number, number, number]
  className?: string
}


export default function Scene({
  children,
  enableControls = true,
  cameraPosition = [0, 5, 10],
  className = "h-96 w-full"
}: SceneProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting setup for Hawaiian environments */}
          <ambientLight intensity={0.4} color="#fef3c7" />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            color="#fbbf24"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#38bdf8" />

          {/* Environment and camera controls */}
          <Environment preset="sunset" />
          <PerspectiveCamera makeDefault position={cameraPosition} />

          {enableControls && (
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={50}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
          )}

          {/* Render children (3D content) */}
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}