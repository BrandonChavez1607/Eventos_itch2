import { CATS, isPast, daysUntil } from '../data';
import { useAuth } from '../context/AuthContext';

export default function EventCard({ ev, onOpen }) {
  const { regs, taken } = useAuth();
  const c = CATS[ev.category];
  const past = isPast(ev);
  const used = taken(ev.slug);
  const left = ev.capacity - used;
  const pct = Math.min(100, Math.round((used / ev.capacity) * 100));
  const n = daysUntil(ev);
  const badge = past ? 'Finalizado' : left <= 0 ? 'Agotado' : n === 0 ? '¡Hoy!' : n === 1 ? 'Mañana' : n <= 7 ? 'En ' + n + ' días' : null;
  const d = new Date(ev.date + 'T00:00:00');
  const day = new Intl.DateTimeFormat('es-MX', { day: '2-digit' }).format(d);
  const mon = new Intl.DateTimeFormat('es-MX', { month: 'short' }).format(d).replace('.', '').toUpperCase();

  return (
    <article onClick={() => onOpen(ev)} className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-line bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className={'relative h-40 overflow-hidden g-' + ev.category + (past ? ' grayscale' : '')}>
        <img src={ev.image} alt={ev.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 h-full w-full object-cover" />
        <span className={'absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold ' + c.chip}>{c.label}</span>
        <div className="absolute right-3 top-3 flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-white text-center shadow">
          <span className="text-lg font-bold leading-none text-[#2a3f8f]">{day}</span>
          <span className="text-[10px] font-semibold text-slate-500">{mon}</span>
        </div>
        {regs.includes(ev.slug) && <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-sport">✓ Registrado</span>}
        {badge && <span className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white">{badge}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug">{ev.title}</h3>
        <p className="mt-2 flex-1 text-sm text-ink/60">{ev.summary}</p>
        <p className="mt-4 truncate text-xs text-ink/50">📍 {ev.location} · 🕒 {ev.time} hrs</p>
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div className={'h-full rounded-full ' + (pct >= 90 ? 'bg-accent' : 'bg-sport')} style={{ width: pct + '%' }} />
          </div>
          <p className="mt-1 text-xs text-ink/60">
            {past ? used + ' asistentes' : left <= 0 ? 'Sin cupo' : left <= Math.ceil(ev.capacity * 0.1) ? '¡Últimos ' + left + ' lugares!' : left + ' lugares disponibles'}
          </p>
        </div>
      </div>
    </article>
  );
}