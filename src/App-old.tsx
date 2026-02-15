import { useState, useEffect } from 'react';
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

type Page = 'register' | 'login' | 'home' | 'detail' | 'my-learning' | 'admin-login' | 'admin-dashboard' | 'privacy' | 'terms' | 'about' | 'faq' | 'contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [selectedTutorialId, setSelectedTutorialId] = useState<string>('');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  // Check if user is already logged in
  useEffect(() => {
    const user = authStorage.getUser();
    if (user) {
      setCurrentUser(user);
    }

    const storedAdmin = localStorage.getItem('diy_admin_user');
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setCurrentAdmin(admin);
    }
  }, []);

  const handleNavigate = (page: string, tutorialId?: string) => {
    if (tutorialId) {
      setSelectedTutorialId(tutorialId);
    }
    // If navigating to detail but not logged in, redirect to login and save pending tutorial
    if (page === 'detail' && !currentUser) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page as Page);
    }
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    // If there's a pending tutorial, go to detail page
    if (selectedTutorialId) {
      setCurrentPage('detail');
    } else {
      setCurrentPage('home');
    }
  };

  const handleAdminLogin = (adminData: any) => {
    setCurrentAdmin(adminData);
  };

  const handleLogout = () => {
    authStorage.clearAuth();
    setCurrentUser(null);
    setCurrentPage('home');
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('diy_admin_user');
    setCurrentAdmin(null);
    setCurrentPage('home');
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {currentPage === 'register' && (
        <RegisterPage onNavigate={handleNavigate} />
      )}
      {currentPage === 'login' && (
        <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
      )}
      {currentPage === 'home' && (
        <HomePage 
          user={currentUser} 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'detail' && currentUser && (
        <DetailPage 
          tutorialId={selectedTutorialId}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'my-learning' && currentUser && (
        <MyLearningPage
          user={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'admin-login' && (
        <AdminLoginPage
          onNavigate={handleNavigate}
          onAdminLogin={handleAdminLogin}
        />
      )}
      {currentPage === 'admin-dashboard' && currentAdmin && (
        <AdminDashboard
          admin={currentAdmin}
          onNavigate={handleNavigate}
          onAdminLogout={handleAdminLogout}
        />
      )}
      {currentPage === 'privacy' && (
        <PrivacyPolicy onNavigate={handleNavigate} />
      )}
      {currentPage === 'terms' && (
        <TermsOfService onNavigate={handleNavigate} />
      )}
      {currentPage === 'about' && (
        <AboutUs onNavigate={handleNavigate} />
      )}
      {currentPage === 'faq' && (
        <FAQ onNavigate={handleNavigate} />
      )}
      {currentPage === 'contact' && (
        <Contact onNavigate={handleNavigate} />
      )}
      <Toaster />
    </>
  );
}