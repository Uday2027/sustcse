import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGate from './components/auth/RoleGate';
import Breadcrumb from './components/common/Breadcrumb';
import ScrollToTop from './components/common/ScrollToTop';
import LoadingFallback from './components/common/LoadingFallback';

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NoticesPage = lazy(() => import('./pages/NoticesPage'));
const NoticeDetailPage = lazy(() => import('./pages/NoticeDetailPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const FacultyPage = lazy(() => import('./pages/FacultyPage'));
const FacultyProfilePage = lazy(() => import('./pages/FacultyProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const MessageFromHeadPage = lazy(() => import('./pages/MessageFromHeadPage'));
const AlumniPage = lazy(() => import('./pages/AlumniPage'));
const SocietyPage = lazy(() => import('./pages/SocietyPage'));
const ProgramPage = lazy(() => import('./pages/ProgramPage'));
const AcademicPage = lazy(() => import('./pages/AcademicPage'));
const TuitionFeesPage = lazy(() => import('./pages/TuitionFeesPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const DegreesAwardedPage = lazy(() => import('./pages/DegreesAwardedPage'));
const StudentsPage = lazy(() => import('./pages/StudentsPage'));
const StudentProfilePage = lazy(() => import('./pages/StudentProfilePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const ImportantDataPage = lazy(() => import('./pages/ImportantDataPage'));
const WorkAssignmentsPage = lazy(() => import('./pages/WorkAssignmentsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <div className="app">
      {/* Scroll to top component handles scroll reset on route change */}
      <ScrollToTop />
      
      {/* Ambient Background Blobs from Fusion UI */}
      <div className="app-blob-1"></div>
      <div className="app-blob-2"></div>
      <div className="app-blob-3"></div>

      <Navbar />
      <main className="main-content">
        <Breadcrumb />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/notices/:id" element={<NoticeDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/faculty/:slug" element={<FacultyProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/academic" element={<AcademicPage />} />
            <Route path="/tuition-fees" element={<TuitionFeesPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/degrees-awarded" element={<DegreesAwardedPage />} />
            <Route path="/message-from-head" element={<MessageFromHeadPage />} />
            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="/society" element={<SocietyPage />} />

            {/* Guest only */}
            <Route path="/auth" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
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
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
