import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CATS } from '../data';
import { useAuth } from '../context/AuthContext';

const EMPTY = { title: '', category: 'deportivo', summary: '', description: '', date: '', time: '09:00', end_time: '12:00', location: '', organizer: '', capacity: 100, tags: '', featured: false, image_url: '' };

export default function Admin({ onClose }) {
  const { events, loadEvents, say } = useAuth();
  const [f, setF] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const reset = () => { setEditing(null); setFile(null); setF(EMPTY); setErr(''); };
  const edit = (ev) => {
    setEditing(ev.slug); setFile(null); setErr('');
    setF({ title: ev.title, category: ev.category, summary: ev.summary, description: ev.description, date: ev.date, time: ev.time, end_time: ev.end, location: ev.location, organizer: ev.organizer, capacity: ev.capacity, tags: ev.tags.join(', '), featured: ev.featured, image_url: ev.image_url || '' });
  };

  const save = async () => {
    if (!f.title.trim() || !f.summary.trim() || !f.date || !f.location.trim()) return setErr('Título, resumen, fecha y lugar son obligatorios.');
    if (f.end_time <= f.time) return setErr('La hora de fin debe ser posterior a la de inicio.');
    if (Number(f.capacity) < 1) return setErr('El cupo debe ser de al menos 1.');
    setBusy(true); setErr('');
    let image_url = f.image_url || null;
    if (file) {
      const path = crypto.randomUUID() + '.' + file.name.split('.').pop().toLowerCase();
      const up = await supabase.storage.from('event-images').upload(path, file, { contentType: file.type });
      if (up.error) { setBusy(false); return setErr('No se pudo subir la imagen: ' + up.error.message); }
      image_url = supabase.storage.from('event-images').getPublicUrl(path).data.publicUrl;
    }
    const row = {
      title: f.title.trim(), category: f.category, summary: f.summary.trim(), description: f.description.trim(),
      date: f.date, time: f.time, end_time: f.end_time, location: f.location.trim(), organizer: f.organizer.trim(),
      capacity: Number(f.capacity), tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean), featured: f.featured, image_url,
    };
    const { error } = editing ? await supabase.from('events').update(row).eq('id', editing) : await supabase.from('events').insert(row);
    setBusy(false);
    if (error) return setErr(error.message);
    await loadEvents();
    say(editing ? 'Evento actualizado' : 'Evento creado');
    reset();
  };

  const del = async (ev) => {
    if (!window.confirm('¿Eliminar "' + ev.title + '"? También se borrarán sus registros.')) return;
    const { error } = await supabase.from('events').delete().eq('id', ev.slug);
    if (error) return say('No se pudo eliminar');
    await loadEvents();
    say('Evento eliminado');
    if (editing === ev.slug) reset();
  };

  const preview = file ? URL.createObjectURL(file) : f.image_url;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-2 sm:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-card p-5 shadow-xl sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Panel de administración</h3>
          <button onClick={onClose} aria-label="Cerrar" className="text-ink/50">✕</button>
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-semibold">{editing ? 'Editar evento' : 'Nuevo evento'}</h4>
            <input value={f.title} onChange={set('title')} className="inp" placeholder="Título del evento" />
            <select value={f.category} onChange={set('category')} className="inp">
              {Object.entries(CATS).map(([id, c]) => <option key={id} value={id}>{c.label}</option>)}
            </select>
            <input value={f.summary} onChange={set('summary')} className="inp" placeholder="Resumen corto (se ve en la tarjeta)" />
            <textarea value={f.description} onChange={set('description')} rows={3} className="inp" placeholder="Descripción completa" />
            <div className="grid grid-cols-3 gap-2">
              <label className="text-xs text-ink/60">Fecha<input type="date" value={f.date} onChange={set('date')} className="inp mt-1" /></label>
              <label className="text-xs text-ink/60">Inicio<input type="time" value={f.time} onChange={set('time')} className="inp mt-1" /></label>
              <label className="text-xs text-ink/60">Fin<input type="time" value={f.end_time} onChange={set('end_time')} className="inp mt-1" /></label>
            </div>
            <input value={f.location} onChange={set('location')} className="inp" placeholder="Lugar" />
            <input value={f.organizer} onChange={set('organizer')} className="inp" placeholder="Organiza (departamento)" />
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-ink/60">Cupo<input type="number" min="1" value={f.capacity} onChange={set('capacity')} className="inp mt-1" /></label>
              <label className="text-xs text-ink/60">Etiquetas (separadas por coma)<input value={f.tags} onChange={set('tags')} className="inp mt-1" placeholder="Fútbol, TecNM" /></label>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={set('featured')} /> Mostrar como evento destacado</label>
            <div>
              <p className="mb-1 text-xs text-ink/60">Imagen (JPG, PNG o WEBP)</p>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} className="text-sm" />
              {preview && <img src={preview} alt="Vista previa" className="mt-2 h-32 w-full rounded-lg object-cover" />}
            </div>
            {err && <p className="rounded-md bg-accent/10 px-3 py-2 text-sm text-accent">{err}</p>}
            <div className="flex gap-2">
              <button onClick={save} disabled={busy} className="btn flex-1 bg-primary text-paper hover:opacity-90 disabled:opacity-60">{busy ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear evento'}</button>
              {editing && <button onClick={reset} className="btn border border-line">Cancelar</button>}
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Eventos publicados ({events.length})</h4>
            <ul className="mt-3 space-y-2">
              {!events.length && <li className="text-sm text-ink/50">Todavía no hay eventos. Crea el primero.</li>}
              {events.map((ev) => (
                <li key={ev.slug} className="flex items-center justify-between gap-2 rounded-lg border border-line p-3 text-sm">
                  <span className="min-w-0">
                    <b className="block truncate">{ev.title}</b>
                    <span className="text-xs text-ink/60">{ev.date} · {ev.taken}/{ev.capacity} lugares</span>
                  </span>
                  <span className="flex shrink-0 gap-3 text-xs font-semibold">
                    <button onClick={() => edit(ev)} className="text-primary">Editar</button>
                    <button onClick={() => del(ev)} className="text-accent">Eliminar</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}