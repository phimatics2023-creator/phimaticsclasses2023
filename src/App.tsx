import React, { useState, useEffect } from 'react';
import { AuthUser, Announcement } from './types';
import { dataStore } from './services/storage';
import { ContentProvider, useAppContent } from './context/ContentContext';

import { PublicLandingView } from './components/PublicLandingView';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { AttendanceView } from './components/AttendanceView';
import { MonthlyFeesView } from './components/MonthlyFeesView';
import { BatchesView } from './components/BatchesView';
import { OnlineClassesView } from './components/OnlineClassesView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { StudyMaterialsView } from './components/StudyMaterialsView';
import { GalleryView } from './components/GalleryView';
import { ContactView } from './components/ContactView';
import { AppSettingsView } from './components/AppSettingsView';
import { AdminStudentsView } from './components/AdminStudentsView';
import { AdminTeachersView } from './components/AdminTeachersView';
import { StudentProfileView } from './components/StudentProfileView';
import { TestMarksAndRankingsView } from './components/TestMarksAndRankingsView';
import { LoginModal } from './components/LoginModal';
import { FirebaseModal } from './components/FirebaseModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { MobileMenuModal } from './components/MobileMenuModal';
import { NotificationsModal } from './components/NotificationsModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { Eye, Check, X } from 'lucide-react';

