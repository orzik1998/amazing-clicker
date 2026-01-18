import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface HamsterSceneProps {
  isPressed: boolean;
}

// Helper component for a single whisker
const WhiskerLine = ({ rotation, position }: { rotation: [number, number, number], position: [number, number, number] }) => (
    <mesh position={position} rotation={rotation}>
        <cylinderGeometry args={[0.01, 0.002, 0.55, 8]} />
        <meshStandardMaterial color="#333" transparent opacity={0.6} />
    </mesh>
);

const HamsterModel = ({ isPressed }: { isPressed: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Physics / Animation State
  const currentScale = useRef(new THREE.Vector3(1, 1, 1));
  const targetScale = useRef(new THREE.Vector3(1, 1, 1));
  const rotationOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isPressed) {
        // SQUASH EFFECT: Flatten Y, expand X/Z
        targetScale.current.set(1.15, 0.85, 1.15);
        rotationOffset.current.x = 0.3; // Tilt forward
    } else {
        // BOUNCE BACK
        targetScale.current.set(1, 1, 1);
        rotationOffset.current.x = 0;
    }
  }, [isPressed]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // 1. Smooth Scale Animation (Spring-like lerp)
    currentScale.current.lerp(targetScale.current, 0.25);
    
    // Add subtle idle breathing when not pressed
    if (!isPressed) {
        const breath = Math.sin(state.clock.elapsedTime * 3) * 0.005;
        currentScale.current.y += breath;
    }
    
    groupRef.current.scale.copy(currentScale.current);

    // 2. Rotation Handling
    // Idle wobbling
    const idleRotY = Math.sin(state.clock.elapsedTime * 1) * 0.1;
    const idleRotZ = Math.cos(state.clock.elapsedTime * 0.8) * 0.05;

    // React to click (Tilt)
    const currentRotX = groupRef.current.rotation.x;
    const targetRotX = rotationOffset.current.x;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(currentRotX, targetRotX, 0.2);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, idleRotY, 0.1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, idleRotZ, 0.1);
  });

  // Colors
  const furColor = "#facc15"; // Yellow/Gold
  const bellyColor = "#fef9c3"; // Pale Yellow/White
  const earInnerColor = "#fca5a5"; // Pink
  const cheekColor = "#fda4af"; // Pink blush
  const accentColor = "#ea580c"; // Orange feet/hands

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      
      {/* --- BODY --- */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color={furColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* --- BELLY PATCH --- */}
      <mesh position={[0, -0.3, 1.25]} scale={[0.85, 0.75, 0.5]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color={bellyColor} roughness={0.6} />
      </mesh>

      {/* --- EARS --- */}
      {/* Left Ear */}
      <group position={[-0.9, 1.1, 0.4]} rotation={[0, 0, 0.6]}>
         <mesh>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color={furColor} />
         </mesh>
         <mesh position={[0, 0, 0.2]} scale={[0.6, 0.6, 0.4]}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color={earInnerColor} />
         </mesh>
      </group>
      
      {/* Right Ear */}
      <group position={[0.9, 1.1, 0.4]} rotation={[0, 0, -0.6]}>
         <mesh>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color={furColor} />
         </mesh>
         <mesh position={[0, 0, 0.2]} scale={[0.6, 0.6, 0.4]}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color={earInnerColor} />
         </mesh>
      </group>

      {/* --- EYES --- */}
      <group position={[0, 0.45, 1.38]}>
          {/* Left Eye */}
          <group position={[-0.5, 0, 0]}>
            <mesh>
                <sphereGeometry args={[0.18, 32, 32]} />
                <meshStandardMaterial color="#111" roughness={0.1} />
            </mesh>
            {/* Specular Highlight */}
            <mesh position={[0.08, 0.08, 0.14]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color="white" />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.5, 0, 0]}>
            <mesh>
                <sphereGeometry args={[0.18, 32, 32]} />
                <meshStandardMaterial color="#111" roughness={0.1} />
            </mesh>
            {/* Specular Highlight */}
            <mesh position={[0.08, 0.08, 0.14]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color="white" />
            </mesh>
          </group>
      </group>

      {/* --- FACE DETAILS --- */}
      {/* Cheeks */}
      <mesh position={[-0.8, 0.15, 1.25]} scale={[1, 0.7, 0.6]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={cheekColor} transparent opacity={0.5} roughness={1} />
      </mesh>
      <mesh position={[0.8, 0.15, 1.25]} scale={[1, 0.7, 0.6]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={cheekColor} transparent opacity={0.5} roughness={1} />
      </mesh>

      {/* Snout */}
      <mesh position={[0, 0.15, 1.48]} scale={[1, 0.8, 0.6]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#fca5a5" />
      </mesh>
      
      {/* Teeth */}
      <group position={[0, 0, 1.55]} rotation={[0.1, 0, 0]}>
         <mesh position={[-0.08, -0.08, 0]}>
             <boxGeometry args={[0.12, 0.18, 0.05]} />
             <meshStandardMaterial color="white" roughness={0.2} />
         </mesh>
         <mesh position={[0.08, -0.08, 0]}>
             <boxGeometry args={[0.12, 0.18, 0.05]} />
             <meshStandardMaterial color="white" roughness={0.2} />
         </mesh>
      </group>

      {/* Whiskers */}
      <group position={[-0.9, 0.15, 1.3]} rotation={[0, 0.5, -0.2]}>
          <WhiskerLine position={[0, 0.1, 0]} rotation={[0, 0, 1.4]} />
          <WhiskerLine position={[0, 0, 0]} rotation={[0, 0, 1.57]} />
          <WhiskerLine position={[0, -0.1, 0]} rotation={[0, 0, 1.7]} />
      </group>
      <group position={[0.9, 0.15, 1.3]} rotation={[0, -0.5, 0.2]}>
          <WhiskerLine position={[0, 0.1, 0]} rotation={[0, 0, -1.4]} />
          <WhiskerLine position={[0, 0, 0]} rotation={[0, 0, -1.57]} />
          <WhiskerLine position={[0, -0.1, 0]} rotation={[0, 0, -1.7]} />
      </group>


      {/* --- LIMBS --- */}
      {/* Arms */}
      <mesh position={[-1.2, -0.3, 0.8]} rotation={[0.5, 0.5, -0.5]}>
         <capsuleGeometry args={[0.22, 0.7, 4, 8]} />
         <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[1.2, -0.3, 0.8]} rotation={[0.5, -0.5, 0.5]}>
         <capsuleGeometry args={[0.22, 0.7, 4, 8]} />
         <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.6, -1.35, 0.9]} rotation={[0, 0.2, 0]}>
        <capsuleGeometry args={[0.25, 0.6, 4, 8]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[0.6, -1.35, 0.9]} rotation={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.25, 0.6, 4, 8]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      
    </group>
  );
};

export const HamsterScene: React.FC<HamsterSceneProps> = ({ isPressed }) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 6.5]} fov={45} />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
      <pointLight position={[-5, -5, 5]} intensity={0.5} color="#60a5fa" /> {/* Blue rim light */}
      
      <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <HamsterModel isPressed={isPressed} />
      </Float>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.35} scale={10} blur={2.5} far={4} color="#000000" />
      
      <Environment preset="city" />
    </Canvas>
  );
};