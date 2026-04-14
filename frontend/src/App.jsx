import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Billing from './pages/Billing'
import History from './pages/History'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
      } />
      <Route path="/register" element={
        !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
      } />
      
      {/* Protected Routes with Layout */}
      <Route path="/dashboard" element={
        isAuthenticated ? (
          <Layout>
            <Dashboard />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      
      <Route path="/billing" element={
        isAuthenticated ? (
          <Layout>
            <Billing />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      
      <Route path="/history" element={
        isAuthenticated ? (
          <Layout>
            <History />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App