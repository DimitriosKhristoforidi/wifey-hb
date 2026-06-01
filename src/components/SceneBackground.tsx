"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function HeartShape() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = 0;
    const y = 0;
    s.moveTo(x, y);
    s.bezierCurveTo(x, y, x - 0.5, y + 0.5, x - 1, y + 0.5);
    s.bezierCurveTo(x - 2.2, y + 0.5, x - 2.2, y - 1.0, x - 2.2, y - 1.0);
    s.bezierCurveTo(x - 2.2, y - 1.8, x - 1.4, y - 2.7, x, y - 3.6);
    s.bezierCurveTo(x + 1.4, y - 2.7, x + 2.2, y - 1.8, x + 2.2, y - 1.0);
    s.bezierCurveTo(x + 2.2, y - 1.0, x + 2.2, y + 0.5, x + 1, y + 0.5);
    s.bezierCurveTo(x + 0.5, y + 0.5, x, y, x, y);
    return s;
  }, []);

  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.4,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 1,
        bevelSize: 0.18,
        bevelThickness: 0.18,
      }),
    [shape],
  );

  return geometry;
}

type FloatingHeartProps = {
  position: [number, number, number];
  scale: number;
  color: string;
  rotationSpeed?: number;
};

function FloatingHeart({
  position,
  scale,
  color,
  rotationSpeed = 0.2,
}: FloatingHeartProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const geometry = HeartShape();

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * rotationSpeed;
    ref.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.08;
  });

  return (
    <Float
      speed={1.4}
      rotationIntensity={0.4}
      floatIntensity={0.8}
      floatingRange={[-0.3, 0.3]}
    >
      <mesh
        ref={ref}
        position={position}
        scale={scale}
        geometry={geometry}
        castShadow
        receiveShadow
        rotation={[Math.PI, 0, 0]}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.15}
          roughness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          sheen={0.6}
          sheenColor={color}
          emissive={color}
          emissiveIntensity={0.06}
        />
      </mesh>
    </Float>
  );
}

type BalloonProps = {
  position: [number, number, number];
  color: string;
  scale?: number;
};

function Balloon({ position, color, scale = 1 }: BalloonProps) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.4 + position[0]) * 0.2;
  });

  return (
    <Float
      speed={1.1}
      rotationIntensity={0.2}
      floatIntensity={1.4}
      floatingRange={[-0.4, 0.4]}
    >
      <group ref={ref} position={position} scale={scale}>
        <mesh castShadow>
          <sphereGeometry args={[0.85, 48, 48]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.1}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.05}
            ior={1.3}
          />
        </mesh>
        {/* knot */}
        <mesh position={[0, -0.9, 0]}>
          <coneGeometry args={[0.12, 0.2, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* string */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.6, 8]} />
          <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  const items = useMemo(() => {
    const palette = ["#a9c7ff", "#b18cff", "#ffd6ec", "#c9eaff", "#dcd1ff"];
    const hearts: FloatingHeartProps[] = [
      { position: [-4.5, 1.5, -2], scale: 0.45, color: palette[0] },
      { position: [4.2, 0.6, -3], scale: 0.55, color: palette[2] },
      { position: [-3.0, -1.8, -1], scale: 0.35, color: palette[1] },
      {
        position: [3.6, -2.2, -2.5],
        scale: 0.4,
        color: palette[3],
        rotationSpeed: -0.25,
      },
      {
        position: [0.5, 2.4, -4],
        scale: 0.5,
        color: palette[4],
        rotationSpeed: 0.15,
      },
      { position: [-1.5, -2.6, -1.5], scale: 0.3, color: palette[0] },
    ];
    const balloons: BalloonProps[] = [
      { position: [-5.5, 2.3, -4], color: "#a9c7ff", scale: 0.9 },
      { position: [5.2, 2.6, -4.5], color: "#b18cff", scale: 0.85 },
      { position: [-4.8, -2.6, -5], color: "#ffd6ec", scale: 0.7 },
      { position: [4.6, -2.4, -5.5], color: "#c9eaff", scale: 0.95 },
    ];
    return { hearts, balloons };
  }, []);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} castShadow />
      <directionalLight
        position={[-5, -3, 4]}
        intensity={0.35}
        color="#b18cff"
      />
      <Environment preset="dawn" />

      {items.hearts.map((h, i) => (
        <FloatingHeart key={`h-${i}`} {...h} />
      ))}
      {items.balloons.map((b, i) => (
        <Balloon key={`b-${i}`} {...b} />
      ))}

      <Sparkles
        count={80}
        scale={[14, 8, 6]}
        size={3}
        speed={0.35}
        opacity={0.9}
        color="#ffffff"
      />
    </>
  );
}

export default function SceneBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          // Recover gracefully from WebGL context loss (common in dev / HMR
          // and when switching tabs). Calling preventDefault() lets the
          // browser restore the context instead of leaving it dead.
          const canvas = gl.domElement;
          const handleLost = (e: Event) => {
            e.preventDefault();
            // Silence the noisy console warning in production too.
            // eslint-disable-next-line no-console
            console.warn("[scene] webgl context lost - will attempt restore");
          };
          const handleRestored = () => {
            // eslint-disable-next-line no-console
            console.info("[scene] webgl context restored");
          };
          canvas.addEventListener("webglcontextlost", handleLost, false);
          canvas.addEventListener(
            "webglcontextrestored",
            handleRestored,
            false,
          );
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
