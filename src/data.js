export const CATS = {
  deportivo: { label: 'Deportivo', plural: 'Deportivos', desc: 'Torneos, encuentros y actividades físicas que fomentan la sana competencia y el trabajo en equipo.', chip: 'text-sport' },
  academico: { label: 'Académico', plural: 'Académicos', desc: 'Conferencias, congresos, concursos y talleres que impulsan el conocimiento científico y tecnológico.', chip: 'text-primary' },
  cultural: { label: 'Cultural', plural: 'Culturales', desc: 'Presentaciones artísticas, exposiciones y festivales que celebran la identidad y la expresión.', chip: 'text-accent' },
};

export const STATS = [['8', 'Eventos activos'], ['3', 'Categorías'], ['+2,000', 'Participantes'], ['1', 'Comunidad TecNM']];

export const EMAIL_DOMAIN = '@chihuahua2.tecnm.mx';
export const LINKS = { tec: 'https://www.facebook.com/TecNMcampusChihuahuaII/?locale=es_LA', ambar: 'https://chihuahua2.ambar.tecnm.mx/auth/Authorization/Login?ReturnUrl=%2Fauth%2Fconnect%2Fauthorize%3Fclient_id%3Destudiantes-spa%26redirect_uri%3Dhttps%253A%252F%252Fchihuahua2.ambar.tecnm.mx%252Festudiantes%252Foidc-callback%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520api-planteles%2520api-escolares%2520offline_access%26state%3De8dd61fb682047c9ba00cd92b824a4e7%26code_challenge%3DNVBcI1vE8LIKyCRgjJDYvpTR5xoUfrk6YgjdGwzzuC0%26code_challenge_method%3DS256%26response_mode%3Dquery' };

export const longDate = (iso) =>
  new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso + 'T00:00:00'));
export const isPast = (ev) => new Date(ev.date + 'T' + ev.end + ':00') < new Date();
export const daysUntil = (ev) => Math.round((new Date(ev.date + 'T00:00:00') - new Date(new Date().toDateString())) / 864e5);

// Convierte una fila de la base de datos al formato que usan los componentes
export const toEvent = (r) => ({
  slug: r.id,
  image: r.image_url || '/images/sin-imagen.jpg',
  image_url: r.image_url,
  title: r.title,
  category: r.category,
  summary: r.summary,
  description: r.description,
  date: r.date,
  time: r.time.slice(0, 5),
  end: r.end_time.slice(0, 5),
  location: r.location,
  organizer: r.organizer,
  capacity: r.capacity,
  tags: r.tags || [],
  featured: r.featured,
  taken: r.taken,
});