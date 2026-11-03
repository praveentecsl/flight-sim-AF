import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Group, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

const Airplane = forwardRef<Group>((_, ref) => {
  const groupRef = useRef<Group>(null!);
  const propRef = useRef<Mesh>(null!);
  const rudderRef = useRef<Mesh>(null!);

  useImperativeHandle(ref, () => groupRef.current);

  const speed = useRef(0.3);
  const controls = useRef({ pitch: 0, roll: 0, yaw: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (e.key === 'ArrowUp' || key === 'w') controls.current.pitch = 1;
      if (e.key === 'ArrowDown' || key === 's') controls.current.pitch = -1;
      if (e.key === 'ArrowLeft' || key === 'a') controls.current.roll = 1;
      if (e.key === 'ArrowRight' || key === 'd') controls.current.roll = -1;
      if (key === 'q') controls.current.yaw = 1;
      if (key === 'e') controls.current.yaw = -1;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'w', 'arrowdown', 's'].includes(key)) controls.current.pitch = 0;
      if (['arrowleft', 'a', 'arrowright', 'd'].includes(key)) controls.current.roll = 0;
      if (['q', 'e'].includes(key)) controls.current.yaw = 0;
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

    // Propeller spinning animation
    if (propRef.current) propRef.current.rotation.z += delta * 50;

    // Rudder physical deflection on Q/E input
    if (rudderRef.current) {
      rudderRef.current.rotation.y = controls.current.yaw * 0.4;
    }

    // Rotations (Roll, Pitch, Yaw)
    groupRef.current.rotation.z += controls.current.roll * delta * 2;
    groupRef.current.rotation.x += controls.current.pitch * delta * 2;
    groupRef.current.rotation.y += controls.current.yaw * delta * 1.5;

    // Continuous forward propulsion
    groupRef.current.translateZ(-speed.current);
  });

  return (
    <group ref={groupRef} position={[0, 5, 0]}>
      {/* Fuselage (Main Body) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.7, 4.5, 16]} />
        <meshStandardMaterial color="#2563eb" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Cockpit Canopy */}
      <mesh position={[0, 0.4, 0.5]} castShadow>
        <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.7} roughness={0.1} />
      </mesh>

      {/* Main Wings */}
      <mesh position={[0, 0, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[7.5, 0.08, 1.2]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Navigation Lights (Left Red, Right Green) */}
      <mesh position={[-3.75, 0, 0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[3.75, 0, 0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>

      {/* Horizontal Stabilizer (Tail Wings) */}
      <mesh position={[0, 0.2, -1.8]} castShadow>
        <boxGeometry args={[2.4, 0.06, 0.6]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Fixed Vertical Tail Fin */}
      <mesh position={[0, 0.6, -1.7]} castShadow>
        <boxGeometry args={[0.08, 0.8, 0.6]} />
        <meshStandardMaterial color="#2563eb" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Deflecting Rudder */}
      <mesh ref={rudderRef} position={[0, 0.6, -2.05]} castShadow>
        <boxGeometry args={[0.06, 0.8, 0.3]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Propeller Hub & Blades */}
      <group position={[0, 0, 2.3]}>
        <mesh ref={propRef}>
          <boxGeometry args={[2.2, 0.15, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.2, 0.4, 12]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
    </group>
  );
});

export default Airplane;