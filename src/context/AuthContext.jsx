import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { EMAIL_DOMAIN, toEvent } from '../data';

export const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const norm = (s) => s.trim().toLowerCase().replace(/^@/, '');

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regs, setRegs] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [toast, setToast] = useState('');
  const [authMode, setAuthMode] = useState(null);

  const loadEvents = useCallback(async () => {
    const { data, error } = await supabase.from('events_view').select('*').order('date').order('time');
    if (!error && data) setEvents(data.map(toEvent));
    setLoading(false);
  }, []);

  const loadFriends = useCallback(async () => {
    const { data } = await supabase.rpc('my_friends');
    setFriendList(data || []);
  }, []);

  // Eventos + sesión + actualización en vivo
  useEffect(() => {
    loadEvents();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => loadEvents())
      .subscribe();
    return () => { sub.subscription.unsubscribe(); supabase.removeChannel(channel); };
  }, [loadEvents]);

  // Datos del usuario al iniciar / cerrar sesión
  useEffect(() => {
    if (!session) { setUser(null); setRegs([]); setFriendList([]); return; }
    const u = session.user;
    (async () => {
      const [p, r] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', u.id).single(),
        supabase.from('registrations').select('event_id').eq('user_id', u.id),
      ]);
      if (p.data) setUser({ ...p.data, email: u.email });
      setRegs((r.data || []).map((x) => x.event_id));
      loadFriends();
    })();
  }, [session, loadFriends]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const taken = (id) => events.find((e) => e.slug === id)?.taken ?? 0;

  const submit = async (mode, f) => {
    const email = f.email.trim().toLowerCase();
    if (f.pass.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres.' };
    if (mode === 'register') {
      const username = norm(f.username);
      if (!email.endsWith(EMAIL_DOMAIN) || email.length <= EMAIL_DOMAIN.length) return { error: 'Usa tu correo institucional (' + EMAIL_DOMAIN + ').' };
      if (!/^[a-z0-9_.]{3,20}$/.test(username)) return { error: 'Usuario: de 3 a 20 caracteres (letras, números, _ o .).' };
      if (!f.name.trim()) return { error: 'Escribe tu nombre.' };
      const { data, error } = await supabase.auth.signUp({
        email,
        password: f.pass,
        options: { data: { name: f.name.trim(), username, control: f.control.trim() } },
      });
      if (error) return { error: error.message.includes('Database') ? 'Ese nombre de usuario ya está en uso.' : error.message };
      if (!data.session) return { info: 'Te enviamos un correo de confirmación. Ábrelo para activar tu cuenta y después inicia sesión.' };
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: f.pass });
      if (error) return { error: error.message.includes('not confirmed') ? 'Primero confirma tu correo (revisa tu bandeja).' : 'Correo o contraseña incorrectos.' };
    }
    setAuthMode(null);
    setToast('¡Bienvenido!');
    return {};
  };

  const logout = async () => { await supabase.auth.signOut(); setToast('Sesión cerrada'); };

  const updateProfile = async (patch) => {
    const { error } = await supabase.from('profiles').update(patch).eq('id', session.user.id);
    if (error) return setToast('No se pudo guardar');
    setUser({ ...user, ...patch });
    setToast('Perfil actualizado');
  };

  const toggleReg = async (id) => {
    if (!session) return setAuthMode('login');
    if (regs.includes(id)) {
      const { error } = await supabase.from('registrations').delete().eq('user_id', session.user.id).eq('event_id', id);
      if (error) return setToast('No se pudo cancelar');
      setRegs(regs.filter((x) => x !== id));
      setToast('Registro cancelado');
    } else {
      const { data, error } = await supabase.rpc('register_event', { eid: id });
      if (error) return setToast('No se pudo registrar');
      if (data) { setToast(data); loadEvents(); return; }
      setRegs([...regs, id]);
      setToast('Registro confirmado ✓');
    }
    loadEvents();
  };

  const addFriend = async (raw) => {
    const name = norm(raw);
    if (!name) return 'Escribe un usuario.';
    const { data, error } = await supabase.rpc('add_friend', { uname: name });
    if (error) return 'No se pudo agregar.';
    if (data) return data;
    await loadFriends();
    setToast('Amigo agregado');
    return '';
  };
  const removeFriend = async (name) => { await supabase.rpc('remove_friend', { uname: name }); loadFriends(); };
  const friends = friendList.map((f) => f.username);
  const friendInfo = (u) => friendList.find((f) => f.username === u) || { name: u, username: u, events: 0 };

  const value = {
    user, isAdmin: user?.role === 'admin', regs, friends, toast, authMode, setAuthMode,
    events, loading, loadEvents, say: setToast, taken,
    submit, logout, updateProfile, toggleReg, addFriend, removeFriend, friendInfo,
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}