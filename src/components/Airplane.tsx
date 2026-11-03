import { useRef, useEffect, useState } from 'react';
import { Group, Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

export default function Airplane() {
  const groupRef = useRef<Group>(null!);
  const propRef = useRef<Mesh>(null!);

  // Flight state parameters
  const speed = useRef(0.2);
  const controls = useRef({ pitch: 0, roll: 0, yaw: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') controls.current.pitch = 1;
      if (e.key === 'ArrowDown' || e.key === 's') controls.current.pitch = -1;
      if (e.key === 'ArrowLeft' || e.key === 'a') controls.current.roll = 1;
      if (e.key === 'ArrowRight' || e.key === 'd') controls.current.roll = -1;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'ArrowDown', 's'].includes(e.key)) controls.current.pitch = 0;
      if (['ArrowLeft', 'a', 'ArrowRight', 'd'].includes(e.key)) controls.current.roll = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Spin propeller
    if (propRef.current) {
      propRef.current.rotation.z += delta * 50;
    }

    // Apply rotation based on controls
    groupRef.current.rotation.z += controls.current.roll * delta * 2; // Roll (banking)
    groupRef.current.rotation.x += controls.current.pitch * delta * 2; // Pitch

    // Move forward in local Z direction
    groupRef.current.translateZ(-speed.current);
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      {/* Fuselage */}
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