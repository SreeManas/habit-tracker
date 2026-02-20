import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Habits } from './pages/Habits';
import { Stats } from './pages/Stats';
import './App.css';

function App() {
  const { user, loading } = useAuth();
  useNotifications(); // Initialize notifications

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {user && <Navbar />}
        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/habits"
              element={
                <ProtectedRoute>
                  <Habits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <ProtectedRoute>
                  <Stats />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
