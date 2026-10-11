import { useState } from 'react';
import Scene from './components/Scene.jsx';
import Loader from './components/Loader.jsx';
import { Cursor, Hud, Nav, Reveal, TerminalCard } from './components/Ui.jsx';
import { PROFILE } from './data/profile.js';

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {!booted && <Loader onDone={() => setBooted(true)} />}
      <Scene />
      <div className="crt" />
      <div className="vignette" />
      <Cursor />
      <Hud />
      <Nav />

      <main style={{ opacity: booted ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        {/* ============ BERANDA ============ */}
        <section id="beranda">
          <div className="wrap">
            <div className="kicker">system online · portfolio v3.0 · 3d</div>
            <h1 className="big">
              ARIF<br />
              <span style={{ color: 'var(--green)' }}>RENGGY</span>
              <span style={{ color: 'var(--terra)' }}>.exe</span>
            </h1>
            <p className="lede" style={{ margin: '26px 0 34px' }}>
              {PROFILE.tagline} Situs ini dibangun dengan React Three Fiber — jelajahi dengan scroll.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a className="btn" href="#proyek">LIHAT PROYEK →</a>
              <a className="btn ghost" href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB</a>
            </div>
            <div className="stat-row">
              <div className="stat"><b>4+</b><span>Proyek Utama</span></div>
              <div className="stat"><b>3D</b><span>Rendering</span></div>
              <div className="stat"><b>100%</b><span>Hand-coded</span></div>
            </div>
          </div>
        </section>

        {/* ============ TENTANG ============ */}
        <section id="tentang">
          <div className="wrap grid2" style={{ alignItems: 'center', gap: 34 }}>
            <Reveal>
              <div className="kicker">tentang</div>
              <h2>Developer dari ujung timur Indonesia.</h2>
              <p className="lede">
                Mahasiswa Teknik Informatika UKWMS Waingapu yang membangun sistem nyata untuk
                masyarakat sekitarnya — monitoring bencana real-time untuk Sumba Timur,
                website komersial untuk klien spa di Bali, hingga game edukasi anak SD.
                Terbiasa bekerja dengan data live, peta interaktif, dan jaringan yang lambat.
              </p>
              <div className="stat-row" style={{ marginTop: 22 }}>
                <div className="stat"><b>{PROFILE.location.split('—')[0].trim()}</b><span>Lokasi</span></div>
              </div>
            </Reveal>
            <Reveal delay={0.15}><TerminalCard /></Reveal>
          </div>
        </section>

        {/* ============ KEAHLIAN ============ */}
        <section id="keahlian">
          <div className="wrap">
            <Reveal>
              <div className="kicker">keahlian</div>
              <h2>Arsenal <span style={{ color: 'var(--green)' }}>/</span> loadout.</h2>
            </Reveal>
            <div className="grid2" style={{ marginTop: 26 }}>
              {PROFILE.skills.map((s, i) => (
                <Reveal key={s.group} delay={i * 0.1}>
                  <div className="skill-card">
                    <h3>{s.group}</h3>
                    <div className="chips">
                      {s.items.map((it) => <span className="chip" key={it}>{it}</span>)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PROYEK ============ */}
        <section id="proyek">
          <div className="wrap">
            <Reveal>
              <div className="kicker">misi selesai</div>
              <h2>Proyek pilihan <span style={{ color: 'var(--green)' }}>::</span> quest log.</h2>
            </Reveal>
            <div style={{ marginTop: 28 }}>
              {PROFILE.projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <div className="proj" style={{ '--pa': p.accent }}>
                    <div className="glow" />
                    <div className="id">[{p.id}] {p.kind}</div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <div className="chips">
                      {p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ KONTAK ============ */}
        <section id="kontak">
          <div className="wrap" style={{ textAlign: 'center' }}>
            <Reveal>
              <div className="kicker" style={{ textAlign: 'center' }}>misi berikutnya</div>
              <h2 style={{ fontSize: 'clamp(30px, 6vw, 64px)' }}>
                Ayo bangun sesuatu<br />yang berguna.
              </h2>
              <p className="lede" style={{ margin: '18px auto 34px' }}>
                Terbuka untuk proyek web, kolaborasi, dan tawaran kerja.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a className="btn" href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB / ARIFRENGGY</a>
                {PROFILE.email && <a className="btn ghost" href={`mailto:${PROFILE.email}`}>EMAIL</a>}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="foot">
        © 2026 {PROFILE.name} — dibangun dengan React Three Fiber · {''}
        <a href={PROFILE.github} target="_blank" rel="noreferrer">source</a>
      </footer>
    </>
  );
}
