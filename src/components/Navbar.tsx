import React from 'react';
import { Logo } from './Logo';
import { StudentAvatar } from './StudentAvatar';
import { AuthUser } from '../types';
import { 
  LogIn, 
  LogOut, 
  User, 
  Users,
  ShieldCheck, 
  Database, 
  BookOpen, 
  CalendarCheck2, 
  Bell, 
  Image as ImageIcon, 
  PhoneCall,
  CreditCard,
  Building2,
  Video,
  Settings,
  Smartphone,
  Award,
  KeyRound
} from 'lucide-react';

import { dataStore } from '../services/storage';

import { useAppContent } from '../context/ContentContext';

interface NavbarProps {
  currentUser: AuthUser | null;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenDbModal: () => void;
  onOpenNotifications?: () => void;
  onOpenInstallApp?: () => void;
  onOpenChangePassword?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onOpenLogin,
  onLogout,
  onOpenDbModal,
  onOpenNotifications,
  onOpenInstallApp,
  onOpenChangePassword
}) => {
  const { content } = useAppContent();
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';
  const studentId = isStudent ? currentUser.data.id : undefined;
  const unreadNotifCount = dataStore.getUnreadNotificationCount(studentId);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => onSelectTab('home')} 
          className="cursor-pointer shrink-0"
        >
          <Logo size="sm" showSubtitle={true} />
        </div>

        {/* Desktop Navigation Links - ONLY when authenticated */}
        {/* Desktop Navigation Links */}
        {currentUser && (
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 overflow-x-auto py-1">
            {/* TEACHER ROLE: Exactly 3 allowed main functions */}
            {currentUser.role === 'teacher' ? (
              <>
                <button
                  onClick={() => onSelectTab('announcements')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'announcements'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>Announcements</span>
                </button>

                <button
                  onClick={() => onSelectTab('materials')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'materials'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Study Materials</span>
                </button>

                <button
                  onClick={() => onSelectTab('online-classes')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'online-classes'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>Online Classes</span>
                </button>
              </>
            ) : (
              /* ADMIN and STUDENT ROLES */
              <>
                <button
                  onClick={() => onSelectTab('home')}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                    currentTab === 'home'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {isAdmin ? 'Dashboard' : (content.navigation?.navHome || 'Home')}
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => onSelectTab('admin-students')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        currentTab === 'admin-students'
                          ? 'bg-slate-900 text-white'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-sky-600" />
                      <span>Students</span>
                    </button>

                    <button
                      onClick={() => onSelectTab('admin-teachers')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        currentTab === 'admin-teachers'
                          ? 'bg-slate-900 text-white'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Teachers</span>
                    </button>
                  </>
                )}

                {/* Class Batches */}
                <button
                  onClick={() => onSelectTab('batches')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'batches'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                  {isAdmin ? (content.navigation?.navBatches || 'Batches') : 'My Batch'}
                </button>

                {/* Attendance */}
                <button
                  onClick={() => onSelectTab('attendance')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'attendance'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                  {isAdmin ? (content.navigation?.navAttendance || 'Attendance') : 'My Attendance'}
                </button>

                {/* Monthly Fees */}
                <button
                  onClick={() => onSelectTab('fees')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'fees'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  {content.navigation?.navFees || 'Monthly Fees'}
                </button>

                {/* Announcements */}
                <button
                  onClick={() => onSelectTab('announcements')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'announcements'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  {content.navigation?.navAnnouncements || 'Announcements'}
                </button>

                {/* Study Materials */}
                <button
                  onClick={() => onSelectTab('materials')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'materials'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  {content.navigation?.navMaterials || 'Study Materials'}
                </button>

                {/* Test Marks & Rankings */}
                <button
                  onClick={() => onSelectTab('test-marks')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'test-marks'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {isAdmin ? 'Test Marks & Ranks' : 'My Marks & Ranks'}
                </button>

                {/* Online Classes (Google Meet) */}
                <button
                  onClick={() => onSelectTab('online-classes')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'online-classes'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  {content.navigation?.navOnlineClasses || 'Online Classes'}
                </button>

                {/* Gallery */}
                <button
                  onClick={() => onSelectTab('gallery')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'gallery'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                  {content.navigation?.navGallery || 'Gallery'}
                </button>

                {/* Contact */}
                <button
                  onClick={() => onSelectTab('contact')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    currentTab === 'contact'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5 text-purple-600" />
                  {content.navigation?.navContact || 'Contact'}
                </button>

                {/* My Profile (Student Only) */}
                {isStudent && (
                  <button
                    onClick={() => onSelectTab('student-profile')}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      currentTab === 'student-profile'
                        ? 'bg-slate-900 text-white'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-sky-500" />
                    <span>My Profile</span>
                  </button>
                )}

                {/* App Content & Settings (Admin Only) */}
                {isAdmin && (
                  <button
                    onClick={() => onSelectTab('app-settings')}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      currentTab === 'app-settings'
                        ? 'bg-slate-900 text-white'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 text-indigo-600" />
                    {content.navigation?.navAppSettings || 'App Content & Settings'}
                  </button>
                )}
              </>
            )}
          </nav>
        )}

        {/* Right side: Database Info + Notifications + User Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Database Sync: Strictly Admins Only */}
          {currentUser && isAdmin && (
            <button
              onClick={onOpenDbModal}
              title="Database & Storage Info"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Database className="w-3.5 h-3.5" />
              <span>Database Sync</span>
            </button>
          )}

          {/* Notifications Centre Bell Button (STUDENTS ONLY) */}
          {currentUser && isStudent && (
            <button
              onClick={onOpenNotifications}
              title={unreadNotifCount > 0 ? `${unreadNotifCount} unread notifications` : 'Notification Centre'}
              className="relative p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs animate-pulse">
                  {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                </span>
              )}
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <div 
                onClick={() => isStudent && onSelectTab('student-profile')}
                className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-100 text-xs ${
                  isStudent ? 'cursor-pointer hover:bg-slate-200 transition' : ''
                }`}
                title={isStudent ? 'View My Profile' : undefined}
              >
                {isStudent ? (
                  <StudentAvatar 
                    photoUrl={currentUser.data.photoUrl} 
                    name={currentUser.data.name} 
                    size="xs" 
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg text-white flex items-center justify-center font-bold bg-indigo-700">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-800 leading-tight">
                    {isAdmin ? 'Administrator' : currentUser.data.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    {currentUser.role}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log out"
                className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
