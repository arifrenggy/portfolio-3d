import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PROFILE } from '../data/profile.js';

/* ================= SCENE 3D =================
   Wireframe planet + asteroid ring + starfield + grid floor.
   Kamera bergeser mengikuti scroll & parallax mouse. */

function Starfield() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(1400 * 3);
    for (let i = 0; i < 1400; i++) {
      const r = 40 + Math.random() * 60;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, []);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.008; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.14} color="#8b949e" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function Planet({ pos, scale = 1, color = '#3fb950', speed = 0.12 }) {
  const grp = useRef();
  const inner = useRef();
  useFrame((state, d) => {
    const t = state.clock.elapsedTime;
    if (grp.current) {
      grp.current.rotation.y += d * speed;
      grp.current.position.y = pos[1] + Math.sin(t * 0.4) * 0.35;
    }
    if (inner.current) inner.current.rotation.y -= d * speed * 0.6;
  });
  return (
    <group position={pos} scale={scale}>
      <mesh ref={grp}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.25, 0]} />
        <meshBasicMaterial color="#0d1117" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Shard({ i }) {
  const ref = useRef();
  const cfg = useMemo(() => ({
    r: 6 + Math.random() * 10,
    y: (Math.random() - 0.5) * 9,
    s: 0.08 + Math.random() * 0.25,
    sp: 0.05 + Math.random() * 0.25,
    ph: Math.random() * Math.PI * 2,
  }), [i]);
  useFrame((state) => {
    const t = state.clock.elapsedTime * cfg.sp + cfg.ph;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * cfg.r, cfg.y + Math.sin(t * 0.7) * 0.8, Math.sin(t) * cfg.r);
      ref.current.rotation.x = t; ref.current.rotation.z = t * 0.7;
    }
  });
  return (
    <mesh ref={ref} scale={cfg.s}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#3fb950" wireframe transparent opacity={0.45} />
    </mesh>
  );
}

function GridFloor() {
  const ref = useRef();
  useFrame((_, d) => { if (ref.current) ref.current.position.z = (ref.current.position.z + d * 0.6) % 4; });
  return (
    <group ref={ref} position={[0, -7, -6]} rotation={[Math.PI / 2.4, 0, 0]}>
      <gridHelper args={[60, 60, '#238636', '#0d1117']} />
    </group>
  );
}

function CameraRig() {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', h);
    return () => window.removeEventListener('pointermove', h);
  }, []);
  useFrame((state, d) => {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const p = max > 0 ? window.scrollY / max : 0;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, mouse.current.x * 1.6 + p * 3, 2, d);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, -mouse.current.y * 1.2 - p * 2, 2, d);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 14 - p * 4, 2, d);
    state.camera.lookAt(0, -p * 1.5, 0);
  });
  return null;
}

export default function Scene() {
  return (
    <div id="gl" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 14], fov: 55 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#0a0c10']} />
        <fog attach="fog" args={['#0a0c10', 18, 55]} />
        <ambientLight intensity={0.4} />
        <Starfield />
        <Planet pos={[4.6, 0.6, -4]} scale={1.15} />
        <Planet pos={[-5.4, 2.4, -9]} scale={0.6} color="#c2410c" speed={0.2} />
        <Planet pos={[-3.2, -3.4, -14]} scale={0.4} color="#58a6ff" speed={0.28} />
        {Array.from({ length: 26 }, (_, i) => <Shard key={i} i={i} />)}
        <GridFloor />
        <CameraRig />
      </Canvas>
    </div>
  );
}
