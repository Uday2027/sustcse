import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGate from './components/auth/RoleGate';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NoticesPage from './pages/NoticesPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AchievementsPage from './pages/AchievementsPage';
import FacultyPage from './pages/FacultyPage';
import AlumniPage from './pages/AlumniPage';
import SocietyPage from './pages/SocietyPage';
import StudentsPage from './pages/StudentsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import ProfilePage from './pages/ProfilePage';
import FinancePage from './pages/FinancePage';
import ImportantDataPage from './pages/ImportantDataPage';
import WorkAssignmentsPage from './pages/WorkAssignmentsPage';
import AdminPage from './pages/AdminPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="app">
      {/* Ambient Background Blobs from Fusion UI */}
      <div className="app-blob-1"></div>
      <div className="app-blob-2"></div>
      <div className="app-blob-3"></div>

      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/notices/:id" element={<NoticeDetailPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/alumni" element={<AlumniPage />} />
          <Route path="/society" element={<SocietyPage />} />

          {/* Guest only */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/:id" element={<StudentProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/important-data" element={<ImportantDataPage />} />
            <Route path="/work-assignments" element={<WorkAssignmentsPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGate allowedRoles={['admin', 'super_admin']} />}>
              <Route path="/admin/*" element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
