import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"
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
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/intake" element={<IntakeFormPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
