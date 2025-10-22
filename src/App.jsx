import React, { useState, useContext } from 'react';
import Header from './components/Header';
import './App.css';
import DashboardLayout from './admin/DashboardLayout';
import JourneyManager from './admin/JourneyManager';
import SpeechesManager from './admin/SpeechesManager';
import PressReleaseManager from './admin/PressReleaseManager';
import GalleryManager from './admin/GalleryManager';
import MessagesManager from './admin/MessagesManager';
  
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import Speeches from './components/Speeches';
import PressRelease from './components/PressRelease';
import Gallery from './components/Gallery';
import Connect from './components/Connect';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorPage from './components/error';

import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Main content component that includes all sections
function MainContent({ currentLanguage }) {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();

  // Show login form if not authenticated and on login page
  if (location.pathname === '/admin/login') {
    return <AdminLogin />;
  }

  // Wrapper component for sections with admin controls (AdminControls removed)
  const SectionWrapper = ({ children }) => (
    <section data-admin={isAdmin} style={{ position: 'relative' }}>
      {children}
    </section>
  );

  return (
    <>
      <SectionWrapper sectionName="hero">
        <Hero currentLanguage={currentLanguage} isAdmin={isAdmin} />
      </SectionWrapper>
      <SectionWrapper sectionName="about">
        <About currentLanguage={currentLanguage} isAdmin={isAdmin} />
      </SectionWrapper>
      <SectionWrapper sectionName="timeline">
        <Timeline currentLanguage={currentLanguage} isAdmin={isAdmin} />
      </SectionWrapper>
      <SectionWrapper sectionName="speeches">
        <Speeches currentLanguage={currentLanguage} isAdmin={isAdmin} />
      </SectionWrapper>
      <SectionWrapper sectionName="press-release">
        <PressRelease currentLanguage={currentLanguage} isAdmin={isAdmin} />
      </SectionWrapper>
      <SectionWrapper sectionName="gallery">
        <Gallery currentLanguage={currentLanguage} isAdmin={isAdmin} />
      </SectionWrapper>
      <SectionWrapper sectionName="connect">
        <Connect currentLanguage={currentLanguage} isAdmin={isAdmin} />
      </SectionWrapper>
      {/* Admin controls */}
      {isAdmin && (
        <div className="admin-controls">
          <button onClick={logout} className="logout-btn">
            Logout Admin
          </button>
        </div>
      )}
    </>
  );
}

function App() {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
  };

  // Use location to conditionally render Header
  const location = window.location.pathname;
  const isAdminRoute = location.startsWith('/dashboard') || location === '/admin/login';

  return (
    <AuthProvider>

      <Router>
        <div className="app overflow-x-hidden">
          <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss={false} draggable pauseOnHover={false} theme="colored" />
          {!isAdminRoute && (
            <Header 
              currentLanguage={currentLanguage} 
              onLanguageChange={handleLanguageChange} 
            />
          )}
          <main>
            <Routes>
              <Route path="/" element={<MainContent currentLanguage={currentLanguage} />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/dashboard/*" element={
                 <ProtectedRoute>
                   <DashboardLayout />
                 </ProtectedRoute>
               }>
                 <Route path="journey" element={<JourneyManager />} />
                 <Route path="speeches" element={<SpeechesManager />} />
                 <Route path="press-release" element={<PressReleaseManager />} />
                 <Route path="gallery" element={<GalleryManager />} />
                 <Route path="messages" element={<MessagesManager />} />
               </Route>

               <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
          <Footer currentLanguage={currentLanguage} />
        </div>
      </Router>

    </AuthProvider>
  );
}

export default App;
