import React from 'react';
import { AuthUser } from '../types';
import { 
  X, 
  Image as ImageIcon, 
  PhoneCall, 
  Database, 
  LogOut, 
  LogIn, 
  User, 
  Users,
  ShieldCheck, 
  ChevronRight, 
  BookOpen, 
  CalendarCheck2, 
  Bell,
  Video,
  CreditCard,
  Building2,
  Settings,
  Award,
  KeyRound
} from 'lucide-react';
import { dataStore } from '../services/storage';

import { useAppContent } from '../context/ContentContext';
import { Logo } from './Logo';
import { StudentAvatar } from './StudentAvatar';

interface MobileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onSelectTab: (tab: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenDbModal: () => void;
  onOpenNotifications?: () => void;
  onOpenChangePassword?: () => void;
}

export const MobileMenuModal: React.FC<MobileMenuModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectTab,
  onOpenLogin,
  onLogout,
  onOpenDbModal,
  onOpenNotifications,
  onOpenChangePassword
}) => {
  const { content } = useAppContent();
  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';
  const studentId = isStudent ? currentUser.data.id : undefined;
  const unreadNotifCount = dataStore.getUnreadNotificationCount(studentId);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <Logo size="sm" showSubtitle={true} isDark={true} />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        {currentUser ? (
          <div 
            onClick={() => isStudent && handleAction(() => onSelectTab('student-profile'))}
            className={`p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3 ${
              isStudent ? 'cursor-pointer hover:bg-slate-100 transition' : ''
            }`}
          >
            {isStudent ? (
              <StudentAvatar 
                photoUrl={currentUser.data.photoUrl} 
                name={currentUser.data.name} 
                size="md" 
              />
            ) : (
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 ${
                isAdmin ? 'bg-indigo-700' : 'bg-sky-600'
              }`}>
                {isAdmin && <ShieldCheck className="w-5 h-5" />}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-slate-900 truncate">
                {currentUser.data.name}
              </h4>
              <p className="text-xs text-slate-500 truncate uppercase font-semibold">
                Role: {currentUser.role} {isStudent && '• Tap for Profile'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-sky-50 border-b border-sky-100 flex items-center justify-between">
            <div className="text-xs text-sky-900">
              <p className="font-semibold">Guest View</p>
              <p className="text-[11px] text-sky-700">Sign in to check attendance & fees</p>
            </div>
            <button
              onClick={() => handleAction(onOpenLogin)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Navigation list */}
        <div className="p-3 space-y-1 overflow-y-auto">
          {/* Student My Profile Link */}
          {isStudent && (
            <button
              onClick={() => handleAction(() => onSelectTab('student-profile'))}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer bg-sky-50/60 border border-sky-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">My Profile</span>
                  <span className="text-[10px] text-slate-500 block">View details & change profile photo</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {/* Admin Links */}
          {isAdmin && (
            <>
              <button
                onClick={() => handleAction(() => onSelectTab('admin-students'))}
                className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Manage Students</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleAction(() => onSelectTab('admin-teachers'))}
                className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>Manage Teachers</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}

          {/* Batches (Admin & Student) */}
          {!isTeacher && (
            <button
              onClick={() => handleAction(() => onSelectTab('batches'))}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>{isAdmin ? (content.navigation?.navBatches || 'Batches') : 'My Batch'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          <button
            onClick={() => handleAction(() => onSelectTab('announcements'))}
            className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <span>{content.navigation?.navAnnouncements || 'Announcements'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleAction(() => onSelectTab('materials'))}
            className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span>{content.navigation?.navMaterials || 'Study Materials'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleAction(() => onSelectTab('online-classes'))}
            className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <span>{content.navigation?.navOnlineClasses || 'Online Classes'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Test Marks & Rankings (Student & Admin) */}
          {!isTeacher && (
            <button
              onClick={() => handleAction(() => onSelectTab('test-marks'))}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span>{isAdmin ? 'Test Marks & Ranks' : 'My Marks & Ranks'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {!isTeacher && (
            <>
              <button
                onClick={() => handleAction(() => onSelectTab('gallery'))}
                className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span>{content.navigation?.navGallery || 'Activity Gallery'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleAction(() => onSelectTab('contact'))}
                className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span>{content.navigation?.navContact || 'Contact & Directions'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}

          {/* Notifications Centre (STUDENTS ONLY) */}
          {isStudent && (
            <button
              onClick={() => handleAction(() => onOpenNotifications && onOpenNotifications())}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center relative">
                  <Bell className="w-4 h-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>Notification Centre</span>
                  {unreadNotifCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {unreadNotifCount} new
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleAction(() => onSelectTab('app-settings'))}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <span>{content.navigation?.navAppSettings || 'App Content & Settings'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {/* Strictly Admin Only: Database & Backup Information (Requirement 5) */}
          {isAdmin && (
            <button
              onClick={() => handleAction(onOpenDbModal)}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <span>Database & Backup Info</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {/* Change Password (Student & Admin - Requirement 7) */}
          {currentUser && onOpenChangePassword && (
            <button
              onClick={() => handleAction(onOpenChangePassword)}
              className="w-full p-2.5 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between text-left text-sm text-slate-800 font-medium cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <span>Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {currentUser && (
            <button
              onClick={() => handleAction(onLogout)}
              className="w-full p-2.5 rounded-2xl hover:bg-rose-50 transition flex items-center gap-3 text-left text-sm text-rose-600 font-medium mt-2 pt-3 border-t border-slate-100 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
