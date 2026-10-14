import React, { useState, useEffect } from 'react';
import { AuthUser, AttendanceStatus, AttendanceRecord } from '../types';
import { dataStore, ALL_GRADES } from '../services/storage';
import { useAppContent } from '../context/ContentContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Users, 
  CheckCheck, 
  Save, 
  History, 
  AlertCircle,
  Download,
  Search,
  Edit3,
  Filter,
  Info,
  Building2,
  ArrowRightLeft,
  LogIn,
  LogOut,
  Send
} from 'lucide-react';

interface AttendanceViewProps {
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  currentUser,
  onOpenLogin
}) => {
  const { content } = useAppContent();
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  // Admin marking state
  const [adminSubTab, setAdminSubTab] = useState<'mark' | 'history' | 'entry_exit'>('mark');
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 10');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  
  // Entry & Exit tracking states
  const [eeStudentSearch, setEeStudentSearch] = useState('');
  const [eeGradeFilter, setEeGradeFilter] = useState('All');
  const [eeBatchFilter, setEeBatchFilter] = useState('All');
  const [eeCustomTime, setEeCustomTime] = useState('');
  
  // Mapping of studentId -> AttendanceStatus
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [existingRecordCount, setExistingRecordCount] = useState<number>(0);
  const [confirmationMsg, setConfirmationMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Search in reports
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [reportDateFilter, setReportDateFilter] = useState('');
  const [reportGradeFilter, setReportGradeFilter] = useState('All');

  const allStudents = dataStore.getStudents();
  const allBatches = dataStore.getBatches();
  const allAttendance = dataStore.getAttendanceRecords();

  const filteredBatches = allBatches.filter(b => {
    if (selectedGrade !== 'All' && b.grade !== selectedGrade) return false;
    return true;
  });

  // Set default batch when grade or batches change
  useEffect(() => {
    if (filteredBatches.length > 0 && (!selectedBatch || !filteredBatches.some(b => b.name === selectedBatch))) {
      setSelectedBatch(filteredBatches[0].name);
    }
  }, [selectedGrade, filteredBatches, selectedBatch]);

  // Active students enrolled in the selected batch
  const studentsInBatch = allStudents.filter(s => 
    s.status === 'active' && 
    (selectedGrade === 'All' || s.grade === selectedGrade) &&
    s.batch === selectedBatch
  );

  // Load existing records whenever date, grade or batch changes
  useEffect(() => {
    if (!isAdmin) return;

    const existing = allAttendance.filter(a => 
      a.date === selectedDate && 
      a.batch === selectedBatch
    );

    setExistingRecordCount(existing.length);

    const initialMap: Record<string, AttendanceStatus> = {};
    existing.forEach(rec => {
      initialMap[rec.studentId] = rec.status;
    });

    studentsInBatch.forEach(stu => {
      if (!initialMap[stu.id]) {
        initialMap[stu.id] = 'present';
      }
    });

    setStatusMap(initialMap);

    if (existing.length > 0) {
      setConfirmationMsg({
        type: 'info',
        text: `Attendance session exists for ${selectedDate} (${existing.length} records). You can review or correct them.`
      });
    } else {
      setConfirmationMsg(null);
    }
  }, [selectedDate, selectedGrade, selectedBatch, isAdmin]);

  const handleSetStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = { ...statusMap };
    studentsInBatch.forEach(stu => {
      updated[stu.id] = 'present';
    });
    setStatusMap(updated);
  };

  const handleSaveAttendance = () => {
    if (studentsInBatch.length === 0) {
      alert('No active students found in this batch to mark.');
      return;
    }

    if (existingRecordCount > 0) {
      const confirmUpdate = confirm(
        `Attendance for ${selectedBatch} on ${selectedDate} already exists. Do you want to update and save these records?`
      );
      if (!confirmUpdate) return;
    }

    const actorName = 'Administrator';

    const payload = studentsInBatch.map(stu => ({
      studentId: stu.id,
      status: statusMap[stu.id] || 'present'
    }));

    const result = dataStore.saveBatchAttendance(
      selectedDate,
      selectedGrade,
      selectedBatch,
      payload,
      actorName
    );

    setConfirmationMsg({
      type: 'success',
      text: `Attendance saved successfully for ${selectedDate}! (${result.savedCount} newly recorded, ${result.updatedCount} updated). Marked by: ${actorName}.`
    });

    setExistingRecordCount(studentsInBatch.length);

    setTimeout(() => {
      setConfirmationMsg(null);
    }, 6000);
  };

  const handleExportCsv = () => {
    const csvData = dataStore.exportAttendanceCsv(allAttendance);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phimatics_attendance_${selectedDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If user is not logged in
  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-lg mx-auto shadow-sm my-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Attendance Portal</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Students and authorized parents can view attendance records and percentages. The administrator marks and manages daily class batch attendance.
        </p>
        <button
          onClick={onOpenLogin}
          className="mt-2 py-2.5 px-6 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition cursor-pointer"
        >
          Sign In to Access Attendance
        </button>
      </div>
    );
  }

  // STUDENT READ-ONLY VIEW (Also used by parents logging into student account)
  if (isStudent) {
    const studentIdToView = currentUser.data.id;
    const currentStudent = dataStore.getStudentById(studentIdToView) || currentUser.data;
    const { records, stats } = dataStore.getStudentAttendance(studentIdToView);

    return (
      <div className="space-y-6 pb-20 md:pb-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Attendance Record
            </h1>
            <p className="text-sm text-slate-600">
              {currentStudent.name} ({currentStudent.rollNumber}) • {currentStudent.grade} • {currentStudent.batch}
            </p>
          </div>

          <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
            Read-Only Student & Parent Portal
          </div>
        </div>

        {/* Attendance Summary Stat Card */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-3xl p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                Attendance Standing (75% Minimum Required)
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl md:text-5xl font-black font-mono">
                  {stats.percentage}%
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  stats.percentage >= 75 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {stats.percentage >= 75 ? 'Good Standing' : 'Below 75% Requirement'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Batch: {currentStudent.batch}
              </p>
            </div>

            {/* Micro stats grid */}
            <div className="grid grid-cols-4 gap-2 bg-white/10 rounded-2xl p-3 border border-white/15 text-center">
              <div>
                <div className="text-lg font-bold text-white">{stats.total}</div>
                <div className="text-[10px] text-slate-300 uppercase">Conducted</div>
              </div>
              <div className="border-l border-white/10">
                <div className="text-lg font-bold text-emerald-400">{stats.present}</div>
                <div className="text-[10px] text-slate-300 uppercase">Attended</div>
              </div>
              <div className="border-l border-white/10">
                <div className="text-lg font-bold text-rose-400">{stats.absent}</div>
                <div className="text-[10px] text-slate-300 uppercase">Absences</div>
              </div>
              <div className="border-l border-white/10">
                <div className="text-lg font-bold text-amber-400">{stats.leave}</div>
                <div className="text-[10px] text-slate-300 uppercase">Approved Leave</div>
              </div>
            </div>
          </div>
        </div>

        {/* Date-by-date list */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              Date-wise Class Session Attendance
            </h3>
            <span className="text-xs text-slate-500">{records.length} sessions logged</span>
          </div>

          {records.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No attendance records recorded yet for this student.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {records.map(rec => {
                const dateObj = new Date(rec.date);
                const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
                const formattedDate = dateObj.toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                });

                return (
                  <div key={rec.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-700">
                        <span className="text-[9px] uppercase font-bold text-slate-400">{dayName}</span>
                        <span className="text-xs font-bold leading-none">{rec.date.split('-')[2]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{formattedDate}</div>
                        <div className="text-xs text-slate-500">
                          {rec.batch} • Recorded by: {rec.recordedBy}
                        </div>
                      </div>
                    </div>

                    <div>
                      {rec.status === 'present' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Present
                        </span>
                      )}
                      {rec.status === 'absent' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </span>
                      )}
                      {rec.status === 'leave' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          On Leave
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ADMINISTRATOR VIEW
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Title & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{content.attendance?.pageTitle || 'Attendance Management'}</h1>
          <p className="text-sm text-slate-600">
            {content.attendance?.pageSubtitle || 'Mark daily class batch attendance across Grades 1 to 10, review duplicate-prevented logs, and export CSV reports.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setAdminSubTab('mark')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === 'mark'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Daily Attendance & Gate Control
            </button>
            <button
              onClick={() => setAdminSubTab('history')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                adminSubTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Reports & CSV
            </button>
          </div>
        </div>
      </div>

      {confirmationMsg && (
        <div className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2.5 ${
          confirmationMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : confirmationMsg.type === 'info'
            ? 'bg-sky-50 text-sky-800 border border-sky-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {confirmationMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
          {confirmationMsg.type === 'info' && <Info className="w-4 h-4 shrink-0 text-sky-600" />}
          {confirmationMsg.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
          <span>{confirmationMsg.text}</span>
        </div>
      )}

      {adminSubTab === 'mark' ? (
        <div className="space-y-5">
          {/* Controls Bar: Grade (1 to 10), Batch, Date */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Grade Selector: Grade 1 through Grade 10 */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                1. Select Grade (Grades 1–10)
              </label>
              <select
                value={selectedGrade}
                onChange={e => {
                  setSelectedGrade(e.target.value);
                  const matchingBatches = allBatches.filter(b => b.grade === e.target.value);
                  if (matchingBatches.length > 0) {
                    setSelectedBatch(matchingBatches[0].name);
                  }
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
              >
                {ALL_GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Class Batch Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                2. Class Batch
              </label>
              <select
                value={selectedBatch}
                onChange={e => setSelectedBatch(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
              >
                {filteredBatches.length > 0 ? (
                  filteredBatches.map(b => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))
                ) : (
                  <option value="">No batches defined for {selectedGrade}</option>
                )}
              </select>
            </div>

            {/* Class Date Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                3. Class Session Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          {/* Students Marking Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Enrolled Students ({studentsInBatch.length} Students)
                </h3>
                <p className="text-xs text-slate-500">
                  Date: <strong className="text-slate-800">{selectedDate}</strong> • {selectedBatch}
                </p>
              </div>

              {studentsInBatch.length > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark All Present
                </button>
              )}
            </div>

            {studentsInBatch.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No active students currently enrolled in {selectedBatch || selectedGrade}.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {studentsInBatch.map((stu, index) => {
                  const todayRecords = dataStore.getEntryExitRecords(selectedDate);
                  const entryExitRec = todayRecords.find(r => r.studentId === stu.id);
                  const attRec = allAttendance.find(a => a.studentId === stu.id && a.date === selectedDate);

                  // Determine Unified Status
                  let statusBadgeText = 'Not Marked';
                  let statusBadgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';

                  if (attRec?.status === 'absent') {
                    statusBadgeText = 'Absent';
                    statusBadgeStyle = 'bg-rose-100 text-rose-800 border-rose-200';
                  } else if (entryExitRec?.status === 'Exited' || (entryExitRec?.entryTime && entryExitRec?.exitTime)) {
                    statusBadgeText = 'Present — Exited';
                    statusBadgeStyle = 'bg-sky-100 text-sky-800 border-sky-200';
                  } else if (entryExitRec?.status === 'Present' || entryExitRec?.entryTime || attRec?.status === 'present') {
                    statusBadgeText = 'Present — On Site';
                    statusBadgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  }

                  const handleEntryClick = () => {
                    const res = dataStore.markStudentEntry(stu.id);
                    if (res.success) {
                      setConfirmationMsg({ type: 'success', text: res.message });
                    } else {
                      setConfirmationMsg({ type: 'error', text: res.message });
                    }
                    setTimeout(() => setConfirmationMsg(null), 4000);
                  };

                  const handleExitClick = () => {
                    const res = dataStore.markStudentExit(stu.id);
                    if (res.success) {
                      setConfirmationMsg({ type: 'success', text: res.message });
                    } else {
                      setConfirmationMsg({ type: 'error', text: res.message });
                    }
                    setTimeout(() => setConfirmationMsg(null), 4000);
                  };

                  const handleAbsentClick = () => {
                    if (entryExitRec?.entryTime) {
                      const confirmOverride = confirm(
                        `Student "${stu.name}" already has an entry timestamp recorded at ${entryExitRec.entryTime}.\n\nAre you sure you want to override and mark this student as Absent?`
                      );
                      if (!confirmOverride) return;
                    }

                    const res = dataStore.markStudentAbsent(stu.id, selectedDate);
                    if (res.success) {
                      setConfirmationMsg({ type: 'info', text: res.message });
                    } else {
                      setConfirmationMsg({ type: 'error', text: res.message });
                    }
                    setTimeout(() => setConfirmationMsg(null), 4000);
                  };

                  return (
                    <div 
                      key={stu.id} 
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
                    >
                      {/* Left: Avatar + Details + Timestamps */}
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center text-xs font-mono text-slate-400 shrink-0">
                          {index + 1}
                        </span>

                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 shrink-0">
                          {stu.photoUrl ? (
                            <img src={stu.photoUrl} alt={stu.name} className="w-full h-full object-cover" />
                          ) : (
                            stu.name.charAt(0)
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            <span>{stu.name}</span>
                            <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              {stu.rollNumber}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusBadgeStyle}`}>
                              {statusBadgeText}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                            <span>{stu.grade} • {stu.batch}</span>
                            {entryExitRec?.entryTime && (
                              <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                                Entry: {entryExitRec.entryTime}
                              </span>
                            )}
                            {entryExitRec?.exitTime && (
                              <span className="font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                                Exit: {entryExitRec.exitTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: 3 Action Buttons (Entry, Exit, Absent) */}
                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={handleEntryClick}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                          title="Record student gate entry time and send parent notification"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          Entry
                        </button>

                        <button
                          type="button"
                          onClick={handleExitClick}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                          title="Record student departure exit time and send parent notification"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Exit
                        </button>

                        <button
                          type="button"
                          onClick={handleAbsentClick}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
                          title="Mark student as Absent for this session"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Save Bar */}
            {studentsInBatch.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {existingRecordCount > 0 
                    ? `⚠️ ${existingRecordCount} existing records will be updated.` 
                    : 'Records are saved to persistent database with audit stamp.'}
                </span>

                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-sky-400" />
                  Save Attendance Records
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* REPORTS, SEARCH & CSV EXPORT TAB */
        <div className="space-y-5">
          {/* Search & Export Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={reportSearchQuery}
                  onChange={e => setReportSearchQuery(e.target.value)}
                  placeholder="Search student, roll no, batch..."
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 w-56 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Grade filter */}
              <select
                value={reportGradeFilter}
                onChange={e => setReportGradeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value="All">All Grades (1–10)</option>
                {ALL_GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <input
                type="date"
                value={reportDateFilter}
                onChange={e => setReportDateFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
              />
              {reportDateFilter && (
                <button
                  onClick={() => setReportDateFilter('')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Clear Date
                </button>
              )}
            </div>

            <button
              onClick={handleExportCsv}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export to CSV
            </button>
          </div>

          {/* Summary Counters Card */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Present</span>
              <div className="text-xl font-black text-emerald-600 font-mono mt-0.5">
                {allStudents.filter(s => {
                  if (s.status === 'archived') return false;
                  const targetDate = reportDateFilter || selectedDate;
                  const ee = dataStore.getEntryExitRecords(targetDate).find(r => r.studentId === s.id);
                  const att = allAttendance.find(a => a.studentId === s.id && a.date === targetDate);
                  return att?.status === 'present' || ee?.entryTime || ee?.status === 'Present' || ee?.status === 'Exited';
                }).length}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Absent</span>
              <div className="text-xl font-black text-rose-600 font-mono mt-0.5">
                {allStudents.filter(s => {
                  if (s.status === 'archived') return false;
                  const targetDate = reportDateFilter || selectedDate;
                  const att = allAttendance.find(a => a.studentId === s.id && a.date === targetDate);
                  return att?.status === 'absent';
                }).length}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Not Marked</span>
              <div className="text-xl font-black text-slate-500 font-mono mt-0.5">
                {allStudents.filter(s => {
                  if (s.status === 'archived') return false;
                  const targetDate = reportDateFilter || selectedDate;
                  const ee = dataStore.getEntryExitRecords(targetDate).find(r => r.studentId === s.id);
                  const att = allAttendance.find(a => a.studentId === s.id && a.date === targetDate);
                  return !att && !ee?.entryTime;
                }).length}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Currently On Site</span>
              <div className="text-xl font-black text-sky-600 font-mono mt-0.5">
                {allStudents.filter(s => {
                  if (s.status === 'archived') return false;
                  const targetDate = reportDateFilter || selectedDate;
                  const ee = dataStore.getEntryExitRecords(targetDate).find(r => r.studentId === s.id);
                  return ee?.entryTime && !ee?.exitTime;
                }).length}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Exited</span>
              <div className="text-xl font-black text-indigo-600 font-mono mt-0.5">
                {allStudents.filter(s => {
                  if (s.status === 'archived') return false;
                  const targetDate = reportDateFilter || selectedDate;
                  const ee = dataStore.getEntryExitRecords(targetDate).find(r => r.studentId === s.id);
                  return ee?.exitTime || ee?.status === 'Exited';
                }).length}
              </div>
            </div>
          </div>

          {/* Cumulative Student Attendance Register */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">
                Student Cumulative Attendance Register
              </h3>
              <p className="text-xs text-slate-500">
                Calculated from persisted class session records across Grades 1 to 10
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs text-slate-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Grade & Batch</th>
                    <th className="py-3 px-4 text-center">Conducted</th>
                    <th className="py-3 px-4 text-center">Attended</th>
                    <th className="py-3 px-4 text-center">Absences</th>
                    <th className="py-3 px-4 text-right">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allStudents
                    .filter(s => {
                      if (reportGradeFilter !== 'All' && s.grade !== reportGradeFilter) return false;
                      if (!reportSearchQuery) return true;
                      const q = reportSearchQuery.toLowerCase();
                      return s.name.toLowerCase().includes(q) || 
                        s.rollNumber.toLowerCase().includes(q) ||
                        s.batch.toLowerCase().includes(q);
                    })
                    .map(stu => {
                      const { stats } = dataStore.getStudentAttendance(stu.id);
                      return (
                        <tr key={stu.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {stu.name}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-500">
                            {stu.rollNumber}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-600">
                            {stu.grade} • {stu.batch}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-700">
                            {stats.total}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-600">
                            {stats.present}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-rose-600">
                            {stats.absent}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`inline-block font-mono font-bold text-xs px-2.5 py-1 rounded-full ${
                              stats.percentage >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : stats.percentage >= 75
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {stats.percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
