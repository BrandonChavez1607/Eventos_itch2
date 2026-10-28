
export default function Footer(){
  return (
  <footer className="bg-primary text-paper"><div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm text-paper/75 sm:px-6 md:grid-cols-3">
    <div><p className="font-bold text-paper">Instituto Tecnológico de Chihuahua II</p><p className="mt-3 max-w-xs">Portal de difusión de eventos deportivos, académicos y culturales.</p></div>
    <div><p className="font-semibold uppercase tracking-wide text-paper">Enlaces</p><ul className="mt-3 space-y-2"><li><a href="#inicio">Inicio</a></li><li><a href="#categorias">Categorías</a></li><li><a href="#agenda">Agenda</a></li></ul></div>
    <div><p className="font-semibold uppercase tracking-wide text-paper">Contacto</p><ul className="mt-3 space-y-2"><li>Av. de las Industrias 11101, Chihuahua, Chih.</li><li>difusion@chihuahua2.tecnm.mx</li><li>(614) 442 0000</li></ul></div>
  </div>
  <p className="border-t border-white/10 py-5 text-center text-xs text-paper/60">© {new Date().getFullYear()} ITCH II · Tecnológico Nacional de México</p></footer>);
}
