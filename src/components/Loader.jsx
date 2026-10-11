import { useEffect, useRef, useState } from 'react';

/* Boot loader ala game: log compile + progress bar, lalu fade out. */
const LINES = [
  ['[ok] memuat modul: three.core', 180],
  ['[ok] menghubungkan render pipeline :: webgl2', 320],
  ['[ok] kamera sinematik .... ON', 260],
  ['[ok] starfield 1400 partikel', 220],
  ['[ok] planet wireframe :: 3 unit', 300],
  ['[ok] grid navigasi ...... OK', 200],
  ['[..] bootstrap PORTFOLIO.exe', 520],
  ['[ok] selamat datang, pengunjung.', 420],
];

export default function Loader({ onDone }) {
  const [log, setLog] = useState([]);
  const [pct, setPct] = useState(0);
  const [out, setOut] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (done.current) return;
      if (i < LINES.length) {
        const [line, ms] = LINES[i];
        setLog((l) => [...l, line]);
        setPct(Math.round(((i + 1) / LINES.length) * 100));
        i++;
        setTimeout(tick, ms);
      } else {
        setTimeout(() => { setOut(true); setTimeout(onDone, 650); }, 350);
        done.current = true;
      }
    };
    const t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="boot" style={{
      opacity: out ? 0 : 1,
      transition: 'opacity 0.6s ease',
      pointerEvents: out ? 'none' : 'auto',
    }}>
      <div className="inner">
        <div className="title">ARIF RENGGY — PORTFOLIO.exe</div>
        <div className="bar"><i style={{ width: pct + '%' }} /></div>
        <div className="row"><span>BOOT SEQUENCE</span><b>{pct}%</b></div>
        <div className="log">
          {log.map((l, i) => (
            <div key={i} className={l.startsWith('[ok]') ? 'ok' : ''}>{l}</div>
          ))}
          <span className="ok">▊</span>
        </div>
      </div>
    </div>
  );
}
