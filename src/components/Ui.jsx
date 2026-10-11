import { useEffect, useRef, useState } from 'react';
import { PROFILE } from '../data/profile.js';

/* Kursor crosshair ala game — membesar saat di atas elemen interaktif. */
export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hot, setHot] = useState(false);
  useEffect(() => {
    const h = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target;
      setHot(!!(t.closest && t.closest('a, button, .proj, .skill-card')));
    };
    window.addEventListener('pointermove', h);
    return () => window.removeEventListener('pointermove', h);
  }, []);
  return (
    <div className={'cursor' + (hot ? ' hot' : '')} style={{ left: pos.x, top: pos.y }}>
      <div className="reticle" /><div className="dot" />
    </div>
  );
}

/* Bingkai HUD: sudut bidik, jam WITA, koordinat. */
export function Hud() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const f = () => {
      try {
        setTime(new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false,
        }).format(new Date()));
      } catch { setTime(new Date().toLocaleTimeString()); }
    };
    f();
    const t = setInterval(f, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hud">
      <div className="corner tl" /><div className="corner tr" />
      <div className="corner bl" /><div className="corner br" />
      <div className="clock">WITA {time}</div>
      <div className="coords">-10.19° S · 120.63° E · SUMBA TIMUR</div>
    </div>
  );
}

/* Navigasi bawah dengan indikator section aktif. */
const SECTIONS = [['beranda', 'BERANDA'], ['tentang', 'TENTANG'], ['keahlian', 'KEAHLIAN'], ['proyek', 'PROYEK'], ['kontak', 'KONTAK']];

export function Nav() {
  const [active, setActive] = useState('beranda');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return (
    <nav className="nav">
      {SECTIONS.map(([id, label]) => (
        <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
      ))}
    </nav>
  );
}

/* Reveal saat elemen masuk viewport. */
export function Reveal({ children, style }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setInView(true); o.disconnect(); } }),
      { threshold: 0.2 }
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} className={'reveal' + (inView ? ' in' : '')} style={style}>{children}</div>
  );
}

export function TerminalCard() {
  return (
    <div className="term-card">
      <div className="term-head"><i /><i /><i /><span style={{ marginLeft: 8 }}>arifrenggy@sumba-timur: ~/portfolio</span></div>
      <div className="term-body">
        <div><span className="p">➜ whoami</span></div>
        <div><span className="v">{PROFILE.name}</span> <span className="d">— {PROFILE.role}</span></div>
        <div style={{ marginTop: 8 }}><span className="p">➜ ls ~/skills</span></div>
        <div><span className="v">React/Vite · Laravel · Flutter · Unity · Three.js</span></div>
        <div style={{ marginTop: 8 }}><span className="p">➜ cat mission.txt</span></div>
        <div><span className="d">{PROFILE.tagline}</span></div>
        <div style={{ marginTop: 8 }}><span className="p">➜</span> <span className="d">█</span></div>
      </div>
    </div>
  );
}
