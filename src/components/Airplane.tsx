import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Group, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

const Airplane = forwardRef<Group>((_, ref) => {
  const groupRef = useRef<Group>(null!);
  const propRef = useRef<Mesh>(null!);

  // Expose groupRef to parent component
  useImperativeHandle(ref, () => groupRef.current);

  const speed = useRef(0.2);
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
      if (['ArrowUp', 'w', 'ArrowDown', 's'].includes(e.key)) controls.current.pitch = 0;
      if (['ArrowLeft', 'a', 'ArrowRight', 'd'].includes(e.key)) controls.current.roll = 0;
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

    if (propRef.current) {
      propRef.current.rotation.z += delta * 30;
    }

    groupRef.current.rotation.z += controls.current.roll * delta * 2;
    groupRef.current.rotation.x += controls.current.pitch * delta * 2;
    groupRef.current.rotation.y += controls.current.yaw * delta * 2;
    groupRef.current.translateZ(-speed.current);
  });

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.8, 4, 8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[7, 0.1, 1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0, 0.8, -1.5]}>
        <boxGeometry args={[0.1, 1, 0.8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh ref={propRef} position={[0, 0, 2.1]}>
        <boxGeometry args={[2, 0.2, 0.1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
});

export default Airplane;