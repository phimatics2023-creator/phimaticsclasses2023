import React, { useState } from 'react';
import { AuthUser, ClassBatch, Student } from '../types';
import { dataStore, ALL_GRADES } from '../services/storage';
import { useAppContent } from '../context/ContentContext';
import { 
  Building2, 
  Clock, 
  Users, 
  Plus, 
  Edit3, 
  Archive,
  RotateCcw,
  Calendar,
  X,
  BookOpen,
  UserCheck,
  UserMinus,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Sparkles,
  Info,
  Trash2
} from 'lucide-react';

interface BatchesViewProps {
  currentUser: AuthUser | null;
}

export const BatchesView: React.FC<BatchesViewProps> = ({ currentUser }) => {
  const { content } = useAppContent();
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const activeBatches = dataStore.getBatches(false);
  const archivedBatches = dataStore.getArchivedBatches();
  const allStudents = dataStore.getStudents();

  // Filter state for Admin
  const [filterGrade, setFilterGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast / Feedback message
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Archive Confirmation Modal State
  const [archivingBatch, setArchivingBatch] = useState<ClassBatch | null>(null);
  const [restoringBatch, setRestoringBatch] = useState<ClassBatch | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<ClassBatch | null>(null);

  // Add / Edit Batch Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 10');
  const [subjects, setSubjects] = useState('Mathematics & Science');
  const [timings, setTimings] = useState('07:00 AM – 08:30 AM');
  const [days, setDays] = useState('Mon, Wed, Fri');
  const [teacherName, setTeacherName] = useState('Faculty In-Charge');
  const [description, setDescription] = useState('');

  // Student Assignment Modal State
  const [managingBatch, setManagingBatch] = useState<ClassBatch | null>(null);
  const [studentToAssignId, setStudentToAssignId] = useState<string>('');
  const [studentSearchInModal, setStudentSearchInModal] = useState<string>('');

  // Identify student's batch if student
  const userStudent: Student | undefined = isStudent ? currentUser.data : undefined;

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    const defaultGrade = filterGrade === 'All' ? 'Grade 10' : filterGrade;
    setGrade(defaultGrade);
    setSubjects('Mathematics & Science');
    setTimings('07:00 AM – 08:30 AM');
    setDays('Mon, Wed, Fri');
    setTeacherName('Faculty In-Charge');
    setDescription('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (b: ClassBatch) => {
    setEditingId(b.id);
    setName(b.name);
    setGrade(b.grade);
    setSubjects(b.subjects || 'Mathematics & Science');
    setTimings(b.timings || b.schedule?.split('•')[1]?.trim() || '07:00 AM – 08:30 AM');
    setDays(b.days || b.schedule?.split('•')[0]?.trim() || 'Mon, Wed, Fri');
    setTeacherName(b.teacherName || b.instructorName || '');
    setDescription(b.description || '');
    setIsFormOpen(true);
  };

  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    return dataStore.subscribe(() => setTick(t => t + 1));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmArchive = () => {
    if (!archivingBatch || isSubmitting) return;
    setIsSubmitting(true);
    const success = dataStore.archiveBatch(archivingBatch.id, 'Archived by administrator');
    setIsSubmitting(false);

    if (success) {
      showFeedback('success', `Batch "${archivingBatch.name}" was successfully archived.`);
      if (managingBatch?.id === archivingBatch.id) setManagingBatch(null);
      setArchivingBatch(null);
    } else {
      showFeedback('error', `Failed to archive batch "${archivingBatch.name}".`);
    }
  };

  const handleConfirmRestore = () => {
    if (!restoringBatch || isSubmitting) return;
    setIsSubmitting(true);
    const success = dataStore.restoreBatch(restoringBatch.id);
    setIsSubmitting(false);

    if (success) {
      showFeedback('success', `Batch "${restoringBatch.name}" was successfully restored to Active Batches.`);
      setRestoringBatch(null);
    } else {
      showFeedback('error', `Failed to restore batch "${restoringBatch.name}".`);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingBatch || isSubmitting) return;
    setIsSubmitting(true);
    const res = dataStore.deleteBatchPermanently(deletingBatch.id);
    setIsSubmitting(false);

    if (res.success) {
      showFeedback('success', `Batch "${deletingBatch.name}" was permanently deleted from database.`);
      if (managingBatch?.id === deletingBatch.id) setManagingBatch(null);
      setDeletingBatch(null);
    } else {
      showFeedback('error', res.error || 'Failed to delete batch.');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showFeedback('error', 'Batch Name is required.');
      return;
    }

    const payload = {
      name: name.trim(),
      grade,
      subjects: subjects.trim() || 'Mathematics & Science',
      timings: timings.trim() || '07:00 AM – 08:30 AM',
      days: days.trim() || 'Mon, Wed, Fri',
      teacherName: teacherName.trim() || undefined,
      description: description.trim() || undefined
    };

    if (editingId) {
      dataStore.updateBatch(editingId, payload);
      showFeedback('success', `Batch "${name}" updated successfully.`);
    } else {
      dataStore.addBatch(payload);
      showFeedback('success', `New batch "${name}" created successfully.`);
    }

    setIsFormOpen(false);
  };

  const handleAssignStudent = (batchName: string) => {
    if (!studentToAssignId) return;
    const success = dataStore.assignStudentToBatch(studentToAssignId, batchName);
    if (success) {
      showFeedback('success', 'Student enrolled in batch successfully.');
    }
    setStudentToAssignId('');
  };

  const handleRemoveStudent = (studentId: string) => {
    const success = dataStore.removeStudentFromBatch(studentId);
    if (success) {
      showFeedback('success', 'Student unassigned from batch.');
    }
  };

  const currentList = activeTab === 'active' ? activeBatches : archivedBatches;

  // Filtered batches for display
  const displayedBatches = currentList.filter(b => {
    // If student, only show batches assigned to them
    if (isStudent) {
      return b.name === userStudent?.batch;
    }
    // Admin filtering
    if (filterGrade !== 'All' && b.grade !== filterGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchSubjects = (b.subjects || '').toLowerCase().includes(q);
      const matchTeacher = (b.teacherName || '').toLowerCase().includes(q);
      return matchName || matchSubjects || matchTeacher;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{content.batches?.pageTitle || 'Batches'}</h1>
          <p className="text-sm text-slate-600">
            {isAdmin 
              ? (content.batches?.pageSubtitle || 'Academic class batches across Grades 1 to 10, schedules, and student enrollment.')
              : (content.batches?.studentSubtitle || 'Details and timings for your assigned class batch at PhiMatiCs Classes.')}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            {content.batches?.addBatchButton || 'Add Batch'}
          </button>
        )}
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Admin Tab Switcher: Active Batches vs Archived Batches */}
      {isAdmin && (
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Active Batches ({activeBatches.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'archived'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-amber-600" />
              <span>Archived Batches ({archivedBatches.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Archiving retains all attendance, fees, and test records permanently.</span>
          </div>
        </div>
      )}

      {/* Admin Toolbar (Filters & Search) */}
      {isAdmin && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search batches by name, subjects, or teacher..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Grades (1–10)</option>
              {ALL_GRADES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Student View Banner if not assigned */}
      {isStudent && displayedBatches.length === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500 text-sm max-w-md mx-auto space-y-3">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Assigned Batch</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            You are not currently assigned to an active batch. Please contact the administrator to assign your batch schedule.
          </p>
        </div>
      )}

      {/* Empty State for Admin */}
      {isAdmin && displayedBatches.length === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500 text-sm max-w-md mx-auto space-y-2">
          <Archive className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {activeTab === 'archived' ? 'No Archived Batches' : 'No Active Batches Found'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {activeTab === 'archived'
              ? 'There are no archived batches in the system.'
              : 'No active batches match your search criteria or grade filter.'}
          </p>
        </div>
      )}

      {/* Grid of Batch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedBatches.map(b => {
          const enrolledStudents = allStudents.filter(s => s.batch === b.name && s.status === 'active');
          const batchSubjects = b.subjects || 'Mathematics & Science';
          const batchTimings = b.timings || b.schedule?.split('•')[1]?.trim() || '07:00 AM – 08:30 AM';
          const batchDays = b.days || b.schedule?.split('•')[0]?.trim() || 'Mon, Wed, Fri';
          const batchTeacher = b.teacherName || b.instructorName || 'Faculty In-Charge';

          return (
            <div 
              key={b.id} 
              className={`bg-white p-5 rounded-2xl border shadow-xs transition flex flex-col justify-between group ${
                b.isArchived ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-sky-300'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700">
                      {b.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                      {batchSubjects}
                    </span>
                    {b.isArchived && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                        Archived
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      {!b.isArchived ? (
                        <>
                          <button
                            onClick={() => handleOpenEdit(b)}
                            title="Edit Batch"
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setArchivingBatch(b)}
                            title="Archive Batch"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setRestoringBatch(b)}
                            title="Restore Batch"
                            className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>
                          <button
                            onClick={() => setDeletingBatch(b)}
                            title="Permanently Delete Batch"
                            className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Permanently</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Batch Name */}
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-sky-700 transition">
                  {b.name}
                </h3>

                {b.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {b.description}
                  </p>
                )}

                {/* Details Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-500" />
                      Timings
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      {batchTimings}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-500" />
                      Days
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      {batchDays}
                    </span>
                  </div>
                </div>

                {batchTeacher && (
                  <div className="mt-3 text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="text-slate-400">Teacher:</span>
                    <strong className="text-slate-700">{batchTeacher}</strong>
                  </div>
                )}
              </div>

              {/* Footer Enrollment Row */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Enrolled: <strong>{enrolledStudents.length} Students</strong></span>
                </div>

                {isAdmin && !b.isArchived && (
                  <button
                    onClick={() => setManagingBatch(b)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign Students</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ARCHIVE CONFIRMATION MODAL */}
      {archivingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <Archive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Archive Batch Confirmation</h3>
                <p className="text-xs text-slate-500">Action moves batch to Archived section</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to archive batch <strong className="text-slate-900">{archivingBatch.name}</strong>?
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Data Preservation Guarantee:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>Historical attendance records remain completely intact.</li>
                <li>Fee payments and test results remain preserved.</li>
                <li>Batch can be restored at any time from the Archived Batches tab.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setArchivingBatch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmArchive}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                Archive Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESTORE CONFIRMATION MODAL */}
      {restoringBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Restore Batch</h3>
                <p className="text-xs text-slate-500">Return batch to active scheduling</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Restore batch <strong className="text-slate-900">{restoringBatch.name}</strong> to the active batch list?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRestoringBatch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                Restore to Active
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT DELETION MODAL */}
      {deletingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Batch Permanently</h3>
                <p className="text-xs text-slate-500">{deletingBatch.name} • {deletingBatch.grade}</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Are you sure you want to PERMANENTLY delete the archived batch <strong className="text-slate-900">"{deletingBatch.name}"</strong> ({deletingBatch.grade})?
              </p>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-[11px] font-medium space-y-1">
                <p className="font-bold text-rose-950 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                  PERMANENT DELETION WARNING:
                </p>
                <p>
                  This action CANNOT be undone. The batch record will be permanently removed from the database. Linked student profiles, historical attendance, test marks, and fee payment histories will be preserved.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setDeletingBatch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BATCH MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingId ? 'Edit Batch Configuration' : 'Create New Class Batch'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Batch Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Batch 10 - Morning"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Grade
                  </label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 bg-white"
                  >
                    {ALL_GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Subjects
                  </label>
                  <input
                    type="text"
                    value={subjects}
                    onChange={e => setSubjects(e.target.value)}
                    placeholder="e.g. Mathematics & Science"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Batch Timings
                  </label>
                  <input
                    type="text"
                    value={timings}
                    onChange={e => setTimings(e.target.value)}
                    placeholder="07:00 AM – 08:30 AM"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Days of Week
                  </label>
                  <input
                    type="text"
                    value={days}
                    onChange={e => setDays(e.target.value)}
                    placeholder="Mon, Wed, Fri"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Faculty / Teacher Name
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={e => setTeacherName(e.target.value)}
                  placeholder="e.g. Faculty In-Charge / Teacher Name"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Additional information or syllabus coverage notes..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
                >
                  {editingId ? 'Save Changes' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT ASSIGNMENT MODAL */}
      {managingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base">{managingBatch.name}</h3>
                <p className="text-xs text-sky-400">Enrollment & Student Assignments</p>
              </div>
              <button 
                onClick={() => setManagingBatch(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {/* Assign new student selector */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Assign Student to {managingBatch.name}
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={studentToAssignId}
                    onChange={e => setStudentToAssignId(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="">-- Select Student to Assign --</option>
                    {allStudents
                      .filter(s => s.status === 'active' && s.batch !== managingBatch.name)
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.rollNumber}) — Currently: {s.batch}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => handleAssignStudent(managingBatch.name)}
                    disabled={!studentToAssignId}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                  >
                    Assign
                  </button>
                </div>
              </div>

              {/* Currently Enrolled Students List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Enrolled Students ({allStudents.filter(s => s.batch === managingBatch.name && s.status === 'active').length})
                  </h4>
                  <div className="relative w-44">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={studentSearchInModal}
                      onChange={e => setStudentSearchInModal(e.target.value)}
                      placeholder="Filter student..."
                      className="w-full pl-7 pr-2 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {allStudents
                    .filter(s => s.batch === managingBatch.name && s.status === 'active')
                    .filter(s => s.name.toLowerCase().includes(studentSearchInModal.toLowerCase()) || s.rollNumber.toLowerCase().includes(studentSearchInModal.toLowerCase()))
                    .map(s => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{s.name}</span>
                          <span className="text-[11px] text-slate-500 ml-2 font-mono">({s.rollNumber})</span>
                        </div>
                        <button
                          onClick={() => handleRemoveStudent(s.id)}
                          title="Remove from batch"
                          className="px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
