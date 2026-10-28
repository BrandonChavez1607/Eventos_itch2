import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EMAIL_DOMAIN } from '../data';

export default function AuthModal() {
  const { authMode: mode, setAuthMode, submit } = useAuth();
  const [f, setF] = useState({ name: '', username: '', email: '', pass: '', control: '' });
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { setErr(''); setInfo(''); }, [mode]);
  if (!mode) return null;

  const reg = mode === 'register';
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = async () => {
    setBusy(true); setErr(''); setInfo('');
    const r = await submit(mode, f);
    setErr(r.error || ''); setInfo(r.info || '');
    setBusy(false);
  };
  const key = (e) => e.key === 'Enter' && go();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={(e) => e.target === e.currentTarget && setAuthMode(null)}>
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h3 className="text-2xl font-bold">{reg ? 'Crear cuenta' : 'Iniciar sesión'}</h3>
          <button onClick={() => setAuthMode(null)} aria-label="Cerrar" className="text-ink/50">✕</button>
        </div>
        <p className="mt-1 text-sm text-ink/60">Accede para registrarte a los eventos del ITCH II.</p>
        <div className="mt-5 space-y-3">
          {reg && (
            <>
              <input value={f.name} onChange={set('name')} className="inp" placeholder="Nombre completo" autoComplete="name" />
              <input value={f.username} onChange={set('username')} className="inp" placeholder="Nombre de usuario (ej. juan.perez)" />
              <input value={f.control} onChange={set('control')} className="inp" placeholder="Número de control (opcional)" />
            </>
          )}
          <input value={f.email} onChange={set('email')} onKeyDown={key} type="email" className="inp" placeholder="Correo institucional" autoComplete="username" />
          {reg && <p className="-mt-1 text-xs text-ink/50">Debe terminar en {EMAIL_DOMAIN}</p>}
          <input value={f.pass} onChange={set('pass')} onKeyDown={key} type="password" className="inp" placeholder="Contraseña (mín. 6 caracteres)" autoComplete={reg ? 'new-password' : 'current-password'} />
          {err && <p className="rounded-md bg-accent/10 px-3 py-2 text-sm text-accent">{err}</p>}
          {info && <p className="rounded-md bg-sport/10 px-3 py-2 text-sm text-sport">{info}</p>}
          <button onClick={go} disabled={busy} className="btn w-full bg-primary text-paper hover:opacity-90 disabled:opacity-60">{busy ? 'Un momento...' : reg ? 'Crear cuenta' : 'Entrar'}</button>
        </div>
        <p className="mt-4 text-center text-sm text-ink/60">
          {reg ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
          <button onClick={() => setAuthMode(reg ? 'login' : 'register')} className="font-semibold text-primary">{reg ? 'Inicia sesión' : 'Regístrate'}</button>
        </p>
      </div>
    </div>
  );
}