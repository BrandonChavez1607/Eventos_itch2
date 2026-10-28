import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile({ onClose }) {
  const { user, regs, friends, updateProfile, addFriend, removeFriend, friendInfo } = useAuth();
  const [f, setF] = useState({ name: user.name, control: user.control, bio: user.bio });
  const [fr, setFr] = useState('');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
const add = async () => { const e = await addFriend(fr); setErr(e); if (!e) setFr(''); };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-paper">{user.name[0].toUpperCase()}</span>
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-sm text-primary">@{user.username}</p>
              <p className="text-xs text-ink/50">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="text-ink/50">✕</button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-paper p-3"><p className="text-2xl font-bold text-primary">{regs.length}</p><p className="text-xs text-ink/60">Eventos registrados</p></div>
          <div className="rounded-lg bg-paper p-3"><p className="text-2xl font-bold text-primary">{friends.length}</p><p className="text-xs text-ink/60">Amigos</p></div>
        </div>

        <h4 className="mt-6 font-semibold">Editar perfil</h4>
        <div className="mt-3 space-y-3">
          <input value={f.name} onChange={set('name')} className="inp" placeholder="Nombre completo" />
          <input value={f.control} onChange={set('control')} className="inp" placeholder="Número de control" />
          <textarea value={f.bio} onChange={set('bio')} rows={2} maxLength={120} className="inp" placeholder="Carrera, semestre, gustos..." />
          <button onClick={() => f.name.trim() && updateProfile({ name: f.name.trim(), control: f.control.trim(), bio: f.bio.trim() })} className="btn w-full bg-primary text-paper hover:opacity-90">Guardar cambios</button>
        </div>

        <h4 className="mt-6 font-semibold">Amigos</h4>
        <div className="mt-3 flex gap-2">
          <input value={fr} onChange={(e) => setFr(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} className="inp" placeholder="@usuario" />
          <button onClick={add} className="btn bg-accent text-paper">Agregar</button>
        </div>
        {err && <p className="mt-2 text-sm text-accent">{err}</p>}
        <ul className="mt-3 space-y-2">
          {!friends.length && <li className="text-sm text-ink/50">Aún no tienes amigos agregados.</li>}
          {friends.map((u) => {
            const i = friendInfo(u);
            return (
              <li key={u} className="flex items-center justify-between rounded-lg border border-line p-3 text-sm">
                <span><b>{i.name}</b> <span className="text-ink/50">@{i.username}</span><br /><span className="text-xs text-ink/50">{i.events} eventos registrados</span></span>
                <button onClick={() => removeFriend(u)} className="text-xs font-semibold text-accent">Quitar</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}