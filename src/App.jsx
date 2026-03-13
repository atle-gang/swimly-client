import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './pages/Booking/BookingPage';
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to booking for now */}
        <Route path="/" element={<Navigate to="/booking" replace />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;