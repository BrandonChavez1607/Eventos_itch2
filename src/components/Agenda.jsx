import { useState, useMemo } from 'react';
import { CATS, isPast } from '../data';
import { useAuth } from '../context/AuthContext';
import EventCard from './EventCard';

const month = (iso) => new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date(iso + 'T00:00:00'));
const WHEN = [['proximos', 'Próximos'], ['finalizados', 'Finalizados'], ['todos', 'Todos']];

export default function Agenda({ filter, setFilter, onOpen }) {
  const { events, loading } = useAuth();
  const [q, setQ] = useState('');
  const [when, setWhen] = useState('proximos');

  const { groups, total } = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = events.filter((e) =>
      (filter === 'todos' || e.category === filter) &&
      (when === 'todos' || (when === 'proximos') !== isPast(e)) &&
      (!s || (e.title + ' ' + e.location + ' ' + e.tags.join(' ')).toLowerCase().includes(s))
    ).sort((a, b) => (when === 'finalizados' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
    const m = new Map();
    list.forEach((e) => { const k = month(e.date); m.set(k, [...(m.get(k) || []), e]); });
    return { groups: [...m.entries()], total: list.length };
  }, [events, filter, q, when]);

  const pill = (on) => 'rounded-full border px-4 py-2 text-sm font-medium ' + (on ? 'border-primary bg-primary text-paper' : 'border-line bg-card');

  return (
    <section id="agenda" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-3xl font-bold">Agenda de eventos</h2>
      <p className="mb-8 mt-3 text-ink/60">Consulta cupos disponibles y fechas. Los eventos pasados se marcan como finalizados.</p>
      <div className="mb-4 flex flex-wrap gap-2 rounded-xl bg-card p-1 sm:w-fit sm:border sm:border-line">
        {WHEN.map(([id, l]) => (
          <button key={id} onClick={() => setWhen(id)} className={'rounded-lg px-4 py-2 text-sm font-semibold ' + (when === id ? 'bg-primary text-paper' : 'text-ink/60')}>{l}</button>
        ))}
      </div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('todos')} className={pill(filter === 'todos')}>Todos</button>
          {Object.entries(CATS).map(([id, c]) => <button key={id} onClick={() => setFilter(id)} className={pill(filter === id)}>{c.plural}</button>)}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Buscar evento..." className="inp md:w-72" />
      </div>
      <p className="mb-6 text-sm text-ink/50">{loading ? 'Cargando eventos...' : total + (total === 1 ? ' evento encontrado' : ' eventos encontrados')}</p>
      {groups.map(([m, evs]) => (
        <div key={m} className="mb-10">
          <h3 className="mb-4 border-b border-line pb-2 text-lg font-bold capitalize text-primary">{m}</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {evs.map((ev) => <EventCard key={ev.slug} ev={ev} onOpen={onOpen} />)}
          </div>
        </div>
      ))}
      {!loading && !total && <p className="rounded-lg border border-dashed border-line py-16 text-center text-ink/50">No se encontraron eventos con esos criterios.</p>}
    </section>
  );
}