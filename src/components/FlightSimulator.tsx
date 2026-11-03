import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import Airplane from './Airplane'

// Camera Follow Component that tracks the airplane
function CameraController({ targetRef }: { targetRef: React.RefObject<Group> }) {
  useFrame((state) => {
    if (!targetRef.current) return;

    const plane = targetRef.current;
    
    // Calculate desired camera position behind and above the plane
    const relativeCameraOffset = new Vector3(0, 2, 7);
    const cameraPosition = relativeCameraOffset.applyMatrix4(plane.matrixWorld);

    // Smoothly interpolate (lerp) camera position for a fluid follow effect
    state.camera.position.lerp(cameraPosition, 0.1);

    // Look slightly ahead of the plane
    const lookAtTarget = plane.position.clone();
    state.camera.lookAt(lookAtTarget);
  });

  return null;
}

export default function FlightSimulator() {
  const airplaneRef = useRef<Group>(null!);

 return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-900 overflow-hidden">
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }} style={{ width: '100%', height: '100%' }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 15]} intensity={1.5} castShadow />

        {/* Dynamic 3rd Person Follow Camera (Replaces OrbitControls) */}
        <CameraController targetRef={airplaneRef} />

        {/* Render Airplane with Ref */}
        <Airplane ref={airplaneRef} />

        {/* World Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
        <gridHelper args={[100, 100, '#ffffff', '#444444']} position={[0, 0.01, 0]} />
      </Canvas>
    </div>
  );
}