import React from 'react';
import { AuthUser } from '../types';
import { 
  Home, 
  CalendarCheck2, 
  CreditCard, 
  Building2, 
  Menu,
  Bell,
  BookOpen,
  Video
} from 'lucide-react';

import { useAppContent } from '../context/ContentContext';

interface BottomNavProps {
  currentUser: AuthUser | null;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMoreMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onOpenMoreMenu
}) => {
  if (!currentUser) {
    return null;
  }

  const { content } = useAppContent();
  const isAdmin = currentUser.role === 'admin';
  const isTeacher = currentUser.role === 'teacher';

  if (isTeacher) {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
        <div className="flex items-center justify-around">
          <button
            onClick={() => onSelectTab('announcements')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${
              currentTab === 'announcements' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Notice</span>
          </button>

          <button
            onClick={() => onSelectTab('materials')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${
              currentTab === 'materials' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Notes</span>
          </button>

          <button
            onClick={() => onSelectTab('online-classes')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition cursor-pointer ${
              currentTab === 'online-classes' ? 'text-rose-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Video className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Classes</span>
          </button>

          <button
            onClick={onOpenMoreMenu}
            className="flex flex-col items-center py-1 px-3 rounded-xl transition text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Account</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer ${
            currentTab === 'home'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isAdmin ? 'Dashboard' : (content.navigation?.navHome || 'Home')}</span>
        </button>

        {/* Batches */}
        <button
          onClick={() => onSelectTab('batches')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer ${
            currentTab === 'batches'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isAdmin ? (content.navigation?.navBatches || 'Batches') : 'My Batch'}</span>
        </button>

        {/* Attendance */}
        <button
          onClick={() => onSelectTab('attendance')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer ${
            currentTab === 'attendance'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CalendarCheck2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isAdmin ? (content.navigation?.navAttendance || 'Attendance') : 'Attend.'}</span>
        </button>

        {/* Monthly Fees */}
        <button
          onClick={() => onSelectTab('fees')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer ${
            currentTab === 'fees'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{content.navigation?.navFees || 'Fees'}</span>
        </button>

        {/* More Menu */}
        <button
          onClick={onOpenMoreMenu}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition cursor-pointer ${
            ['announcements', 'materials', 'test-marks', 'online-classes', 'gallery', 'contact', 'admin-students', 'admin-teachers', 'app-settings'].includes(currentTab)
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </div>
    </div>
  );
};
