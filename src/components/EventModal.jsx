import { CATS, longDate, isPast } from '../data';
import { useAuth } from '../context/AuthContext';

export default function EventModal({ ev, onClose }) {
  const { regs, user, toggleReg, taken } = useAuth();
  const reg = regs.includes(ev.slug);
  const past = isPast(ev);
  const used = taken(ev.slug);
  const full = used >= ev.capacity;
  const blocked = !reg && (past || full);
  const pct = Math.min(100, Math.round((used / ev.capacity) * 100));
  const rows = [
    ['Fecha', longDate(ev.date)],
    ['Horario', ev.time + ' – ' + ev.end + ' hrs'],
    ['Lugar', ev.location],
    ['Organiza', ev.organizer],
  ];
  const label = reg ? 'Cancelar mi registro' : past ? 'Evento finalizado' : full ? 'Sin cupo disponible' : user ? 'Registrarme al evento' : 'Inicia sesión para registrarte';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-card shadow-xl sm:rounded-2xl">
        <div className={'relative h-48 overflow-hidden g-' + ev.category}>
          <img src={ev.image} alt={ev.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 h-full w-full object-cover" />
          <button onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black">✕</button>
        </div>
        <div className="p-6">
          <span className={'rounded-full bg-paper px-3 py-1 text-xs font-semibold ' + CATS[ev.category].chip}>{CATS[ev.category].label}</span>
          <h3 className="mt-3 text-2xl font-bold">{ev.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">{ev.description}</p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            {rows.map((r) => (
              <div key={r[0]}><dt className="text-xs font-semibold uppercase text-ink/40">{r[0]}</dt><dd className="mt-1">{r[1]}</dd></div>
            ))}
          </dl>
          <div className="mt-5">
            <div className="flex justify-between text-xs font-semibold uppercase text-ink/40"><span>Cupo</span><span>{used} / {ev.capacity}</span></div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line"><div className={'h-full rounded-full ' + (pct >= 90 ? 'bg-accent' : 'bg-sport')} style={{ width: pct + '%' }} /></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {ev.tags.map((t) => <span key={t} className="rounded-full bg-paper px-3 py-1 text-xs text-ink/60">#{t}</span>)}
          </div>
          <button onClick={() => toggleReg(ev.slug)} disabled={blocked} className={'btn mt-8 w-full disabled:opacity-50 ' + (reg ? 'border border-accent text-accent' : 'bg-accent text-paper hover:opacity-90')}>{label}</button>
        </div>
      </div>
    </div>
  );
}