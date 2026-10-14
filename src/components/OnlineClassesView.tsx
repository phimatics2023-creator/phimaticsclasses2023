import React, { useState } from 'react';
import { AuthUser, OnlineClass, ClassType, ClassScheduleStatus } from '../types';
import { dataStore, ALL_GRADES, normalizeGrade } from '../services/storage';
import { useAppContent } from '../context/ContentContext';
import { 
  Video, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Trash2, 
  Info, 
  X,
  BookOpen,
  MapPin,
  Edit3,
  CalendarX2,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

interface OnlineClassesViewProps {
  currentUser: AuthUser | null;
}

export const OnlineClassesView: React.FC<OnlineClassesViewProps> = ({ currentUser }) => {
  const { content } = useAppContent();
  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';

  const canManage = isAdmin || (isTeacher && currentUser.data.permissions?.canScheduleClasses);

  const classes = dataStore.getOnlineClasses();
  const allBatches = dataStore.getBatches();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Online' | 'In-Person'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterGrade, setFilterGrade] = useState<string>('All');

  // Schedule / Edit Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('Grade 10');
  const [batch, setBatch] = useState('All');
  const [subject, setSubject] = useState('Mathematics');
  const [date, setDate] = useState('2026-10-16');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:30');
  const [classType, setClassType] = useState<ClassType>('Online');
  const [meetUrl, setMeetUrl] = useState('https://meet.google.com/phi-classes');
  const [venue, setVenue] = useState('PhiMatiCs Main Classroom Room 1');
  const [instructions, setInstructions] = useState('');
  const [status, setStatus] = useState<ClassScheduleStatus>('scheduled');
  const [modalError, setModalError] = useState<string | null>(null);

  // Cancel Modal State
  const [cancellingClass, setCancellingClass] = useState<OnlineClass | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Determine allowed grades for teachers
  const allowedGrades = isTeacher ? (currentUser.data.assignedGrades || ALL_GRADES) : ALL_GRADES;

  // Filter batches for selected grade
  const batchesForGrade = allBatches.filter(b => normalizeGrade(b.grade) === normalizeGrade(grade));

  const handleOpenAdd = () => {
    setEditingClassId(null);
    setTitle('');
    const defaultGrade = allowedGrades[0] || 'Grade 10';
    setGrade(defaultGrade);
    const matchingBatches = allBatches.filter(b => normalizeGrade(b.grade) === normalizeGrade(defaultGrade));
    setBatch(matchingBatches[0]?.name || 'All');
    setSubject(isTeacher ? (currentUser.data.assignedSubjects[0] || 'Mathematics') : 'Mathematics');
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('17:00');
    setEndTime('18:30');
    setClassType('Online');
    setMeetUrl('https://meet.google.com/phi-classes');
    setVenue('PhiMatiCs Main Classroom');
    setInstructions('');
    setStatus('scheduled');
    setModalError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (c: OnlineClass) => {
    setEditingClassId(c.id);
    setTitle(c.title);
    setGrade(normalizeGrade(c.grade));
    setBatch(c.batch);
    setSubject(c.subject);
    setDate(c.date);
    setStartTime(c.startTime || '17:00');
    setEndTime(c.endTime || '18:30');
    setClassType(c.classType || 'Online');
    setMeetUrl(c.meetUrl || '');
    setVenue(c.instructions || 'PhiMatiCs Main Classroom');
    setInstructions(c.instructions || '');
    setStatus(c.status || 'scheduled');
    setModalError(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!title.trim()) {
      setModalError('Class title is required.');
      return;
    }

    if (classType === 'Online' && !meetUrl.trim()) {
      setModalError('Meeting URL is required for online classes.');
      return;
    }

    const formatTime = (t: string) => {
      const [h, m] = t.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${m} ${ampm}`;
    };

    const formattedTimeRange = `${formatTime(startTime)} – ${formatTime(endTime)}`;
    const teacherName = isTeacher ? currentUser.data.name : (isAdmin ? 'Administrator' : undefined);
    const teacherId = isTeacher ? currentUser.data.teacherId : undefined;

    if (editingClassId) {
      dataStore.updateScheduledClass(editingClassId, {
        title: title.trim(),
        grade: normalizeGrade(grade),
        batch,
        subject: subject.trim(),
        date,
        startTime,
        endTime,
        time: formattedTimeRange,
        classType,
        meetUrl: classType === 'Online' ? meetUrl.trim() : (venue.trim() || 'In-Person Academy Room'),
        instructions: instructions.trim() || undefined,
        status
      });
    } else {
      dataStore.scheduleClass({
        title: title.trim(),
        grade: normalizeGrade(grade),
        batch,
        subject: subject.trim(),
        date,
        startTime,
        endTime,
        time: formattedTimeRange,
        classType,
        meetUrl: classType === 'Online' ? meetUrl.trim() : (venue.trim() || 'In-Person Academy Room'),
        instructions: instructions.trim() || undefined,
        status: 'scheduled',
        isPublished: true,
        teacherId,
        teacherName
      });
    }

    setIsFormOpen(false);
  };

  const handleConfirmCancel = () => {
    if (!cancellingClass) return;
    dataStore.cancelScheduledClass(cancellingClass.id, cancelReason.trim());
    setCancellingClass(null);
    setCancelReason('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this class session completely?')) {
      dataStore.deleteOnlineClass(id);
    }
  };

  // Filtered classes list
  const filteredClasses = classes.filter(c => {
    const matchQuery = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.instructorName && c.instructorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.teacherName && c.teacherName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchType = filterType === 'All' || (c.classType || 'Online') === filterType;
    const matchStatus = filterStatus === 'All' || (c.status || 'scheduled') === filterStatus;
    const matchGrade = filterGrade === 'All' || normalizeGrade(c.grade) === normalizeGrade(filterGrade);

    return matchQuery && matchType && matchStatus && matchGrade;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200 uppercase tracking-wider">
              Academic Schedule
            </span>
            {isTeacher && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Faculty Portal
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Scheduled Classes & Live Sessions
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {isStudent 
              ? 'View upcoming and scheduled classes for your grade and batch with live meeting links and classroom notices.'
              : 'Schedule, reschedule, manage, and coordinate online Google Meet and in-person lectures for assigned batches.'}
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>Schedule New Class</span>
          </button>
        )}
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs shadow-xs flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-slate-600 leading-relaxed">
          <strong className="text-slate-900 block mb-0.5">PhiMatiCs Classes Academic Timetable</strong>
          Lectures are scheduled in accordance with concept-first mastery. Online classes are hosted via Google Meet, while in-person sessions take place at the institute centre. Enrolled students receive instant schedule notifications.
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search classes by topic, subject, or faculty..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Class Type Filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer"
          >
            <option value="All">All Types (Online & In-Person)</option>
            <option value="Online">Online Sessions Only</option>
            <option value="In-Person">In-Person Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Grade Filter (for Admins / Teachers) */}
          {!isStudent && (
            <select
              value={filterGrade}
              onChange={e => setFilterGrade(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="All">All Grades</option>
              {allowedGrades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-500 text-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No classes found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {isStudent 
              ? 'No classes are scheduled for your enrolled grade and batch at this time. Check back shortly!'
              : 'No scheduled sessions match the filter criteria. Click "Schedule New Class" to set up a lecture.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClasses.map(c => {
            const isOnline = (c.classType || 'Online') === 'Online';
            const classStatus = c.status || 'scheduled';
            const teacherName = c.teacherName || c.instructorName || 'Faculty Member';

            return (
              <div
                key={c.id}
                className={`bg-white p-5 rounded-2xl border shadow-xs transition flex flex-col justify-between ${
                  classStatus === 'cancelled'
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                <div>
                  {/* Top Tags & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Type Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isOnline 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isOnline ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        <span>{isOnline ? 'Online Meet' : 'In-Person'}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700">
                        {c.grade}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                        {c.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {c.batch}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {classStatus === 'scheduled' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          Scheduled
                        </span>
                      )}
                      {classStatus === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700">
                          Completed
                        </span>
                      )}
                      {classStatus === 'cancelled' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {c.title}
                  </h3>

                  {/* Session Timing & Teacher Info */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>Date: <strong className="text-slate-800">{c.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Time: <strong className="text-slate-800">{c.time || `${c.startTime} - ${c.endTime}`}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Faculty In-Charge: <strong className="text-slate-800">{teacherName}</strong></span>
                    </div>
                  </div>

                  {/* Instructions / Notes */}
                  {c.instructions && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <span className="font-bold text-slate-700 block text-[11px] mb-0.5">Instructions:</span>
                      <p>{c.instructions}</p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    {isOnline && classStatus !== 'cancelled' ? (
                      <a
                        href={c.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Online Class</span>
                        <ExternalLink className="w-3 h-3 text-sky-200" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        {!isOnline ? <MapPin className="w-3 h-3 text-slate-400" /> : null}
                        <span>{!isOnline ? (c.meetUrl || 'In-Person Class at Academy') : 'Session Cancelled'}</span>
                      </span>
                    )}
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        title="Edit / Reschedule Class"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {classStatus !== 'cancelled' && (
                        <button
                          onClick={() => setCancellingClass(c)}
                          title="Cancel Class"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                        >
                          <CalendarX2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(c.id)}
                        title="Delete Class"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule / Edit Class Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">
                  {editingClassId ? 'Edit / Reschedule Class' : 'Schedule New Class'}
                </h3>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Class Title */}
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Class Title / Topic *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Physics Optics Ray Diagrams & Numerical Problems"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Class Type Selector */}
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Class Delivery Mode *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setClassType('Online')}
                    className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      classType === 'Online'
                        ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Online (Google Meet)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClassType('In-Person')}
                    className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      classType === 'In-Person'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>In-Person (Academy)</span>
                  </button>
                </div>
              </div>

              {/* Grade and Subject */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Grade (1 to 12) *
                  </label>
                  <select
                    value={grade}
                    onChange={e => {
                      const newG = e.target.value;
                      setGrade(newG);
                      const matching = allBatches.filter(b => normalizeGrade(b.grade) === normalizeGrade(newG));
                      setBatch(matching[0]?.name || 'All');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    {allowedGrades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Batch */}
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Target Batch *
                </label>
                <select
                  value={batch}
                  onChange={e => setBatch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="All">All Batches in {grade}</option>
                  {batchesForGrade.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Date & Times */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    className="w-full px-2 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">Start Time *</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">End Time *</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Online Meeting URL or In-Person Venue */}
              {classType === 'Online' ? (
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Google Meet URL / Meeting Link *
                  </label>
                  <input
                    type="url"
                    value={meetUrl}
                    onChange={e => setMeetUrl(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Classroom / Venue Location
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    placeholder="e.g. Academy Main Hall, Room 2"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              )}

              {/* Instructions */}
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Description / Instructions for Students
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="e.g. Keep formula booklet and notebook ready for numerical practice..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {/* Status if editing */}
              {editingClassId && (
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Class Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                >
                  {editingClassId ? 'Update & Notify' : 'Schedule Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Class Modal */}
      {cancellingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarX2 className="w-5 h-5" />
                <h3 className="font-bold text-sm">Cancel Scheduled Class</h3>
              </div>
              <button onClick={() => setCancellingClass(null)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-700">
                Are you sure you want to cancel <strong>{cancellingClass.title}</strong> scheduled for <strong>{cancellingClass.date}</strong>?
              </p>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">
                  Reason for Cancellation (sent to enrolled students):
                </label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="e.g. Rescheduled due to teacher illness / institutional holiday..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancellingClass(null)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-5 py-2 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-500 cursor-pointer shadow-xs"
                >
                  Confirm Cancellation & Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
