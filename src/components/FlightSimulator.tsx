import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import Airplane from './Airplane'

export default function FlightSimulator() {
  return (
    <div className="w-full h-screen bg-slate-900 relative">
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        {/* Sky & Sun position setup */}
        <Sky sunPosition={[100, 20, 100]} />
        
        {/* Ambient & Directional Scene Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 20, 15]} 
          intensity={1.5} 
          castShadow 
        />

        {/* Temporary Orbit Controls for inspecting the 3D scene */}
        <OrbitControls />

        {/* Render Airplane */}
        <Airplane />

        {/* World Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>

        {/* Visual Grid Helper at Origin (0,0,0) */}
        <gridHelper args={[100, 100, '#ffffff', '#444444']} position={[0, 0.01, 0]} />
      </Canvas>
    </div>
  );
}