function AppInner() {
  const { content, isPreviewActive, exitPreview, saveContent } = useAppContent();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return dataStore.getStoredSession();
  });
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [, setRefreshTicker] = useState(0);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'standard' | 'admin'>('standard');
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [pdfViewerState, setPdfViewerState] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: ''
  });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Subscribe to dataStore changes so any CRUD or session update reflects instantly
  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      const activeSession = dataStore.getStoredSession();
      setCurrentUser(activeSession);
      setRefreshTicker(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Listen for native PWA beforeinstallprompt event on Android and Desktop
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
      console.log('PhiMatiCs Classes app installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Listen for browser back / forward navigation and session changes
  useEffect(() => {
    const handlePopState = () => {
      const activeSession = dataStore.getStoredSession();
      if (!activeSession) {
        setCurrentUser(null);
        setCurrentTab('home');
      } else {
        setCurrentUser(activeSession);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen for admin-access route specifically
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      const isAdminRoute = path === '/admin-access' || hash === '#admin-access' || search.includes('admin-access');

      if (isAdminRoute) {
        const activeSession = dataStore.getStoredSession();
        if (!activeSession) {
          setLoginModalMode('admin');
          setIsLoginModalOpen(true);
        } else if (activeSession.role === 'admin') {
          setCurrentTab('attendance');
        } else {
          setCurrentTab('home');
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, []);

  const handleOpenLogin = () => {
    setLoginModalMode('standard');
    setIsLoginModalOpen(true);
  };

  const handleOpenAdminLogin = () => {
    setLoginModalMode('admin');
    setIsLoginModalOpen(true);
  };

  // Strictly enforce teacher access restriction to exactly 3 main functions
  useEffect(() => {
    if (currentUser?.role === 'teacher') {
      if (!['announcements', 'materials', 'online-classes'].includes(currentTab)) {
        setCurrentTab('announcements');
      }
    }
  }, [currentUser, currentTab]);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentTab('attendance');
    } else if (user.role === 'teacher') {
      setCurrentTab('announcements');
    } else {
      setCurrentTab('home');
    }
    setLoginModalMode('standard');
    // Update browser history so back button behaves consistently
    window.history.pushState({ authenticated: true }, '', window.location.pathname);
  };

  const handleLogout = () => {
    dataStore.setStoredSession(null);
    setCurrentUser(null);
    setCurrentTab('home');
    setLoginModalMode('standard');
    setIsLoginModalOpen(false);
    setSelectedAnnouncement(null);
    setIsMobileMenuOpen(false);
    setIsNotificationsModalOpen(false);
    // Overwrite browser history to prevent returning to private views via Back button
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleOpenPdf = (url: string, title: string) => {
    setPdfViewerState({
      isOpen: true,
      url,
      title
    });
  };

  const handleClosePdf = () => {
    setPdfViewerState({
      isOpen: false,
      url: '',
      title: ''
    });
  };

  const handleOpenAnnouncement = (ann: Announcement) => {
    setSelectedAnnouncement(ann);
    setCurrentTab('announcements');
  };

  // =========================================================================
  // ENFORCED LOGIN REQUIREMENT: Unauthenticated visitors see ONLY the
  // minimal Public Landing Page with official logo, app name, welcome message,
  // and single Sign In button. Absolutely NO private content or navigation.
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-sky-200 selection:text-slate-900">
        <PublicLandingView 
          onOpenLogin={handleOpenLogin} 
          onOpenAdminLogin={handleOpenAdminLogin}
        />

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          isAdminOnly={loginModalMode === 'admin'}
        />

        <FirebaseModal
          isOpen={isDbModalOpen}
          onClose={() => setIsDbModalOpen(false)}
        />
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED PORTAL: Only displayed after verified login (Admin or Student)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-sky-200 selection:text-slate-900">
      {/* Live Preview Mode Banner */}
      {isPreviewActive && (
        <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <Eye className="w-4 h-4 shrink-0" />
            <span>
              <strong>Live Preview Active:</strong> You are previewing unsaved draft text across the app.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exitPreview()}
              className="px-2.5 py-1 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit Preview</span>
            </button>
            <button
              onClick={() => saveContent({})}
              className="px-2.5 py-1 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenInstallApp={() => setIsInstallModalOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 sm:py-7">
        {currentTab === 'home' && (
          <HomeView
            currentUser={currentUser}
            onSelectTab={setCurrentTab}
            onOpenLogin={handleOpenLogin}
            onOpenAnnouncement={handleOpenAnnouncement}
          />
        )}

        {currentTab === 'batches' && (
          <BatchesView
            currentUser={currentUser}
          />
        )}

        {currentTab === 'attendance' && (
          <AttendanceView
            currentUser={currentUser}
            onOpenLogin={handleOpenLogin}
          />
        )}

        {currentTab === 'fees' && (
          <MonthlyFeesView
            currentUser={currentUser}
            onOpenLogin={handleOpenLogin}
          />
        )}

        {currentTab === 'test-marks' && (
          <TestMarksAndRankingsView
            currentUser={currentUser}
          />
        )}

        {currentTab === 'online-classes' && (
          <OnlineClassesView
            currentUser={currentUser}
          />
        )}

        {currentTab === 'announcements' && (
          <AnnouncementsView
            currentUser={currentUser}
            selectedAnnouncementModal={selectedAnnouncement}
            onCloseAnnouncementModal={() => setSelectedAnnouncement(null)}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {currentTab === 'materials' && (
          <StudyMaterialsView
            currentUser={currentUser}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryView
            currentUser={currentUser}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView
            currentUser={currentUser}
          />
        )}

        {currentTab === 'app-settings' && currentUser?.role === 'admin' && (
          <AppSettingsView
            currentUser={currentUser}
          />
        )}

        {currentTab === 'admin-students' && currentUser?.role === 'admin' && (
          <AdminStudentsView />
        )}

        {currentTab === 'admin-teachers' && currentUser?.role === 'admin' && (
          <AdminTeachersView />
        )}

        {currentTab === 'student-profile' && (
          <StudentProfileView
            currentUser={currentUser}
            onSelectTab={setCurrentTab}
            onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="hidden sm:block border-t border-slate-200 bg-white/80 text-center py-6 px-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={content.general?.logoUrl || "/phimatics-logo.svg"} alt="Logo" className="w-5 h-5 rounded-sm object-contain" />
            <span className="font-bold text-slate-800">{content.general?.appName || 'PhiMatiCs Classes'}</span>
            <span className="text-slate-400">•</span>
            <span>{content.general?.tagline || 'The Learning App'}</span>
          </div>
          <div>
            <p>{content.general?.footerText || '© 2026 PhiMatiCs Classes. All rights reserved. Concept-First Learning in Mathematics & Science.'}</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar - ONLY when authenticated */}
      {currentUser && (
        <BottomNav
          currentUser={currentUser}
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenMoreMenu={() => setIsMobileMenuOpen(true)}
        />
      )}

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isAdminOnly={loginModalMode === 'admin'}
      />

      <FirebaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />

      <PdfViewerModal
        isOpen={pdfViewerState.isOpen}
        onClose={handleClosePdf}
        pdfUrl={pdfViewerState.url}
        title={pdfViewerState.title}
      />

      <MobileMenuModal
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentUser={currentUser}
        onSelectTab={setCurrentTab}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        currentUser={currentUser}
        onNavigateToTab={(tab) => {
          setCurrentTab(tab);
          setIsNotificationsModalOpen(false);
        }}
      />

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallAccepted={() => setDeferredPrompt(null)}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AppInner />
    </ContentProvider>
  );
}
