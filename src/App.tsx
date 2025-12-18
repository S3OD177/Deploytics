import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { ThemeProvider } from '@/hooks/useTheme'
import { CommandPalette } from '@/components/CommandPalette'

// Pages
import Login from '@/pages/Login'
import Overview from '@/pages/Overview'
import Projects from '@/pages/Projects'
import ProjectDetail from '@/pages/ProjectDetail'
import Alerts from '@/pages/Alerts'
import Settings from '@/pages/Settings'
import Integrations from '@/pages/Integrations'
import Billing from '@/pages/Billing'
import NotFound from '@/pages/NotFound'

// Layout
import DashboardLayout from '@/components/layout/DashboardLayout'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/overview" replace />} />
                <Route path="overview" element={<Overview />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="settings" element={<Settings />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="billing" element={<Billing />} />
            </Route>

            {/* Auth Callback */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

// Auth callback handler
function AuthCallback() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (user) {
        return <Navigate to="/overview" replace />
    }

    return <Navigate to="/login" replace />
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppRoutes />
                <CommandPalette />
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
