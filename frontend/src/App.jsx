import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import AppLayout from "./components/AppLayout/AppLayout"
import BookingPage from "./pages/Booking/BookingPage"
import IntakeFormPage from "./pages/Intake/IntakeFormPage"
import PricingPage from "./pages/Pricing/PricingPage"
import ProfilePage from "./pages/Profile/ProfilePage"
import RegistrationPage from "./pages/Registration/RegistrationPage"
import LoginPage from "./pages/Login/LoginPage"
import EditChildPage from "./pages/EditChild/EditChildPage"

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes — no nav */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Protected routes — have BottomNav */}
          <Route
            path="/booking"
            element={
              <ProtectedLayout>
                <BookingPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedLayout>
                <PricingPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedLayout>
                <ProfilePage />
              </ProtectedLayout>
            }
          />

          {/* Intake is protected but has no BottomNav — it's a full screen flow */}
          <Route
            path="/intake"
            element={
              <ProtectedRoute>
                <IntakeFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/children/:id/edit"
            element={
              <ProtectedRoute>
                <EditChildPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
