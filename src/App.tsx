import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard bisa diakses lewat /dashboard dan /admin */}
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/admin/*" element={<DashboardPage />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/admin/home" replace />} />
        <Route path="*" element={<Navigate to="/admin/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
