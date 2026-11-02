import { useRef } from 'react';
import { Group, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

export default function Airplane() {
  const propRef = useRef<Mesh>(null!);

  // Spin propeller every frame
  useFrame((_, delta) => {
    if (propRef.current) {
      propRef.current.rotation.z += delta * 20;
    }
  });

  return (
    <group position={[0, 2, 0]}>
      {/* Fuselage (Body) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.8, 4, 8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Main Wings */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[7, 0.1, 1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* Tail Fin */}
      <mesh position={[0, 0.8, -1.5]}>
        <boxGeometry args={[0.1, 1, 0.8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Propeller */}
      <mesh ref={propRef} position={[0, 0, 2.1]}>
        <boxGeometry args={[2, 0.2, 0.1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}