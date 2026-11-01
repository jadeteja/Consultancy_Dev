import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { JobListingsPage } from './pages/JobListingsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CandidateDashboardPage } from './pages/CandidateDashboardPage';
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { FloatingWhatsApp } from './components/shared/FloatingWhatsApp';
import { useAuth } from './features/auth/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Authenticating...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole) && !hasRole('ROLE_SUPER_ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFF]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobListingsPage />} />
          <Route path="/jobs/:slug" element={<JobDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Candidate Dashboard */}
          <Route
            path="/candidate"
            element={
              <ProtectedRoute>
                <CandidateDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Dashboard */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute requiredRole="ROLE_RECRUITER">
                <RecruiterDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ROLE_SUPER_ADMIN">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
