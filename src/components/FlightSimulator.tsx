import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import Airplane from './Airplane';

function CameraController({ targetRef }: { targetRef: React.RefObject<Group> }) {
  useFrame((state) => {
    if (!targetRef.current) return;

    const plane = targetRef.current;
    const relativeCameraOffset = new Vector3(0, 2.5, 8);
    const cameraPosition = relativeCameraOffset.applyMatrix4(plane.matrixWorld);

    // Dynamic camera position lerping
    state.camera.position.lerp(cameraPosition, 0.1);

    const lookAtTarget = plane.position.clone();
    state.camera.lookAt(lookAtTarget);

    // Apply minor camera roll to reflect aircraft banking angle
    state.camera.rotation.z = plane.rotation.z * 0.3;
  });

  return null;
}

export default function FlightSimulator() {
  const airplaneRef = useRef<Group>(null!);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-950 overflow-hidden font-sans select-none">
      {/* Flight Telemetry HUD Overlay */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-4 text-white shadow-2xl w-64">
          <div className="text-xs uppercase tracking-widest text-sky-400 font-bold mb-2">
            Flight Telemetry
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm font-mono">
            <span className="text-slate-400">STATUS:</span>
            <span className="text-emerald-400 font-bold">AIRBORNE</span>
            <span className="text-slate-400">PITCH / ROLL:</span>
            <span className="text-slate-200">WASD / Arrows</span>
            <span className="text-slate-400">RUDDER:</span>
            <span className="text-slate-200">Q / E Keys</span>
          </div>
        </div>
      </div>

      {/* 3D R3F Viewport */}
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Atmospheric Fog */}
        <fog attach="fog" args={['#a0c4ff', 50, 400]} />

        {/* Sky with Soft Rayleigh Scattering */}
        <Sky sunPosition={[100, 30, 100]} rayleigh={0.4} turbidity={8} />

        {/* Ambient & Directional Sun Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[100, 80, 50]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={500}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
        />

        <CameraController targetRef={airplaneRef} />
        <Airplane ref={airplaneRef} />

        {/* Endless Horizon Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[2000, 2000]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>

        {/* Central Runway Strip */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[12, 1000]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      </Canvas>
    </div>
  );
}