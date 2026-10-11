import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import { input, bindBridge, ZONES } from './input.js';

/* ============ STARFIELD ============ */
export function Sky() {
  return <Stars radius={90} depth={50} count={2200} factor={4.2} saturation={0} fade speed={0.6} />;
}

/* ============ PLANET ============ */
export function Planet({ pos, scale = 1, color = '#3fb950', speed = 0.12 }) {
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
        <meshBasicMaterial color={color} wireframe transparent opacity={0.45} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.25, 0]} />
        <meshBasicMaterial color="#0d1117" transparent opacity={0.92} />
      </mesh>
    </group>
  );
}

/* ============ SHARD MENGORBIT ============ */
export function Shard({ i }) {
  const ref = useRef();
  const cfg = useMemo(() => ({
    r: 10 + Math.random() * 14,
    y: (Math.random() - 0.3) * 10,
    s: 0.1 + Math.random() * 0.3,
    sp: 0.03 + Math.random() * 0.12,
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
      <meshBasicMaterial color="#3fb950" wireframe transparent opacity={0.4} />
    </mesh>
  );
}

/* ============ GRID FLOOR ============ */
export function GridFloor() {
  const ref = useRef();
  useFrame((_, d) => { if (ref.current) ref.current.position.z = (ref.current.position.z + d * 0.5) % 4; });
  return (
    <group ref={ref} position={[0, -0.02, -2]} rotation={[Math.PI / 2, 0, 0]}>
      <gridHelper args={[90, 90, '#1f6f33', '#10141c']} />
    </group>
  );
}

/* ============ INTI PLAZA ============ */
export function Core() {
  const r1 = useRef(); const r2 = useRef(); const core = useRef();
  useFrame((state, d) => {
    if (r1.current) r1.current.rotation.z += d * 0.18;
    if (r2.current) r2.current.rotation.z -= d * 0.26;
    if (core.current) {
      core.current.rotation.y += d * 0.1;
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
      core.current.scale.setScalar(s);
    }
  });
  return (
    <group position={[0, 3.2, 0]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshBasicMaterial color="#3fb950" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshBasicMaterial color="#0d1117" transparent opacity={0.95} />
      </mesh>
      <mesh ref={r1} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[3.4, 0.035, 8, 90]} />
        <meshBasicMaterial color="#238636" transparent opacity={0.75} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 1.9, 0.5, 0]}>
        <torusGeometry args={[4.3, 0.02, 8, 90]} />
        <meshBasicMaterial color="#c2410c" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ============ JALUR ENERGI ============ */
export function Paths() {
  return ZONES.desk ? null : (
    <group>
      {Object.values(ZONES).map((z) => (
        <Line
          key={z.id}
          points={[[0, 0.35, 0], [(z.station[0]) * 0.35, 0.9, (z.station[2]) * 0.35], z.station]}
          color="#238636"
          lineWidth={1}
          transparent
          opacity={0.35}
        />
      ))}
    </group>
  );
}

/* ============ STASIUN ============ */
const ICONS = {
  beranda: 'icosa', tentang: 'box', keahlian: 'octa', proyek: 'torus', kontak: 'cone',
};

function Icon({ kind, color }) {
  const ref = useRef();
  useFrame((state, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.5;
      ref.current.position.y = 3.4 + Math.sin(state.clock.elapsedTime * 0.9) * 0.25;
    }
  });
  return (
    <mesh ref={ref} position={[0, 3.4, 0]}>
      {kind === 'box' && <boxGeometry args={[1.1, 0.7, 0.25]} />}
      {kind === 'octa' && <octahedronGeometry args={[0.8, 0]} />}
      {kind === 'torus' && <torusGeometry args={[0.6, 0.22, 8, 40]} />}
      {kind === 'cone' && <coneGeometry args={[0.7, 1.3, 6]} />}
      {kind === 'icosa' && <icosahedronGeometry args={[0.8, 0]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.85} />
    </mesh>
  );
}

export function Station({ zone, active, onFly }) {
  const z = ZONES[zone];
  const ring = useRef();
  useFrame((state) => {
    if (ring.current) {
      const s = active ? 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05 : 1;
      ring.current.scale.setScalar(s);
    }
  });
  return (
    <group position={z.station}>
      {/* platform */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[3.3, 3.6, 0.45, 8]} />
        <meshBasicMaterial color="#0d1117" transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0.46, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[3.3, 3.3, 0.03, 8]} />
        <meshBasicMaterial color={z.color} wireframe transparent opacity={0.7} />
      </mesh>
      {/* cincin status */}
      <mesh ref={ring} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, active ? 0.06 : 0.02, 8, 60]} />
        <meshBasicMaterial color={z.color} transparent opacity={active ? 0.95 : 0.35} />
      </mesh>
      {/* pilar cahaya */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.05, 0.12, 4, 8, 1, true]} />
        <meshBasicMaterial color={z.color} transparent opacity={0.3} />
      </mesh>
      <Icon kind={ICONS[zone]} color={z.color} />
    </group>
  );
}

