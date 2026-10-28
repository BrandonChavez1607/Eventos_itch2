import { STATS } from '../data';
import { useAuth } from '../context/AuthContext';

export default function Hero(){
  const {user,setAuthMode}=useAuth();
  return (<>
  <section id="inicio" className="relative overflow-hidden bg-gradient-to-br from-primary to-accent">
    <div className="absolute inset-0 bg-black/40"></div>
    <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <div className="max-w-2xl text-white">
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-white/25">Difusión de eventos institucionales</span>
        <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">Vive la comunidad del Tecnológico</h1>
        <p className="mt-5 max-w-xl text-lg text-white/85">Descubre y participa en los eventos deportivos, académicos y culturales del ITCH II. Inicia sesión para registrarte y llevar el control de tus eventos.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#agenda" className="btn bg-white text-primary hover:opacity-90">Explorar eventos</a>
          {!user&&(<button onClick={()=>setAuthMode('register')} className="btn border border-white/50 hover:bg-white/10">Crear cuenta</button>)}
        </div>
      </div>
    </div>
  </section>
  <section className="border-b border-line bg-card">
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 text-center sm:px-6 md:grid-cols-4">
      {STATS.map(s=>(<div key={s[1]}><p className="text-3xl font-bold text-primary">{s[0]}</p><p className="mt-1 text-sm text-ink/60">{s[1]}</p></div>))}
    </div>
  </section></>);
}
