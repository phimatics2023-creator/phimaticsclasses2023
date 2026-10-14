import React, { useState } from 'react';
import { Student } from '../types';
import { dataStore, ALL_GRADES } from '../services/storage';
import { StudentAvatar } from './StudentAvatar';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Archive, 
  RotateCcw,
  Search, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  Calendar, 
  X, 
  CreditCard, 
  ShieldCheck, 
  Building2, 
  Filter,
  AlertTriangle,
  History,
  FileText,
  Clock,
  Check,
  AlertCircle,
  HelpCircle,
  Trash2
} from 'lucide-react';

export const AdminStudentsView: React.FC = () => {
  // Main view tab: 'active' or 'archived'
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  // Search & Filters for Active Students
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'active' | 'inactive'>('All');

  // Search for Archived Students
  const [archivedSearchQuery, setArchivedSearchQuery] = useState('');

  // Student Form Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('student123');
  const [grade, setGrade] = useState('Grade 10');
  const [batch, setBatch] = useState('');
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [dateOfAdmission, setDateOfAdmission] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [monthlyFee, setMonthlyFee] = useState<number>(1500);
  const [feeStartMonth, setFeeStartMonth] = useState('2026-04');

  // Archive Confirmation Modal State
  const [studentToArchive, setStudentToArchive] = useState<Student | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  // Restore Confirmation Modal State
  const [studentToRestore, setStudentToRestore] = useState<Student | null>(null);
  const [restoreSelectedBatch, setRestoreSelectedBatch] = useState<string>('');
  const [isRestoring, setIsRestoring] = useState(false);

  // Preserved History Modal State
  const [viewHistoryStudent, setViewHistoryStudent] = useState<Student | null>(null);

  // Delete Permanently Modal State
  const [studentToDeletePermanently, setStudentToDeletePermanently] = useState<Student | null>(null);
  const [isDeletingPermanently, setIsDeletingPermanently] = useState(false);

  // Real-time subscription to dataStore
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    return dataStore.subscribe(() => setTick(t => t + 1));
  }, []);

  // User feedback toast
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const allStudents = dataStore.getStudents();
  const batches = dataStore.getBatches();

  // Active & Inactive students (excluding archived)
  const activeStudentsList = allStudents.filter(s => s.status !== 'archived');
  const archivedStudentsList = allStudents.filter(s => s.status === 'archived');

  const filteredActiveStudents = activeStudentsList.filter(s => {
    const matchGrade = selectedGrade === 'All' || s.grade === selectedGrade;
    const matchBatch = selectedBatch === 'All' || s.batch === selectedBatch;
    const matchStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchQuery = searchQuery.trim() === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.parentName && s.parentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.fatherName && s.fatherName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.motherName && s.motherName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchGrade && matchBatch && matchStatus && matchQuery;
  });

  const filteredArchivedStudents = archivedStudentsList.filter(s => {
    const query = archivedSearchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      s.name.toLowerCase().includes(query) ||
      s.rollNumber.toLowerCase().includes(query) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      s.id.toLowerCase().includes(query) ||
      (s.parentName && s.parentName.toLowerCase().includes(query)) ||
      (s.fatherName && s.fatherName.toLowerCase().includes(query))
    );
  });

  const handleOpenAddStudent = () => {
    setEditingStudentId(null);
    setName('');
    const nextRoll = `PHI-${Math.floor(1000 + allStudents.length + 1)}`;
    setRollNumber(nextRoll);
    setEmail('');
    setPassword('student123');
    const defaultGrade = selectedGrade === 'All' ? 'Grade 10' : selectedGrade;
    setGrade(defaultGrade);
    const availableBatch = batches.find(b => b.grade === defaultGrade)?.name || batches[0]?.name || 'Batch 10 - Morning (Math & Science)';
    setBatch(availableBatch);
    setPhone('');
    setParentPhone('');
    setParentName('');
    setFatherName('');
    setFatherPhone('');
    setMotherName('');
    setMotherPhone('');
    setDateOfAdmission(new Date().toISOString().split('T')[0]);
    setStatus('active');
    setMonthlyFee(1500);
    setFeeStartMonth('2026-04');
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (stu: Student) => {
    setEditingStudentId(stu.id);
    setName(stu.name);
    setRollNumber(stu.rollNumber);
    setEmail(stu.email || '');
    setPassword(stu.password);
    setGrade(stu.grade);
    setBatch(stu.batch);
    setPhone(stu.phone || '');
    setParentPhone(stu.parentPhone || '');
    setParentName(stu.parentName || '');
    setFatherName(stu.fatherName || stu.parentName || '');
    setFatherPhone(stu.fatherPhone || stu.parentPhone || '');
    setMotherName(stu.motherName || '');
    setMotherPhone(stu.motherPhone || '');
    setDateOfAdmission(stu.dateOfAdmission || stu.joinedDate || new Date().toISOString().split('T')[0]);
    setStatus(stu.status === 'archived' ? 'inactive' : stu.status);
    setMonthlyFee(stu.monthlyFee || 1500);
    setFeeStartMonth(stu.feeStartMonth || '2026-04');
    setIsStudentModalOpen(true);
  };

  const handleToggleStudentStatus = (id: string) => {
    dataStore.toggleStudentStatus(id);
    showFeedback('success', 'Student active status updated.');
  };

  // Trigger Archive Confirmation Modal
  const handleInitiateArchive = (stu: Student) => {
    setStudentToArchive(stu);
  };

  // Confirm Archive Action
  const handleConfirmArchive = () => {
    if (!studentToArchive) return;
    setIsArchiving(true);

    try {
      const result = dataStore.archiveStudent(studentToArchive.id);
      if (result.success) {
        showFeedback('success', result.message);
        setStudentToArchive(null);
      } else {
        showFeedback('error', result.message || 'Failed to archive student.');
      }
    } catch (e) {
      showFeedback('error', 'An unexpected error occurred while archiving the student.');
    } finally {
      setIsArchiving(false);
    }
  };

  // Trigger Restore Confirmation Modal
  const handleInitiateRestore = (stu: Student) => {
    setStudentToRestore(stu);
    // Find safe batch: previous batch if valid, or first batch for grade
    const validPrev = batches.find(b => b.name === stu.archivedPreviousBatch);
    const fallbackBatch = batches.find(b => b.grade === stu.grade)?.name || batches[0]?.name || 'Unassigned';
    setRestoreSelectedBatch(validPrev ? validPrev.name : fallbackBatch);
  };

  // Confirm Restore Action
  const handleConfirmRestore = () => {
    if (!studentToRestore) return;
    setIsRestoring(true);

    try {
      const result = dataStore.restoreStudent(studentToRestore.id, restoreSelectedBatch);
      if (result.success) {
        showFeedback('success', result.message);
        setStudentToRestore(null);
      } else {
        showFeedback('error', result.message || 'Failed to restore student.');
      }
    } catch (e) {
      showFeedback('error', 'An unexpected error occurred while restoring the student.');
    } finally {
      setIsRestoring(false);
    }
  };

  // Trigger Permanent Delete Confirmation Modal
  const handleInitiateDeletePermanently = (stu: Student) => {
    setStudentToDeletePermanently(stu);
  };

  // Confirm Permanent Delete Action
  const handleConfirmDeletePermanently = () => {
    if (!studentToDeletePermanently || isDeletingPermanently) return;
    setIsDeletingPermanently(true);

    try {
      const result = dataStore.deleteStudentPermanently(studentToDeletePermanently.id);
      if (result.success) {
        showFeedback('success', result.message);
        setStudentToDeletePermanently(null);
      } else {
        showFeedback('error', result.message || 'Failed to permanently delete student.');
      }
    } catch (e) {
      showFeedback('error', 'An unexpected error occurred while permanently deleting the student.');
    } finally {
      setIsDeletingPermanently(false);
    }
  };

  const handleStudentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanRoll = rollNumber.trim().toUpperCase();
    const cleanPass = password.trim();

    if (!cleanName || !cleanRoll || !cleanPass) {
      showFeedback('error', 'Student Name, Roll Number, and Password are required.');
      return;
    }

    const existingRoll = allStudents.find(
      s => s.id !== editingStudentId && s.rollNumber.trim().toUpperCase() === cleanRoll
    );
    if (existingRoll) {
      showFeedback('error', `Roll Number "${cleanRoll}" is already assigned to ${existingRoll.name}.`);
      return;
    }

    const parentContact = fatherPhone.trim() || parentPhone.trim() || motherPhone.trim();
    const primaryParent = fatherName.trim() || parentName.trim() || motherName.trim();

    if (editingStudentId) {
      dataStore.updateStudent(editingStudentId, {
        name: cleanName,
        rollNumber: cleanRoll,
        email: email.trim() ? email.trim().toLowerCase() : undefined,
        password: cleanPass,
        grade,
        batch,
        phone: phone.trim() || undefined,
        parentPhone: parentContact || undefined,
        parentName: primaryParent || undefined,
        fatherName: fatherName.trim() || undefined,
        fatherPhone: fatherPhone.trim() || undefined,
        motherName: motherName.trim() || undefined,
        motherPhone: motherPhone.trim() || undefined,
        dateOfAdmission: dateOfAdmission || new Date().toISOString().split('T')[0],
        status,
        monthlyFee: Number(monthlyFee),
        feeStartMonth
      });
      showFeedback('success', 'Student details updated successfully.');
    } else {
      dataStore.addStudent({
        name: cleanName,
        rollNumber: cleanRoll,
        email: email.trim() ? email.trim().toLowerCase() : undefined,
        password: cleanPass,
        grade,
        batch,
        phone: phone.trim() || undefined,
        parentPhone: parentContact || undefined,
        parentName: primaryParent || undefined,
        fatherName: fatherName.trim() || undefined,
        fatherPhone: fatherPhone.trim() || undefined,
        motherName: motherName.trim() || undefined,
        motherPhone: motherPhone.trim() || undefined,
        dateOfAdmission: dateOfAdmission || new Date().toISOString().split('T')[0],
        status,
        monthlyFee: Number(monthlyFee),
        feeStartMonth,
        academicSession: '2026-2027'
      });
      showFeedback('success', 'New student enrolled successfully.');
    }

    setIsStudentModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Management</h1>
          <p className="text-sm text-slate-600">
            Manage enrolled students, class batches, attendance records, fee ledgers, and safe archiving.
          </p>
        </div>

        <button
          onClick={handleOpenAddStudent}
          className="py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4 text-sky-400" />
          Enroll New Student
        </button>
      </div>

      {/* Feedback Toast Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2.5 border animate-fadeIn ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="flex-1">{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs: Active Students vs Archived Students */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'active'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Students</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === 'active' ? 'bg-slate-800 text-sky-300' : 'bg-slate-200 text-slate-700'
          }`}>
            {activeStudentsList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'archived'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Archive className="w-4 h-4 text-amber-400" />
          <span>Archived Students</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === 'archived' ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-700'
          }`}>
            {archivedStudentsList.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ACTIVE STUDENTS */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {/* Info notice about student & parent access */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-sky-900">
            <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sky-950">Safe Student Lifecycle Management</p>
              <p className="mt-0.5 text-sky-800 leading-relaxed">
                To protect student data integrity, enrolled students cannot be permanently destroyed. Clicking the <strong>Archive</strong> button safely moves a student to the Archived section while permanently keeping their attendance history, payment ledgers, and digital receipts intact.
              </p>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, roll no, or parent..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Grade Filter */}
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="All">All Grades (1–10)</option>
                  {ALL_GRADES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Batch Filter */}
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden max-w-[180px] truncate"
              >
                <option value="All">All Batches</option>
                {batches.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Student Cards List */}
          <div className="space-y-3">
            {filteredActiveStudents.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
                No active students found matching your search and filter criteria.
              </div>
            ) : (
              filteredActiveStudents.map(stu => {
                const feeLedger = dataStore.getStudentFeeLedger(stu.id);
                const attendanceStats = dataStore.getStudentAttendance(stu.id).stats;

                return (
                  <div
                    key={stu.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <StudentAvatar 
                        photoUrl={stu.photoUrl} 
                        name={stu.name} 
                        size="md" 
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {stu.name}
                          </h3>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                            {stu.rollNumber}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-sky-50 text-sky-700">
                            {stu.grade}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            stu.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {stu.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                          <span>Batch: <strong className="text-slate-700">{stu.batch}</strong></span>
                          <span>Email: <strong className="text-slate-700">{stu.email}</strong></span>
                          {stu.parentName && (
                            <span>Parent: <strong className="text-slate-700">{stu.parentName}</strong> ({stu.parentPhone || 'No Phone'})</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right side metrics & actions */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 text-center">
                          <span className="text-[10px] text-slate-500 block">Attendance</span>
                          <strong className={`font-mono font-bold ${
                            attendanceStats.percentage >= 75 ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {attendanceStats.percentage}%
                          </strong>
                        </div>

                        <div className="bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 text-center">
                          <span className="text-[10px] text-slate-500 block">Monthly Fee</span>
                          <strong className="font-mono font-bold text-slate-800">
                            ₹{stu.monthlyFee || 1500}
                          </strong>
                        </div>

                        <div className="bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 text-center">
                          <span className="text-[10px] text-slate-500 block">Paid Up To</span>
                          <strong className="font-bold text-emerald-600 truncate max-w-[90px] block">
                            {feeLedger.summary.paidUpToMonth.split(' ')[0]}
                          </strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Toggle active / inactive */}
                        <button
                          onClick={() => handleToggleStudentStatus(stu.id)}
                          title={stu.status === 'active' ? 'Deactivate Student Account' : 'Activate Student Account'}
                          className={`p-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            stu.status === 'active' 
                              ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50' 
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {stu.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        {/* Edit details */}
                        <button
                          onClick={() => handleOpenEditStudent(stu)}
                          title="Edit Student Account"
                          className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Archive Student Action (Replaces Delete/Trash) */}
                        <button
                          onClick={() => handleInitiateArchive(stu)}
                          title="Archive Student (Preserves all historical records)"
                          className="p-2 rounded-xl text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition cursor-pointer flex items-center gap-1"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ARCHIVED STUDENTS */}
      {activeTab === 'archived' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <Archive className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">Archived Students Vault</p>
              <p className="mt-0.5 text-amber-850 leading-relaxed">
                Archived students are excluded from active batch rosters, daily attendance taking, and new fee lists. Their historical attendance records, payments, and receipts remain completely preserved and reviewable below. You can restore any student back to active enrollment at any time.
              </p>
            </div>
          </div>

          {/* Archived Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={archivedSearchQuery}
                onChange={(e) => setArchivedSearchQuery(e.target.value)}
                placeholder="Search archived students by name, roll number, or ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Total Archived: <strong>{archivedStudentsList.length}</strong>
            </div>
          </div>

          {/* Archived List */}
          <div className="space-y-3">
            {filteredArchivedStudents.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
                <Archive className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">No Archived Students</h4>
                <p className="text-xs text-slate-500">
                  {archivedSearchQuery 
                    ? `No archived students found matching "${archivedSearchQuery}".`
                    : 'There are currently no archived students in the system.'}
                </p>
              </div>
            ) : (
              filteredArchivedStudents.map(stu => {
                const feeLedger = dataStore.getStudentFeeLedger(stu.id);
                const attendanceStats = dataStore.getStudentAttendance(stu.id).stats;

                return (
                  <div
                    key={stu.id}
                    className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <StudentAvatar 
                        photoUrl={stu.photoUrl} 
                        name={stu.name} 
                        size="md" 
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {stu.name}
                          </h3>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                            {stu.rollNumber}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                            {stu.grade}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            ARCHIVED
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                          <span>Previous Batch: <strong className="text-slate-700">{stu.archivedPreviousBatch || 'None'}</strong></span>
                          <span>Archived On: <strong className="text-slate-700">{stu.archivedAt ? new Date(stu.archivedAt).toLocaleDateString() : 'Preserved'}</strong></span>
                          <span>Email: <strong className="text-slate-700">{stu.email}</strong></span>
                        </p>
                      </div>
                    </div>

                    {/* Actions: View History, Restore, and Delete Permanently */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <button
                        onClick={() => setViewHistoryStudent(stu)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                        title="View preserved attendance and fee history"
                      >
                        <History className="w-3.5 h-3.5 text-indigo-600" />
                        <span>View History</span>
                      </button>

                      <button
                        onClick={() => handleInitiateRestore(stu)}
                        className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title="Restore student to active status"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Student</span>
                      </button>

                      <button
                        onClick={() => handleInitiateDeletePermanently(stu)}
                        className="py-2 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                        title="Permanently remove student record and login account"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete Permanently</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: ARCHIVE STUDENT */}
      {studentToArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Archive className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Archive Student?
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  This student will be removed from active student lists and batch enrollments. Their attendance history, fee records and payment history will be preserved.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">{studentToArchive.name}</div>
                <div className="text-slate-500 font-mono text-[11px]">Roll No: {studentToArchive.rollNumber} • {studentToArchive.grade}</div>
                <div className="text-slate-500 text-[11px]">Current Batch: {studentToArchive.batch}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setStudentToArchive(null)}
                disabled={isArchiving}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmArchive}
                disabled={isArchiving}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isArchiving ? (
                  <span>Archiving...</span>
                ) : (
                  <>
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive Student</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: RESTORE STUDENT */}
      {studentToRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Restore Student to Active Status?
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  This student will return to the active student roster. Please select the class batch they should be enrolled into:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800">{studentToRestore.name}</div>
                  <div className="text-slate-500 font-mono text-[11px]">Roll No: {studentToRestore.rollNumber} • {studentToRestore.grade}</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assign to Batch:
                  </label>
                  <select
                    value={restoreSelectedBatch}
                    onChange={(e) => setRestoreSelectedBatch(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                  >
                    {batches
                      .filter(b => b.grade === studentToRestore.grade)
                      .map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    <option value="Unassigned">Leave Unassigned for now</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setStudentToRestore(null)}
                disabled={isRestoring}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                disabled={isRestoring}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isRestoring ? (
                  <span>Restoring...</span>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Confirm Restore</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRESERVED HISTORY MODAL */}
      {viewHistoryStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <History className="w-5 h-5 text-sky-400" />
                  Preserved Records: {viewHistoryStudent.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Roll No: {viewHistoryStudent.rollNumber} • {viewHistoryStudent.grade}
                </p>
              </div>
              <button
                onClick={() => setViewHistoryStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto text-xs">
              {/* Summary Stats Strip */}
              {(() => {
                const att = dataStore.getStudentAttendance(viewHistoryStudent.id);
                const fee = dataStore.getStudentFeeLedger(viewHistoryStudent.id);

                return (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Attendance Rate</span>
                        <span className="text-base font-black text-slate-900">{att.stats.percentage}%</span>
                        <span className="text-[10px] text-slate-500 block">({att.stats.present}/{att.stats.total} days)</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Billed</span>
                        <span className="text-base font-black text-slate-900">₹{fee.summary.totalDue}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Paid</span>
                        <span className="text-base font-black text-emerald-600">₹{fee.summary.totalPaid}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Pending Balance</span>
                        <span className="text-base font-black text-amber-600">₹{fee.summary.totalOutstanding}</span>
                      </div>
                    </div>

                    {/* Preserved Payment History */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        Preserved Payment History ({fee.payments.length} Payments)
                      </h4>
                      {fee.payments.length === 0 ? (
                        <p className="text-slate-400 italic">No payments recorded for this student.</p>
                      ) : (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                          {fee.payments.map(p => (
                            <div key={p.id} className="p-3 bg-white flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-900">₹{p.amount}</span>
                                <span className="text-slate-400 ml-2 font-mono">({p.paymentMethod})</span>
                                <div className="text-[11px] text-slate-500">Receipt: {p.receiptNumber || p.id} • {p.paymentDate}</div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                RECORDED
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Preserved Attendance History */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-sky-600" />
                        Preserved Attendance Logs ({att.records.length} Sessions)
                      </h4>
                      {att.records.length === 0 ? (
                        <p className="text-slate-400 italic">No attendance records found.</p>
                      ) : (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                          {att.records.map(r => (
                            <div key={r.id} className="p-2.5 bg-white flex items-center justify-between text-xs">
                              <div>
                                <span className="font-semibold text-slate-800">{r.date}</span>
                                <span className="text-slate-400 ml-2">({r.batch})</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
                                r.status === 'absent' ? 'bg-rose-50 text-rose-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                {r.status.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewHistoryStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENROLL / EDIT MODAL */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-base">
                  {editingStudentId ? 'Edit Student Account' : 'Enroll New Student'}
                </h3>
              </div>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStudentFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rohan Gupta"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Roll Number / Student ID *</label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    placeholder="e.g. PHI-1025"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. rohan.gupta@gmail.com (Optional)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Password (for Portal Login) *</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Academic Grade (Class) *</label>
                  <select
                    value={grade}
                    onChange={e => {
                      const newGrade = e.target.value;
                      setGrade(newGrade);
                      const matchB = batches.find(b => b.grade === newGrade)?.name || batches[0]?.name || 'Unassigned';
                      setBatch(matchB);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-hidden"
                  >
                    {ALL_GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Batch *</label>
                  <select
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                  >
                    {batches
                      .filter(b => b.grade === grade)
                      .map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date of Admission *</label>
                  <input
                    type="date"
                    required
                    value={dateOfAdmission}
                    onChange={e => setDateOfAdmission(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Monthly Tuition Fee (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={monthlyFee}
                    onChange={e => setMonthlyFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>

                {/* Parent / Guardian Information */}
                <div className="col-span-full pt-3 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-600" />
                    Parent / Guardian Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Father's Name</label>
                      <input
                        type="text"
                        value={fatherName}
                        onChange={e => setFatherName(e.target.value)}
                        placeholder="e.g. Rajesh Gupta"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Father's Contact Number</label>
                      <input
                        type="text"
                        value={fatherPhone}
                        onChange={e => setFatherPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mother's Name</label>
                      <input
                        type="text"
                        value={motherName}
                        onChange={e => setMotherName(e.target.value)}
                        placeholder="e.g. Sunita Gupta"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mother's Contact Number</label>
                      <input
                        type="text"
                        value={motherPhone}
                        onChange={e => setMotherPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43211"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 cursor-pointer shadow-xs"
                >
                  {editingStudentId ? 'Save Changes' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: PERMANENTLY DELETE STUDENT */}
      {studentToDeletePermanently && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-700">
                <div className="p-3 bg-rose-100 rounded-2xl shrink-0">
                  <Trash2 className="w-6 h-6 text-rose-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delete Student Permanently</h3>
                  <p className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md mt-0.5 inline-block border border-rose-200">
                    Roll No: {studentToDeletePermanently.rollNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  Are you sure you want to PERMANENTLY delete student <strong className="text-slate-900">{studentToDeletePermanently.name}</strong>?
                </p>
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1 text-rose-900">
                  <div className="font-bold flex items-center gap-1.5 text-rose-950">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>PERMANENT ACTION — CANNOT BE UNDONE</span>
                  </div>
                  <div className="text-rose-800 text-[11px] leading-relaxed pt-1 space-y-1">
                    <p>• Student record and profile will be deleted from the database.</p>
                    <p>• Authentication credentials and Roll Number login mapping will be removed.</p>
                    <p>• The student will no longer be able to log in or access protected student data.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isDeletingPermanently}
                onClick={() => setStudentToDeletePermanently(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingPermanently}
                onClick={handleConfirmDeletePermanently}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeletingPermanently ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
