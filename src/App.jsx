import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Loader from './components/Loader.jsx';
import { Cursor, Hud } from './components/Ui.jsx';
import { Panels } from './components/ZonePanels.jsx';
import { input, tapAt, ZONES } from './three/input.js';
import {
  Sky, Planet, Shard, GridFloor, Core, Paths, Station,
  ProjectObject, Beacon, CameraRig, Bridge, LabelProjector,
} from './three/World.jsx';
import { PROFILE } from './data/profile.js';

/* Overlay input: drag = lihat sekeliling, tap = inspeksi objek 3D. */
function useGestures() {
  const el = useRef(null);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    let down = false, moved = false, sx = 0, sy = 0, lx = 0, ly = 0, t0 = 0;
    const start = (e) => {
      const p = e.touches ? e.touches[0] : e;
      down = true; moved = false;
      sx = lx = p.clientX; sy = ly = p.clientY; t0 = performance.now();
    };
    const move = (e) => {
      if (!down) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - lx, dy = p.clientY - ly;
      lx = p.clientX; ly = p.clientY;
      if (Math.abs(p.clientX - sx) + Math.abs(p.clientY - sy) > 8) moved = true;
      input.yaw = THREE.MathUtils.clamp(input.yaw + dx * 0.0042, -1.15, 1.15);
      input.pitch = THREE.MathUtils.clamp(input.pitch - dy * 0.0032, -0.55, 0.6);
      e.preventDefault();
    };
    const end = (e) => {
      if (!down) return;
      down = false;
      if (!moved && performance.now() - t0 < 400) {
        tapAt((e.changedTouches ? e.changedTouches[0].clientX : e.clientX) / window.innerWidth * 2 - 1,
              -((e.changedTouches ? e.changedTouches[0].clientY : e.clientY) / window.innerHeight * 2 - 1));
      }
    };
    node.addEventListener('pointerdown', start);
    node.addEventListener('pointermove', move, { passive: false });
    node.addEventListener('pointerup', end);
    node.addEventListener('pointercancel', end);
    return () => {
      node.removeEventListener('pointerdown', start);
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerup', end);
      node.removeEventListener('pointercancel', end);
    };
  }, []);
  return el;
}

const NAV = Object.values(ZONES).map((z) => [z.id, z.label]);

export default function App() {
  const [booted, setBooted] = useState(false);
  const [zone, setZoneState] = useState('beranda');
  const [arrived, setArrived] = useState(null);
  const [project, setProject] = useState(null);
  const [hint, setHint] = useState(false);
  const gestureRef = useGestures();
  const labelRefs = useRef({});

  const setZone = useCallback((z) => {
    setZoneState((prev) => {
      if (prev !== z) { input.yaw = 0; input.pitch = 0; setProject(null); setArrived(null); }
      return z;
    });
  }, []);

  useEffect(() => {
    if (!booted) return;
    setHint(true);
    const t = setTimeout(() => setHint(false), 6000);
    return () => clearTimeout(t);
  }, [booted]);

  const projectObjs = PROFILE.projects.map((p, i) => ({
    ...p,
    phase: i * 1.4,
    pos: [[-5.5, 1.9, -20.5], [-1.8, 2.6, -21.5], [1.8, 2.6, -21.5], [5.5, 1.9, -20.5]][i],
  }));

  return (
    <>
      {!booted && <Loader onDone={() => setBooted(true)} />}
      <div id="gl" aria-hidden="true">
        <Canvas camera={{ position: ZONES.beranda.pos, fov: 55 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={['#0a0c10']} />
          <fog attach="fog" args={['#0a0c10', 22, 70]} />
          <Sky />
          <Planet pos={[10, 7, -18]} scale={1.1} />
          <Planet pos={[-12, 9, -26]} scale={0.6} color="#c2410c" speed={0.2} />
          <Planet pos={[-9, -6, -30]} scale={0.5} color="#58a6ff" speed={0.28} />
          {Array.from({ length: 22 }, (_, i) => <Shard key={i} i={i} />)}
          <GridFloor />
          <Core />
          <Paths />
          {Object.keys(ZONES).map((id) => (
            <Station key={id} zone={id} active={arrived === id} onFly={() => setZone(id)} />
          ))}
          {projectObjs.map((p) => (
            <ProjectObject key={p.id} project={p} onInspect={setProject} />
          ))}
          <Beacon />
          <CameraRig zone={zone} onArrive={setArrived} />
          <Bridge />
          {booted && <Panels arrived={arrived} project={project} setProject={setProject} setZone={setZone} />}
        </Canvas>
      </div>
      <div className="gesture" ref={gestureRef} style={{ opacity: booted ? 1 : 0 }} />
      <div className="crt" />
      <div className="vignette" />
      <Cursor />
      <Hud />
      <div className="labels">
        {Object.values(ZONES).map((z) => (
          <button
            key={z.id}
            ref={(el) => { labelRefs.current[z.id] = el; }}
            className={'zone-label' + (arrived === z.id ? ' here' : '')}
            style={{ '--zc': z.color }}
            onClick={() => setZone(z.id)}
          >
            [{z.label}]
          </button>
        ))}
      </div>
      <nav className="nav">
        {NAV.map(([id, label]) => (
          <button key={id} className={zone === id ? 'active' : ''} onClick={() => setZone(id)}>{label}</button>
        ))}
      </nav>
      {hint && <div className="hint">GESER: lihat sekeliling · TAP: interaksi · NAV: pindah stasiun</div>}
    </>
  );
}
