import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleRoute } from './components/auth/RoleRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import SubmissionPage from './pages/contest/SubmissionPage';
import ManuscriptPage from './pages/contest/ManuscriptPage';
import VotingPage from './pages/contest/VotingPage';
import ProfilePage from './pages/user/ProfilePage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminParticipantsPage from './pages/admin/ParticipantsPage';
import AdminJudgesPage from './pages/admin/JudgesPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';

function App() {
  return (
    <SupabaseProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/voting" element={<VotingPage />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/submission" element={
                    <RoleRoute allowedRoles={['participant']}>
                      <SubmissionPage />
                    </RoleRoute>
                  } />
                  <Route path="/manuscript" element={
                    <RoleRoute allowedRoles={['participant']}>
                      <ManuscriptPage />
                    </RoleRoute>
                  } />
                </Route>
              </Route>

              {/* Admin routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </RoleRoute>
                } />
                <Route path="/admin/participants" element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminParticipantsPage />
                  </RoleRoute>
                } />
                <Route path="/admin/judges" element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminJudgesPage />
                  </RoleRoute>
                } />
              </Route>

              {/* Not found */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </SupabaseProvider>
  );
}

export default App;