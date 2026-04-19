import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Album3DProps {
  cover: string;
  title: string;
  position: [number, number, number];
  onClick: () => void;
}

export default function Album3D({ cover, title, position, onClick }: Album3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Use a CORS proxy for Spotify images with a reliable fallback
  // The WSVR.NL proxy handles CORS and we provide a picsum fallback in case of 404
  const proxiedCover = cover.includes('i.scdn.co') 
    ? `https://wsrv.nl/?url=${encodeURIComponent(cover)}&default=https://picsum.photos/seed/jeriq-album/800/800`
    : cover;

  const texture = useTexture(proxiedCover);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating and rotation
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      
      // Hover effect: tilt toward mouse
      if (hovered) {
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, (state.mouse.y * Math.PI) / 8, 0.1);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, (state.mouse.x * Math.PI) / 8, 0.1);
      } else {
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        {/* The Vinyl/Album Sleeve */}
        <boxGeometry args={[2, 2, 0.1]} />
        <meshStandardMaterial 
          map={texture} 
          metalness={0.2} 
          roughness={0.4}
          emissive={hovered ? new THREE.Color('#1a47b8') : new THREE.Color(0, 0, 0)}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
        
        {/* Glow behind album */}
        <pointLight 
          position={[0, 0, -0.5]} 
          intensity={hovered ? 5 : 0} 
          color="#1a47b8" 
          distance={3}
        />

        {/* Floating Label */}
        <Text
          position={[0, -1.3, 0]}
          fontSize={0.12}
          color="white"
          font="https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff"
          maxWidth={2}
          textAlign="center"
          anchorY="top"
        >
          {title.toUpperCase()}
        </Text>
      </mesh>
    </Float>
  );
}
