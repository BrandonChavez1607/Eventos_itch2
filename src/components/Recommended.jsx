import { useState, useEffect, useMemo } from 'react';
import { CATS, isPast } from '../data';
import { useAuth } from '../context/AuthContext';
import EventCard from './EventCard';

export default function Recommended({ onOpen }) {
  const { user, regs, events } = useAuth();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const cats = useMemo(() => [...new Set(events.filter((e) => regs.includes(e.slug)).map((e) => e.category))], [events, regs]);
  const list = useMemo(() => events.filter((e) => !isPast(e) && cats.includes(e.category)), [events, cats]);

  useEffect(() => { setI(0); }, [list.length]);
  useEffect(() => {
    if (paused || list.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % list.length), 3500);
    return () => clearInterval(t);
  }, [paused, list.length]);

  if (!user) return null;
  const show = list.length >= 3 ? [0, 1, 2].map((k) => list[(i + k) % list.length]) : list;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">Eventos que te pueden interesar</h2>
          <p className="mt-3 text-ink/60">
            {cats.length ? 'Según tus registros: ' + cats.map((c) => CATS[c].plural).join(', ') + '.' : 'Regístrate a un evento y aquí aparecerán sugerencias parecidas.'}
          </p>
        </div>
        {list.length > 1 && (
          <div className="flex gap-2">
            <button onClick={() => setI((i - 1 + list.length) % list.length)} aria-label="Anterior" className="btn border border-line bg-card">←</button>
            <button onClick={() => setI((i + 1) % list.length)} aria-label="Siguiente" className="btn border border-line bg-card">→</button>
          </div>
        )}
      </div>
      {list.length > 0 && (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {show.map((ev, k) => (
              <div key={ev.slug + '-' + i} style={{ animation: 'fadein .5s' }} className={k === 0 ? '' : k === 1 ? 'hidden sm:block' : 'hidden md:block'}>
                <EventCard ev={ev} onOpen={onOpen} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {list.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={'Ir al evento ' + (k + 1)} className={'h-2 rounded-full transition-all ' + (k === i ? 'w-6 bg-primary' : 'w-2 bg-line')} />)}
          </div>
        </>
      )}
      {cats.length > 0 && !list.length && <p className="mt-8 text-sm text-ink/50">Por ahora no hay más eventos próximos en tus categorías.</p>}
    </section>
  );
}