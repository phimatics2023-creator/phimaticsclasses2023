import React from 'react';
import { AuthUser, Announcement, Student } from '../types';
import { dataStore } from '../services/storage';
import { useAppContent } from '../context/ContentContext';
import { StudentAvatar } from './StudentAvatar';
import { 
  CalendarCheck2, 
  CreditCard,
  Building2,
  Bell, 
  BookOpen, 
  Video, 
  Image as ImageIcon, 
  PhoneCall, 
  User, 
  Users,
  ChevronRight, 
  Pin, 
  Sparkles,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';

interface HomeViewProps {
  currentUser: AuthUser | null;
  onSelectTab: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenAnnouncement: (announcement: Announcement) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  onSelectTab,
  onOpenLogin,
  onOpenAnnouncement
}) => {
  if (!currentUser) {
    return null;
  }

  const { content } = useAppContent();
  const isAdmin = currentUser.role === 'admin';
  const isStudent = currentUser.role === 'student';

  const announcements = dataStore.getAnnouncements(
    isStudent ? currentUser.data.grade : undefined
  );
  const latestAnnouncement = announcements[0];

  const studentsCount = dataStore.getStudents().length;
  const batchesCount = dataStore.getBatches().length;
  const materialsCount = dataStore.getMaterials().length;
  const totalFeesCollected = dataStore.getFeePayments().filter(p => !p.isReversed).reduce((s, p) => s + p.amount, 0);

  // If student, determine student record
  const currentStudent: Student | undefined = isStudent ? currentUser.data : undefined;

  const studentAttendance = currentStudent 
    ? dataStore.getStudentAttendance(currentStudent.id).stats 
    : null;

  const studentFeeLedger = currentStudent
    ? dataStore.getStudentFeeLedger(currentStudent.id)
    : null;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-36 h-36 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20 backdrop-blur-xs">
              <img src={content.general?.logoUrl || "/phimatics-logo.svg"} alt={content.general?.appName || "PhiMatiCs"} className="w-4 h-4 rounded-xs object-contain" />
              <span>{content.general?.appName || 'PhiMatiCs Classes'}</span>
              <span className="text-sky-300 font-medium text-[11px] border-l border-white/20 pl-2">{content.general?.tagline || 'The Learning App'}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isAdmin && (content.dashboard?.adminWelcome || "Administrator Dashboard")}
              {isStudent && `${content.dashboard?.studentWelcomePrefix || 'Welcome back'}, ${currentUser.data.name}!`}
              {!currentUser && (content.dashboard?.heroHeading || "Welcome to PhiMatiCs Classes")}
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
              {isAdmin && (content.dashboard?.adminSubtitle || "Manage class batches, student attendance logs, monthly tuition fee collections, and study resources across Grades 1 to 12.")}
              {isStudent && `Enrolled in ${currentUser.data.grade} (${currentUser.data.batch}). Check your daily attendance logs, lecture notes, and monthly tuition fee status.`}
              {!currentUser && (content.dashboard?.heroSubtitle || "Tuition classes for Grades 1 to 12 in Mathematics & Science with concept-first teaching and occasional online classes.")}
            </p>
          </div>

          {/* Quick Metrics / Action Card */}
          <div className="shrink-0">
            {isAdmin && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col gap-2 min-w-[220px]">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Enrolled Students:</span>
                  <strong className="text-white font-mono">{studentsCount}</strong>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Class Batches:</span>
                  <strong className="text-white font-mono">{batchesCount}</strong>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Fees Collected:</span>
                  <strong className="text-emerald-400 font-mono">₹{totalFeesCollected.toLocaleString('en-IN')}</strong>
                </div>

                <div className="pt-2 flex gap-1.5">
                  <button
                    onClick={() => onSelectTab('fees')}
                    className="flex-1 py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition text-center cursor-pointer"
                  >
                    Fees
                  </button>
                  <button
                    onClick={() => onSelectTab('attendance')}
                    className="flex-1 py-1.5 px-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold transition text-center cursor-pointer"
                  >
                    Attendance
                  </button>
                </div>
              </div>
            )}

            {isStudent && studentAttendance && studentFeeLedger && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col gap-2.5 min-w-[240px]">
                <div 
                  onClick={() => onSelectTab('student-profile')}
                  className="flex items-center gap-3 pb-2 border-b border-white/10 cursor-pointer hover:opacity-90 transition"
                  title="Click to view My Profile"
                >
                  <StudentAvatar 
                    photoUrl={currentUser.data.photoUrl} 
                    name={currentUser.data.name} 
                    size="md" 
                  />
                  <div className="overflow-hidden">
                    <span className="font-bold text-xs text-white block truncate">{currentUser.data.name}</span>
                    <span className="text-[10px] text-sky-300 font-mono block">{currentUser.data.rollNumber} • {currentUser.data.grade}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Attendance:</span>
                  <span className="text-xs font-mono font-bold text-sky-300">
                    {studentAttendance.percentage}% ({studentAttendance.present}/{studentAttendance.total})
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <span className="text-xs text-slate-300">Fees Cleared Up To:</span>
                  <span className="text-xs font-bold text-emerald-400 truncate max-w-[120px]">
                    {studentFeeLedger.summary.paidUpToMonth}
                  </span>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => onSelectTab('student-profile')}
                    className="flex-1 py-1.5 px-2 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer text-center"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => onSelectTab('fees')}
                    className="flex-1 py-1.5 px-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-medium transition cursor-pointer text-center"
                  >
                    Fees
                  </button>
                </div>
              </div>
            )}

            {!currentUser && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={onOpenLogin}
                  className="py-3 px-5 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  Sign In (Student / Administrator)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Latest Announcement Preview */}
      {latestAnnouncement && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-sky-300 transition group">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                <Pin className="w-3 h-3" />
                Notice
              </span>
              <span className="text-xs text-slate-500">
                {new Date(latestAnnouncement.publishedAt).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <button
              onClick={() => onSelectTab('announcements')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-0.5 cursor-pointer"
            >
              All Notices
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 
            onClick={() => onOpenAnnouncement(latestAnnouncement)}
            className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition cursor-pointer"
          >
            {latestAnnouncement.title}
          </h3>

          <p className="text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {latestAnnouncement.message}
          </p>

          <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Audience: <strong className="text-slate-700">{latestAnnouncement.audience}</strong>
            </span>
            <button
              onClick={() => onOpenAnnouncement(latestAnnouncement)}
              className="text-sky-600 font-semibold hover:underline cursor-pointer"
            >
              Read Full Notice →
            </button>
          </div>
        </div>
      )}

      {/* Quick Access Modules Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
          Academic Modules
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Admin Teacher Management */}
          {isAdmin && (
            <div
              onClick={() => onSelectTab('admin-teachers')}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                  Teacher Management
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Accounts, Teacher IDs & assigned subjects
                </p>
              </div>
            </div>
          )}

          {/* 1. Class Batches */}
          <div
            onClick={() => onSelectTab('batches')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition">
                {isAdmin ? 'Class Batches' : 'My Batch'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Classroom schedule & room
              </p>
            </div>
          </div>

          {/* 2. Attendance */}
          <div
            onClick={() => onSelectTab('attendance')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition">
                {isAdmin ? 'Attendance' : 'My Attendance'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily classroom attendance & %
              </p>
            </div>
          </div>

          {/* 3. Monthly Fees */}
          <div
            onClick={() => onSelectTab('fees')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                Monthly Fees
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ledger, receipts & dues
              </p>
            </div>
          </div>

          {/* 4. Announcements */}
          <div
            onClick={() => onSelectTab('announcements')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition">
                Announcements
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Circulars & test dates
              </p>
            </div>
          </div>

          {/* 5. Study Materials */}
          <div
            onClick={() => onSelectTab('materials')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                Study Materials
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                PDF notes & formula sheets
              </p>
            </div>
          </div>

          {/* Test Marks & Rankings */}
          <div
            onClick={() => onSelectTab('test-marks')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition">
                {isAdmin ? 'Test Marks & Ranks' : 'My Marks & Ranks'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAdmin ? 'Marks entry, test & monthly rankings' : 'View test scores, % & ranks'}
              </p>
            </div>
          </div>

          {/* 6. Online Classes */}
          <div
            onClick={() => onSelectTab('online-classes')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-500 transition">
                Online Classes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Google Meet sessions
              </p>
            </div>
          </div>

          {/* 7. Gallery */}
          <div
            onClick={() => onSelectTab('gallery')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-600 transition">
                Gallery
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Events & achievements
              </p>
            </div>
          </div>

          {/* 8. Contact */}
          <div
            onClick={() => onSelectTab('contact')}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition">
                Contact & Centre
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Phone, WhatsApp & Location
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
