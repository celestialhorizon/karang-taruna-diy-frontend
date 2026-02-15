import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { DetailPage } from './components/DetailPage';
import { MyLearningPage } from './components/MyLearningPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsOfService } from './components/pages/TermsOfService';
import { AboutUs } from './components/pages/AboutUs';
import { FAQ } from './components/pages/FAQ';
import { Contact } from './components/pages/Contact';
import { Toaster } from './components/ui/sonner';
import { authStorage } from './lib/auth';

// Wrapper component to handle navigation logic
function AppContent() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const user = authStorage.getUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const handleNavigate = (page: string, tutorialId?: string) => {
    // Map pages to routes
    const routeMap: Record<string, string> = {
      'register': '/register',
      'login': '/login',
      'home': '/',
      'detail': tutorialId ? `/tutorial/${tutorialId}` : '/tutorial',
      'my-learning': '/my-learning',
      'admin-login': '/admin/login',
      'admin-dashboard': '/admin/dashboard',
      'admin-tutorials': '/admin/tutorials',
      'admin-users': '/admin/users',
      'privacy': '/privacy',
      'terms': '/terms',
      'about': '/about',
      'faq': '/faq',
      'contact': '/contact'
    };

    const route = routeMap[page];
    if (route) {
      navigate(route);
    }
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    // Check if there was a pending redirect
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    
    if (redirect) {
      navigate(redirect);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    authStorage.clearAuth();
    setCurrentUser(null);
    navigate('/');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage user={currentUser} onNavigate={handleNavigate} onLogout={handleLogout} />} />
      <Route path="/register" element={<RegisterPage onNavigate={handleNavigate} />} />
      <Route path="/login" element={<LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />} />
      <Route path="/about" element={<AboutUs onNavigate={handleNavigate} />} />
      <Route path="/faq" element={<FAQ onNavigate={handleNavigate} />} />
      <Route path="/contact" element={<Contact onNavigate={handleNavigate} />} />
      <Route path="/privacy" element={<PrivacyPolicy onNavigate={handleNavigate} />} />
      <Route path="/terms" element={<TermsOfService onNavigate={handleNavigate} />} />
      
      {/* Protected routes - require login */}
      <Route 
        path="/tutorial/:id" 
        element={
          currentUser ? (
            <DetailPage 
              user={currentUser}
              onNavigate={handleNavigate}
            />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        } 
      />
      <Route 
        path="/my-learning" 
        element={
          currentUser ? (
            <MyLearningPage
              user={currentUser}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        } 
      />
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage onNavigate={handleNavigate} onAdminLogin={handleLogin} />} />
      <Route 
        path="/admin/dashboard" 
        element={
          currentUser?.role === 'admin' ? (
            <AdminDashboard
              admin={currentUser}
              onNavigate={handleNavigate}
              onAdminLogout={handleLogout}
              defaultTab="tutorials"
            />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } 
      />
      <Route 
        path="/admin/tutorials" 
        element={
          currentUser?.role === 'admin' ? (
            <AdminDashboard
              admin={currentUser}
              onNavigate={handleNavigate}
              onAdminLogout={handleLogout}
              defaultTab="tutorials"
            />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          currentUser?.role === 'admin' ? (
            <AdminDashboard
              admin={currentUser}
              onNavigate={handleNavigate}
              onAdminLogout={handleLogout}
              defaultTab="users"
            />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        } 
      />
      {/* Admin root redirect */}
      <Route 
        path="/admin" 
        element={<Navigate to="/admin/tutorials" replace />}
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}
