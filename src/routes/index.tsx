import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PatientsPage } from '@/pages/PatientsPage'
import { AppointmentsPage } from '@/pages/AppointmentsPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { GynecologicalVisitsPage } from '@/pages/GynecologicalVisitsPage'
import { ObstetricHistoryPage } from '@/pages/ObstetricHistoryPage'
import { DiagnosisManagementPage } from '@/pages/DiagnosisManagementPage'
import { AddDiagnosisPage } from '@/pages/AddDiagnosisPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gynecological-visits"
            element={
              <ProtectedRoute>
                <GynecologicalVisitsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/obstetric-history"
            element={
              <ProtectedRoute>
                <ObstetricHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diagnosis-management"
            element={
              <ProtectedRoute>
                <DiagnosisManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-diagnosis"
            element={
              <ProtectedRoute>
                <AddDiagnosisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
