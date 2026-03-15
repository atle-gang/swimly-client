import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './pages/Booking/BookingPage';
import IntakeFormPage from './pages/Intake/IntakeFormPage';
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/booking" replace />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/intake" element={<IntakeFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;