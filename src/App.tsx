import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import JobsPage from './components/JobsPage';
import AuthPage from './components/AuthPage';
import ApplicantDashboard from './components/ApplicantDashboard';
import HRDDashboard from './components/HRDDashboard';

function AppContent() {
  const { currentPage, currentUser } = useApp();

  if (!currentUser) {
    switch (currentPage) {
      case 'jobs':
        return <JobsPage />;
      case 'auth':
        return <AuthPage />;
      default:
        return <LandingPage />;
    }
  }

  if (currentUser.role === 'applicant') {
    return <ApplicantDashboard />;
  }

  return <HRDDashboard />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
