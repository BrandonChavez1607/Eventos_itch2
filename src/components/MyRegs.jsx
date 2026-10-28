import { longDate } from '../data';
import { useAuth } from '../context/AuthContext';

export default function MyRegs({ onClose }) {
  const { events, regs, toggleReg } = useAuth();
  const mine = events.filter((e) => regs.includes(e.slug));

  return (
    <div className="fixed inset-0 z-[60] bg-black/50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Mis registros</h3>
          <button onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        {!mine.length && <p className="mt-8 text-sm text-ink/50">Aún no te has registrado a ningún evento.</p>}
        <ul className="mt-6 space-y-3">
          {mine.map((ev) => (
            <li key={ev.slug} className="rounded-lg border border-line p-4">
              <p className="font-semibold">{ev.title}</p>
              <p className="mt-1 text-xs text-ink/60">{longDate(ev.date)} · {ev.time} hrs</p>
              <p className="text-xs text-ink/60">{ev.location}</p>
              <button onClick={() => toggleReg(ev.slug)} className="mt-3 text-xs font-semibold text-accent">Cancelar registro</button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}