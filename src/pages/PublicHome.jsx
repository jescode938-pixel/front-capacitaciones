import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTrainings } from '../servicios/trainings';
import logo from '../assets/logo.jpeg';
const API_URL = 'http://localhost:3000';

import { resolverUrlArchivo } from '../utils/drive';
// Colores y etiquetas por tipo
const TIPO = {
  video: {
    label: 'Video',
    clases: 'bg-purple-100 text-purple-700',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
  image: {
    label: 'Imagen',
    clases: 'bg-emerald-100 text-emerald-700',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  document: {
    label: 'PDF',
    clases: 'bg-amber-100 text-amber-700',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
};

export default function PublicHome() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await listTrainings();
        setTrainings(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // Filtrado por búsqueda y tipo
  const filtradas = useMemo(() => {
    return trainings.filter((t) => {
      const coincideBusqueda =
        t.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = filtro === 'todos' || t.file_type === filtro;
      return coincideBusqueda && coincideTipo;
    });
  }, [trainings, busqueda, filtro]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header con degradado */}
      <header className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-10 sm:pb-16">
       <div className="flex items-center gap-3 mb-2">
  <div className="w-10 h-10 sm:w-12 sm:h-12 aspect-square rounded-full bg-white overflow-hidden flex items-center justify-center shadow-md ring-2 ring-white/30 shrink-0">
    <img
      src={logo}
      alt="Logo"
      className="w-full h-full object-cover"
    />
  </div>
  <span className="text-sm font-medium text-blue-100">Blog Almacen Refrielectric sas</span>
</div>

          <h1 className="text-2xl sm:text-4xl font-bold mt-3">
            Explora el contenido
          </h1>
          <p className="text-sm sm:text-base text-blue-100 mt-2 max-w-xl">
            Videos, imágenes y documentos para tu formación continua
          </p>

          {/* Buscador */}
          <div className="mt-6 relative max-w-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar capacitaciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </header>

      {/* Filtros pegados al header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-2 flex gap-1 overflow-x-auto">
          {[
            { valor: 'todos', label: 'Todos' },
            { valor: 'video', label: 'Videos' },
            { valor: 'image', label: 'Imágenes' },
            { valor: 'document', label: 'Documentos' },
          ].map((op) => (
            <button
              key={op.valor}
              onClick={() => setFiltro(op.valor)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                filtro === op.valor
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && filtradas.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">
              {busqueda || filtro !== 'todos'
                ? 'No se encontraron resultados'
                : 'Aún no hay capacitaciones publicadas'}
            </p>
          </div>
        )}

        {!loading && !error && filtradas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtradas.map((t) => {
              const tipo = TIPO[t.file_type] || TIPO.document;
              const tieneThumb = t.file_type === 'image';

              return (
                <Link
                  key={t.id}
                  to={`/capacitacion/${t.id}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-lg active:scale-[0.98] transition-all overflow-hidden flex flex-col border border-slate-100"
                >
                  {/* Thumbnail o degradado */}
                  {/* Thumbnail o degradado */}
<div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
  {t.file_type === 'image' && (
    <img
      src={resolverUrlArchivo(t.file_url, 'image')}
      alt={t.title}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  )}

  {t.file_type === 'video' && (
    <img
      src={`https://img.youtube.com/vi/${t.file_url}/hqdefault.jpg`}
      alt={t.title}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  )}

{t.file_type === 'document' && (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-14 h-14 text-amber-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
    <span className="text-xs font-semibold text-amber-700 mt-2 uppercase tracking-wide">
      Documento PDF
    </span>
  </div>
)}

  {/* Badge de tipo */}
  <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${tipo.clases} shadow-sm`}>
    {tipo.icono}
    {tipo.label}
  </span>
</div>

                  {/* Contenido */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <h2 className="text-base font-semibold text-slate-800 line-clamp-2 leading-snug">
                      {t.title}
                    </h2>

                    {t.description && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                        {t.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {new Date(t.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        {t.total_views}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-8 mt-4">
        <p className="text-center text-xs text-slate-400">
          Plataforma de capacitaciones · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}