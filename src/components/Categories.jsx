import { CATS } from '../data';

// Cambia aquí la extensión si tus fotos no son .jpg
const IMG = (id) => `/images/${id}.jpg`;

export default function Categories({ onCategory }) {
  return (
    <section id="categorias" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-3xl font-bold">Explora por categoría</h2>
      <p className="mb-10 mt-3 max-w-2xl text-ink/60">Elige una categoría para conocer sus próximos eventos.</p>
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(CATS).map(([id, c]) => (
          <button
            key={id}
            onClick={() => onCategory(id)}
            className="overflow-hidden rounded-xl border border-line bg-card text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className={'relative flex h-36 items-end overflow-hidden p-4 g-' + id}>
              <img
                src={IMG(id)}
                alt=""
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="relative text-xl font-bold text-white">{c.label}</span>
            </div>
            <div className="p-5">
              <p className="text-sm text-ink/60">{c.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary">Ver eventos →</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}