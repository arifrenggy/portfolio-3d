/* Shared input store: drag-look + tap raycast antara overlay DOM dan scene. */
import * as THREE from 'three';

export const input = {
  yaw: 0,
  pitch: 0,
  interactives: [],
  bridge: null,
};

export function bindBridge(b) { input.bridge = b; }

export function tapAt(nx, ny) {
  const b = input.bridge;
  if (!b || !input.interactives.length) return;
  b.raycaster.setFromCamera(new THREE.Vector2(nx, ny), b.camera);
  const hits = b.raycaster.intersectObjects(input.interactives, false);
  if (hits.length && hits[0].object.userData.onTap) hits[0].object.userData.onTap(hits[0]);
}

/* Konfigurasi zona: stasiun di plaza, posisi kamera & titik pandang per zona. */
export const ZONES = {
  beranda:  { id: 'beranda',  label: 'BERANDA',  color: '#3fb950', station: [0, 0, 10],    pos: [0, 2.8, 17],    look: [0, 2.8, 2],    panel: [-4.2, 1.7, 10.2] },
  tentang:  { id: 'tentang',  label: 'TENTANG',  color: '#e8965a', station: [-18, 0, 0],   pos: [-11.4, 3.2, 0], look: [-18, 2.4, 0],   panel: [-17.8, 2.6, 0] },
  keahlian: { id: 'keahlian', label: 'KEAHLIAN', color: '#58a6ff', station: [18, 0, 0],    pos: [11.4, 3.2, 0],  look: [18, 2.4, 0],    panel: [17.8, 2.6, 0] },
  proyek:   { id: 'proyek',   label: 'PROYEK',   color: '#c2410c', station: [0, 0, -18],   pos: [0, 3.2, -11.4], look: [0, 2.4, -18],   panel: [6.4, 1.9, -16.6] },
  kontak:   { id: 'kontak',   label: 'KONTAK',   color: '#3fb950', station: [0, 0, -30],   pos: [0, 4.2, -22.6], look: [0, 3.4, -30],   panel: [0, 3.4, -29.6] },
};
