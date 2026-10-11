import { Html } from '@react-three/drei';
import { ZONES } from '../three/input.js';
import { PROFILE } from '../data/profile.js';

/* Panel konten yang muncul di stasiun yang sudah didatangi (dalam ruang 3D). */
function Panel({ zone, children, wide }) {
  const z = ZONES[zone];
  return (
    <Html
      position={z.panel}
      center
      distanceFactor={9}
      zIndexRange={[30, 20]}
    >
      <div className={'zone-panel' + (wide ? ' wide' : '')}>{children}</div>
    </Html>
  );
}

export function Panels({ arrived, project, setProject, setZone }) {
  if (!arrived) return null;

  if (arrived === 'beranda') {
    return (
      <Panel zone="beranda" wide>
        <div className="kicker">system online · portfolio v3 · ruang 3d</div>
        <h1 className="panel-title">ARIF <span className="hl-green">RENGGY</span><span className="hl-terra">.exe</span></h1>
        <p className="panel-role">{PROFILE.role}</p>
        <p className="panel-lede">{PROFILE.tagline}</p>
        <div className="panel-btns">
          <button className="btn" onClick={() => setZone('proyek')}>TERBANG KE PROYEK →</button>
          <button className="btn ghost" onClick={() => setZone('tentang')}>TENTANG</button>
        </div>
        <div className="panel-hint">GESER layar untuk melihat sekeliling · TAP nav untuk pindah stasiun</div>
      </Panel>
    );
  }

  if (arrived === 'tentang') {
    return (
      <Panel zone="tentang">
        <div className="kicker">tentang</div>
        <div className="term-card">
          <div className="term-head"><i /><i /><i /><span style={{ marginLeft: 8 }}>arifrenggy@sumba-timur: ~</span></div>
          <div className="term-body">
            <div><span className="p">➜ whoami</span></div>
            <div><span className="v">{PROFILE.name}</span></div>
            <div style={{ marginTop: 8 }}><span className="p">➜ cat tentang.txt</span></div>
            <div><span className="d">Mahasiswa Teknik Informatika UKWMS Waingapu</span></div>
            <div><span className="d">Lokasi: {PROFILE.location}</span></div>
          </div>
        </div>
        <p className="panel-lede" style={{ marginTop: 12 }}>
          Membangun sistem nyata untuk masyarakat sekitarnya — monitoring bencana real-time
          untuk Sumba Timur, website komersial untuk klien spa di Bali, hingga game edukasi anak SD.
        </p>
        <div className="panel-btns">
          <button className="btn ghost" onClick={() => setZone('keahlian')}>KEAHLIAN →</button>
        </div>
      </Panel>
    );
  }

  if (arrived === 'keahlian') {
    return (
      <Panel zone="keahlian">
        <div className="kicker">arsenal / loadout</div>
        {PROFILE.skills.map((s) => (
          <div className="skill-card" key={s.group}>
            <h3>{s.group}</h3>
            <div className="chips">
              {s.items.map((it) => <span className="chip" key={it}>{it}</span>)}
            </div>
          </div>
        ))}
        <div className="panel-btns">
          <button className="btn" onClick={() => setZone('proyek')}>LANJUT KE PROYEK →</button>
        </div>
      </Panel>
    );
  }

  if (arrived === 'proyek') {
    const active = project ? PROFILE.projects.find((p) => p.id === project) : null;
    return (
      <Panel zone="proyek">
        {active ? (
          <>
            <div className="kicker" style={{ color: active.accent }}>quest file · {active.id}</div>
            <h3 className="proj-title" style={{ '--pa': active.accent }}>{active.title}</h3>
            <div className="proj-kind">{active.kind}</div>
            <p className="panel-lede">{active.desc}</p>
            <div className="chips" style={{ marginBottom: 14 }}>
              {active.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
            </div>
            <div className="panel-btns">
              <button className="btn ghost" onClick={() => setProject(null)}>← KEMBALI</button>
              {active.id === 'GEOSIAGA' && <a className="btn" href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB →</a>}
            </div>
          </>
        ) : (
          <>
            <div className="kicker">misi selesai · quest log</div>
            <p className="panel-lede">TAP objek melayang di depan untuk menginspeksi proyek.</p>
            {PROFILE.projects.map((p) => (
              <button className="proj-row" key={p.id} style={{ '--pa': p.accent }} onClick={() => setProject(p.id)}>
                <span className="id">[{p.id}]</span>
                <span className="t">{p.title}</span>
                <span className="k">{p.kind}</span>
              </button>
            ))}
          </>
        )}
      </Panel>
    );
  }

  if (arrived === 'kontak') {
    return (
      <Panel zone="kontak">
        <div className="kicker">misi berikutnya</div>
        <h3 className="proj-title">Ayo bangun sesuatu<br />yang berguna.</h3>
        <p className="panel-lede">Terbuka untuk proyek web, kolaborasi, dan tawaran kerja.</p>
        <div className="panel-btns">
          <a className="btn" href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB / ARIFRENGGY</a>
          {PROFILE.email && <a className="btn ghost" href={`mailto:${PROFILE.email}`}>EMAIL</a>}
        </div>
        <div className="panel-hint">© 2026 {PROFILE.name} — React Three Fiber</div>
      </Panel>
    );
  }
  return null;
}