/* ============ OBJEK PROYEK (bisa di-tap) ============ */
export function ProjectObject({ project, onInspect }) {
  const ref = useRef();
  const glow = useRef();
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.userData.onTap = () => onInspect(project.id);
    input.interactives.push(mesh);
    return () => {
      const i = input.interactives.indexOf(mesh);
      if (i > -1) input.interactives.splice(i, 1);
    };
  }, [project.id, onInspect]);
  useFrame((state, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.7;
      ref.current.position.y = project.pos[1] + Math.sin(state.clock.elapsedTime * 1.1 + project.phase) * 0.3;
    }
    if (glow.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.2 + project.phase) * 0.12;
      glow.current.scale.setScalar(s);
    }
  });
  return (
    <group>
      {/* pedestal */}
      <mesh position={[project.pos[0], 0.35, project.pos[2]]}>
        <cylinderGeometry args={[0.55, 0.7, 0.7, 6]} />
        <meshBasicMaterial color="#0d1117" transparent opacity={0.9} />
      </mesh>
      <mesh ref={ref} position={project.pos}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshBasicMaterial color={project.accent} wireframe transparent opacity={0.9} />
      </mesh>
      <mesh ref={glow} position={project.pos}>
        <octahedronGeometry args={[1.05, 0]} />
        <meshBasicMaterial color={project.accent} wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

/* ============ BEACON KONTAK ============ */
export function Beacon() {
  const pulse = useRef();
  useFrame((state) => {
    if (pulse.current) {
      const t = state.clock.elapsedTime;
      pulse.current.scale.setScalar(1 + (t % 1.4) / 1.4 * 1.6);
      pulse.current.material.opacity = 0.5 * (1 - (t % 1.4) / 1.4);
    }
  });
  return (
    <group position={[0, 0, -30]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.08, 0.18, 6, 8, 1, true]} />
        <meshBasicMaterial color="#3fb950" transparent opacity={0.35} />
      </mesh>
      <mesh ref={pulse} position={[0, 6.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.05, 8, 40]} />
        <meshBasicMaterial color="#3fb950" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 6.2, 0]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color="#3fb950" wireframe transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

/* ============ CAMERA RIG: terbang antar stasiun ============ */
export function CameraRig({ zone, onArrive }) {
  const { camera } = useThree();
  const yawCur = useRef(0);
  const pitchCur = useRef(0);
  const arrivedRef = useRef(null);
  useFrame((_, d) => {
    const z = ZONES[zone];
    yawCur.current = THREE.MathUtils.damp(yawCur.current, input.yaw, 7, d);
    pitchCur.current = THREE.MathUtils.damp(pitchCur.current, input.pitch, 7, d);
    const t = performance.now() * 0.001;
    const bob = Math.sin(t * 0.55) * 0.1;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, z.pos[0], 1.7, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, z.pos[1] + bob, 1.7, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z.pos[2], 1.7, d);
    const dist = camera.position.distanceTo(new THREE.Vector3(...z.pos));
    camera.fov = THREE.MathUtils.damp(camera.fov, 55 + Math.min(13, dist * 0.45), 3, d);
    camera.updateProjectionMatrix();
    camera.lookAt(z.look[0], z.look[1], z.look[2]);
    camera.rotateY(yawCur.current);
    camera.rotateX(pitchCur.current);
    if (dist < 1.3 && arrivedRef.current !== zone) {
      arrivedRef.current = zone;
      onArrive(zone);
    }
  });
  useEffect(() => { arrivedRef.current = null; }, [zone]);
  return null;
}

/* ============ BRIDGE: camera + raycaster utk tap ============ */
export function Bridge() {
  const { camera } = useThree();
  useEffect(() => {
    bindBridge({ camera, raycaster: new THREE.Raycaster() });
  }, [camera]);
  return null;
}

/* ============ LABEL PROJECTOR: proyeksi label DOM dari posisi 3D ============ */
const _v = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _dir = new THREE.Vector3();

export function LabelProjector({ refs }) {
  const { camera, size } = useThree();
  useFrame(() => {
    camera.getWorldDirection(_fwd);
    for (const z of Object.values(ZONES)) {
      const btn = refs.current[z.id];
      if (!btn) continue;
      _v.set(z.station[0], 5.6, z.station[2]);
      _dir.copy(_v).sub(camera.position);
      const dist = _dir.length();
      if (_dir.normalize().dot(_fwd) < 0.2) { btn.style.display = 'none'; continue; }
      _v.project(camera);
      const x = (_v.x * 0.5 + 0.5) * size.width;
      const y = (-_v.y * 0.5 + 0.5) * size.height;
      const s = THREE.MathUtils.clamp(16 / dist, 0.55, 1.5);
      btn.style.display = 'block';
      btn.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${s.toFixed(2)})`;
      btn.style.zIndex = String(100 - Math.round(dist));
    }
  });
  return null;
}
