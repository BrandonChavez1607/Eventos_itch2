import { isPast } from '../data';
import { useAuth } from '../context/AuthContext';
import EventCard from './EventCard';

export default function Featured({ onOpen }) {
  const { events } = useAuth();
  const list = events.filter((e) => e.featured && !isPast(e));
  if (!list.length) return null;

  return (
    <section className="bg-card py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold">Eventos destacados</h2>
        <p className="mb-10 mt-3 text-ink/60">Los más relevantes del semestre.</p>
        <div className="grid gap-6 md:grid-cols-3">
          {list.map((ev) => <EventCard key={ev.slug} ev={ev} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  );
}