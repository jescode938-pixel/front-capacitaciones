import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTraining, registerView } from '../servicios/trainings';
import { getViewerToken } from '../hooks/useViewerToken';
import { resolverUrlArchivo } from '../utils/drive';

const API_URL = `http://${window.location.hostname}:3000`;



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

export default function TrainingDetail() {
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vistaRegistrada, setVistaRegistrada] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getTraining(id);
        setTraining(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  const marcarVista = async () => {
    if (vistaRegistrada) return;
    try {
      const token = getViewerToken();
      const res = await registerView(id, token);
      setVistaRegistrada(true);
      setTraining((prev) => ({ ...prev, total_views: res.total_views }));
    } catch (err) {
      console.error('Error al registrar vista', err);
    }
  };

  // Imágenes y documentos: registrar al cargar
  useEffect(() => {
    if (training && training.file_type !== 'video') {
      marcarVista();
    }
    // eslint-disable-next-line
  }, [training]);

  // Loading con spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4 max-w-sm text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!training) return null;

const fileUrl = resolverUrlArchivo(training.file_url, training.file_type);
const tipo = TIPO[training.file_type] || TIPO.document;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header con degradado */}
      <header className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white transition group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-3 sm:-mt-4 pb-8">
        {/* Card principal */}
        <article className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
          {/* Reproductor */}
          <div className="bg-slate-900">
           {training.file_type === 'video' && (
  <div className="w-full aspect-video bg-black">
    <iframe
      src={`https://www.youtube.com/embed/${training.file_url}?rel=0&modestbranding=1`}
      title={training.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
      onLoad={marcarVista}
    />
  </div>
)}

            {training.file_type === 'image' && (
              <div className="flex items-center justify-center bg-slate-900">
                <img
                  src={fileUrl}
                  alt={training.title}
                  className="w-full max-h-[70vh] object-contain"
                />
              </div>
            )}

            {training.file_type === 'document' && (
              <iframe
                src={fileUrl}
                title={training.title}
                className="w-full h-[70vh] sm:h-[75vh] bg-white"
              />
            )}
          </div>

          {/* Info */}
          <div className="p-5 sm:p-8">
            {/* Badge de tipo */}
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${tipo.clases}`}>
              {tipo.icono}
              {tipo.label}
            </span>

            {/* Título */}
            <h1 className="text-xl sm:text-3xl font-bold text-slate-800 mt-4 leading-tight">
              {training.title}
            </h1>

            {/* Metadatos como chips */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {new Date(training.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>

              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {training.total_views} {training.total_views === 1 ? 'vista' : 'vistas'}
              </span>
            </div>

            {/* Descripción */}
            {training.description && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                  Descripción
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {training.description}
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Botón volver al final */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-5 py-3 rounded-xl shadow-sm border border-slate-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Ver más capacitaciones
          </Link>
        </div>
      </main>
    </div>
  );
}