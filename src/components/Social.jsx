import { LINKS } from '../data';

export default function Social() {
  return (
    <section className="bg-card py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold">Entra a las paginas principales</h2>
        <p className="text-ink/60">Entérate primero de los avisos y eventos oficiales.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={LINKS.tec} target="_blank" rel="noreferrer" className="btn bg-[#1877f2] text-white hover:opacity-90">Facebook del Tec2</a>
          <a href={LINKS.ambar} target="_blank" rel="noreferrer" className="btn bg-[#1877f2] text-white hover:opacity-90">Ámbar</a>
        </div>
      </div>
    </section>
  );
}