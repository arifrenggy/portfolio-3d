// == KONFIGURASI KONTEN — edit bagian ini saja ==
export const PROFILE = {
  handle: 'arifrenggy',
  name: 'Kurniawan Arif Renggi',
  role: 'Full-Stack Developer & Mahasiswa Teknik Informatika',
  location: 'Waingapu, Sumba Timur — WITA',
  github: 'https://github.com/arifrenggy',
  tagline: 'Membangun sistem yang membantu orang — dari monitoring bencana hingga website klien.',
  email: '', // isi email kamu di sini
  skills: [
    { group: 'Frontend', items: ['HTML/CSS', 'JavaScript', 'React + Vite', 'Tailwind', 'Three.js'] },
    { group: 'Backend', items: ['PHP', 'Laravel', 'Filament', 'Node.js', 'MySQL', 'SQLite'] },
    { group: 'Lainnya', items: ['Flutter', 'Python', 'Unity (C#)', 'Git', 'Leaflet/Maps'] },
  ],
  projects: [
    {
      id: 'GEOSIAGA',
      title: 'GeoSiaga',
      kind: 'Sistem Informasi — Web App',
      desc: 'Pemantauan lingkungan & bencana real-time: peta interaktif, skor Eco-Health, peringatan dini, data BMKG/MAGMA/NASA FIRMS. Proyek RPL untuk kesiapsiagaan Sumba Timur.',
      stack: ['React', 'Vite', 'Leaflet', 'Recharts', 'PWA'],
      accent: '#c2410c',
    },
    {
      id: 'ONCALL',
      title: 'Oncall Home Service',
      kind: 'Website Klien — Spa Bali',
      desc: 'Website komersial untuk klien spa di Bali: CMS, admin panel, backup otomatis, hardening keamanan. Dibangun dan dikelola atas kepercayaan langsung pemilik.',
      stack: ['PHP', 'MySQL', 'Docker', 'Railway'],
      accent: '#e8965a',
    },
    {
      id: 'PORTFOLIO',
      title: 'Portfolio CMS',
      kind: 'Laravel + Filament',
      desc: 'CMS portofolio self-hosted dengan admin panel drag-reorder, tema terminal GitHub-dark, dan versi motion-rich GSAP + Lenis.',
      stack: ['Laravel 12', 'Filament v5', 'GSAP', 'Lenis'],
      accent: '#3fb950',
    },
    {
      id: 'PETUALANGAN',
      title: 'Petualangan Huruf & Abjad',
      kind: 'Game Edukasi — Unity',
      desc: 'Game edukasi anak SD untuk belajar huruf dan abjad, dibuat dengan Unity sebagai media pembelajaran interaktif.',
      stack: ['Unity', 'C#'],
      accent: '#58a6ff',
    },
  ],
};
