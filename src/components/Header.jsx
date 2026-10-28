import { useState } from 'react';
import { CATS } from '../data';
import { useAuth } from '../context/AuthContext';

export default function Header({ onCategory, onMyRegs, onProfile }) {
  const { user, logout, setAuthMode, regs } = useAuth();
  const [menu, setMenu] = useState(false);
  const [mob, setMob] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-paper">II</span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-primary">Instituto Tecnológico</span>
            <span className="block text-xs text-ink/60">de Chihuahua II</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          <a href="#categorias" className="rounded-md px-3 py-2 text-sm font-medium text-ink/70 hover:text-primary">Categorías</a>
          {Object.entries(CATS).map(([id, c]) => (
            <button key={id} onClick={() => onCategory(id)} className="rounded-md px-3 py-2 text-sm font-medium text-ink/70 hover:text-primary">{c.plural}</button>
          ))}
          <a href="#agenda" className="btn ml-2 bg-accent text-paper hover:opacity-90">Ver agenda</a>
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <button onClick={() => setAuthMode('login')} className="btn border border-line bg-card hover:border-primary">Iniciar sesión</button>
          ) : (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full border border-line bg-card py-1 pl-1 pr-3 text-sm font-medium">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-paper">{user.name[0].toUpperCase()}</span>
                <span className="hidden max-w-[7rem] truncate sm:block">{user.name.split(' ')[0]}</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-line bg-card p-1 shadow-lg">
                  <p className="truncate px-3 py-2 text-xs text-ink/50">@{user.username} · {user.email}</p>
                  <button onClick={() => { onProfile(); setMenu(false); }} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-paper">Mi perfil y amigos</button>
                  <button onClick={() => { onMyRegs(); setMenu(false); }} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-paper">Mis registros ({regs.length})</button>
                  <button onClick={() => { logout(); setMenu(false); }} className="w-full rounded-md px-3 py-2 text-left text-sm text-accent hover:bg-paper">Cerrar sesión</button>
                </div>
              )}
            </div>
          )}
          <button onClick={() => setMob(!mob)} aria-label="Menú" className="rounded-md border border-line p-2 lg:hidden">☰</button>
        </div>
      </div>

      {mob && (
        <nav className="flex flex-col gap-1 border-t border-line px-4 py-3 lg:hidden">
          <a onClick={() => setMob(false)} href="#categorias" className="rounded-md px-3 py-2 text-sm">Categorías</a>
          {Object.entries(CATS).map(([id, c]) => (
            <button key={id} onClick={() => { onCategory(id); setMob(false); }} className="rounded-md px-3 py-2 text-left text-sm">{c.plural}</button>
          ))}
          <a onClick={() => setMob(false)} href="#agenda" className="btn bg-accent text-center text-paper">Ver agenda</a>
        </nav>
      )}
    </header>
  );
}