import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import BookingPage from "./pages/Booking/BookingPage"
import IntakeFormPage from "./pages/Intake/IntakeFormPage"
import PricingPage from "./pages/Pricing/PricingPage"
import RegistrationPage from "./pages/Registration/RegistrationPage"
import LoginPage from "./pages/Login/LoginPage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Protected routes — require authentication */}
          <Route
            path="/intake"
            element={
              <ProtectedRoute>
                <IntakeFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <PricingPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
