'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface IslandProps {
  position?: [number, number, number]
  scale?: number
  animate?: boolean
}

export default function Island({
  position = [0, 0, 0],
  scale = 1,
  animate = true
}: IslandProps) {
  const islandRef = useRef<Mesh>(null)

  // Gentle floating animation
  useFrame((state) => {
    if (islandRef.current && animate) {
      islandRef.current.rotation.y += 0.002
      islandRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group position={position} scale={scale}>
      {/* Main island base */}
      <mesh ref={islandRef} position={[0, -2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4, 6, 2, 12]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>

      {/* Beach sand ring */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.2, 12]} />
        <meshStandardMaterial color="#F1B896" roughness={0.7} />
      </mesh>

      {/* Ocean water around island */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <cylinderGeometry args={[8, 8, 0.1, 12]} />
        <meshStandardMaterial
          color="#1890ff"
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Palm trees */}
      <group>
        {/* Tree 1 */}
        <mesh position={[2, 0, 1]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[2, 1.8, 1]} castShadow>
          <sphereGeometry args={[0.8]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>

        {/* Tree 2 */}
        <mesh position={[-1.5, 0, -2]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 2.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-1.5, 1.5, -2]} castShadow>
          <sphereGeometry args={[0.7]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>

        {/* Tree 3 */}
        <mesh position={[0, 0, 3]} castShadow>
          <cylinderGeometry args={[0.1, 0.15, 3.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 2.2, 3]} castShadow>
          <sphereGeometry args={[0.9]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
      </group>

      {/* Cultural elements - simple hale (house) structure */}
      <group position={[1, -0.5, -1]}>
        {/* Hale base */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.8, 1.2]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
        {/* Hale roof */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <coneGeometry args={[1.2, 0.8, 4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
    </group>
  )
}