import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PublicHome from './pages/PublicHome';
import TrainingDetail from './pages/TrainingDetail';
import AdminDashboard from './pages/AdminDashboard';
import { isAuthenticated } from './servicios/auth';

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/capacitacion/:id" element={<TrainingDetail />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}