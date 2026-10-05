import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { getStats } from '../servicios/admin';
import { createTraining, listTrainings, deleteTraining } from '../servicios/trainings';
import { getAdminUser, logout } from '../servicios/auth';

export default function AdminDashboard() {
  const admin = getAdminUser();

  const [stats, setStats] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    file_type: 'video',
    file: null,
  });

  const cargarTodo = async () => {
    setLoading(true);
    setError('');
    try {
      const [s, t] = await Promise.all([getStats(), listTrainings()]);
      setStats(s);
      setTrainings(t);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file || !form.title || !form.file_type) return;
    setUploading(true);
    setError('');
    try {
      await createTraining(form);
      setForm({ title: '', description: '', file_type: 'video', file: null });
      await cargarTodo();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al subir');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta publicación?')) return;
    try {
      await deleteTraining(id);
      await cargarTodo();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header sticky */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shrink-0">
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                Panel Admin
              </h1>
              <p className="text-xs text-slate-500 truncate">
                {admin?.username || 'admin'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-medium px-3 sm:px-4 py-2 rounded-lg transition whitespace-nowrap"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Subir contenido */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">
            Subir contenido
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Título"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="px-4 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:col-span-2"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:col-span-2"
              rows={3}
            />
            <select
              value={form.file_type}
              onChange={(e) => setForm({ ...form, file_type: e.target.value })}
              className="px-4 py-3 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="video">Video</option>
              <option value="image">Imagen</option>
              <option value="document">Documento (PDF)</option>
            </select>

            {/* File input con label bonito */}
            <label className="relative flex items-center gap-3 px-4 py-3 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition">
              <input
                type="file"
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                required
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-slate-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-slate-600 truncate">
                {form.file ? form.file.name : 'Elegir archivo'}
              </span>
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="sm:col-span-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-medium py-3 rounded-xl transition text-sm"
            >
              {uploading ? 'Subiendo...' : 'Publicar'}
            </button>
          </form>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : stats && (
          <>
            {/* Resumen */}
            <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-slate-500">Publicaciones</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  {stats.porPublicacion.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-slate-500">Vistas totales</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  {stats.porPublicacion.reduce((a, p) => a + Number(p.total_views), 0)}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 xs:col-span-2 sm:col-span-1">
                <p className="text-xs sm:text-sm text-slate-500">Días con actividad</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  {stats.porDia.length}
                </p>
              </div>
            </section>

            {/* Gráfica vistas por día */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">
                Vistas por día
              </h2>
              <div className="w-full h-64 sm:h-72">
                <ResponsiveContainer>
                  <LineChart data={stats.porDia} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="vistas"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Gráfica detalle */}
            {stats.detalle.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">
                  Detalle por publicación y día
                </h2>
                <div className="w-full h-64 sm:h-72">
                  <ResponsiveContainer>
                    <BarChart data={stats.detalle} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                      />
                      <Bar dataKey="vistas" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}
          </>
        )}

        {/* Publicaciones - Cards en móvil, tabla en desktop */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">
            Publicaciones
          </h2>

          {trainings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">Aún no hay publicaciones.</p>
            </div>
          ) : (
            <>
              {/* Móvil: tarjetas */}
              <div className="md:hidden space-y-3">
                {trainings.map((t) => (
                  <div
                    key={t.id}
                    className="border border-slate-100 rounded-xl p-4 bg-slate-50/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
                            {t.file_type}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500">
                            {new Date(t.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-slate-800">
                          {t.total_views}
                        </p>
                        <p className="text-xs text-slate-400">vistas</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="mt-3 w-full text-red-600 hover:bg-red-50 text-xs font-medium py-2 rounded-lg transition"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop: tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-100">
                      <th className="py-3 pr-3 font-medium">Título</th>
                      <th className="py-3 pr-3 font-medium">Tipo</th>
                      <th className="py-3 pr-3 font-medium">Publicado</th>
                      <th className="py-3 pr-3 font-medium text-right">Vistas</th>
                      <th className="py-3 pr-3 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainings.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition"
                      >
                        <td className="py-3 pr-3 font-medium text-slate-800">
                          {t.title}
                        </td>
                        <td className="py-3 pr-3">
                          <span className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
                            {t.file_type}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-slate-600">
                          {new Date(t.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-3 text-right font-semibold text-slate-800">
                          {t.total_views}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-red-600 hover:text-red-700 hover:underline text-xs font-medium"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}