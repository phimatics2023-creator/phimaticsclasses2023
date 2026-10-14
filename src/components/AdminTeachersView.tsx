import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  KeyRound, 
  Check, 
  X, 
  Search, 
  UserCheck, 
  UserX, 
  Phone, 
  Mail,
  GraduationCap,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Archive,
  RotateCcw
} from 'lucide-react';
import { Teacher, TeacherPermissions } from '../types';
import { dataStore, ALL_GRADES } from '../services/storage';

const SUBJECT_OPTIONS = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Social Science'
];

export const AdminTeachersView: React.FC = () => {
  const activeTeachers = dataStore.getTeachers();
  const archivedTeachers = dataStore.getArchivedTeachers();
  const allBatches = dataStore.getBatches();

  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    return dataStore.subscribe(() => setTick(t => t + 1));
  }, []);

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'active' | 'inactive'>('All');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Action Confirmation Modals
  const [archivingTeacher, setArchivingTeacher] = useState<Teacher | null>(null);
  const [restoringTeacher, setRestoringTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('teacher123');
  const [assignedGrades, setAssignedGrades] = useState<string[]>(['Grade 9', 'Grade 10']);
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>(['Mathematics', 'Science']);
  const [assignedBatchIds, setAssignedBatchIds] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<TeacherPermissions>({
    canTakeAttendance: true,
    canCreateTests: true,
    canEnterMarks: true,
    canScheduleClasses: true,
    canManageMaterials: true
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Reset Password Modal States
  const [resetModalTeacher, setResetModalTeacher] = useState<Teacher | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const displayTeachers = activeTab === 'active' ? activeTeachers : archivedTeachers;

  const filteredTeachers = displayTeachers.filter(t => {
    const matchQuery = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchGrade = filterGrade === 'All' || t.assignedGrades.includes(filterGrade);
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;

    return matchQuery && matchGrade && matchStatus;
  });

  const handleToggleStatus = (id: string) => {
    const res = dataStore.toggleTeacherStatus(id);
    if (res.success) {
      setToastMsg('Teacher account status updated successfully.');
      setTimeout(() => setToastMsg(null), 3000);
    } else {
      alert(res.error || 'Failed to update teacher status.');
    }
  };

  const handleOpenCreate = () => {
    setEditingTeacher(null);
    setName('');
    // Auto-generate next suggested Teacher ID
    const count = activeTeachers.length + 1;
    setTeacherId(`TCH-${String(count).padStart(3, '0')}`);
    setEmail('');
    setPhone('');
    setPassword('teacher123');
    setAssignedGrades(['Grade 9', 'Grade 10']);
    setAssignedSubjects(['Mathematics', 'Science']);
    setAssignedBatchIds(allBatches.slice(0, 2).map(b => b.id));
    setPermissions({
      canTakeAttendance: true,
      canCreateTests: true,
      canEnterMarks: true,
      canScheduleClasses: true,
      canManageMaterials: true
    });
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setTeacherId(t.teacherId);
    setEmail(t.email);
    setPhone(t.phone || '');
    setPassword('');
    setAssignedGrades([...t.assignedGrades]);
    setAssignedSubjects([...t.assignedSubjects]);
    setAssignedBatchIds([...t.assignedBatchIds]);
    setPermissions({ ...t.permissions });
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  const toggleGradeSelection = (g: string) => {
    setAssignedGrades(prev => 
      prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]
    );
  };

  const toggleSubjectSelection = (s: string) => {
    setAssignedSubjects(prev => 
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  const toggleBatchSelection = (bId: string) => {
    setAssignedBatchIds(prev => 
      prev.includes(bId) ? prev.filter(item => item !== bId) : [...prev, bId]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!name.trim()) {
      setFormError('Teacher name is required.');
      return;
    }
    if (!teacherId.trim()) {
      setFormError('Teacher ID is required.');
      return;
    }
    if (!email.trim()) {
      setFormError('Teacher email address is required.');
      return;
    }
    if (assignedGrades.length === 0) {
      setFormError('Please select at least one assigned grade.');
      return;
    }

    if (editingTeacher) {
      const res = dataStore.updateTeacher(editingTeacher.id, {
        name: name.trim(),
        teacherId: teacherId.trim().toUpperCase(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        assignedGrades,
        assignedSubjects,
        assignedBatchIds,
        permissions
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to update teacher.');
        return;
      }

      setFormSuccess('Teacher details updated successfully.');
      setTimeout(() => setIsModalOpen(false), 600);
    } else {
      if (!password || password.trim().length < 6) {
        setFormError('Initial password must be at least 6 characters.');
        return;
      }

      const res = dataStore.createTeacher({
        name: name.trim(),
        teacherId: teacherId.trim().toUpperCase(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password: password.trim(),
        assignedGrades,
        assignedSubjects,
        assignedBatchIds,
        status: 'active',
        permissions
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to create teacher account.');
        return;
      }

      setFormSuccess('Teacher account created successfully.');
      setTimeout(() => setIsModalOpen(false), 600);
    }
  };

  const handleConfirmArchive = () => {
    if (!archivingTeacher || isSubmittingAction) return;
    setIsSubmittingAction(true);
    setActionError(null);

    const res = dataStore.archiveTeacher(archivingTeacher.id);
    setIsSubmittingAction(false);

    if (res.success) {
      setToastMsg(`Teacher "${archivingTeacher.name}" (${archivingTeacher.teacherId}) was successfully archived.`);
      setTimeout(() => setToastMsg(null), 4000);
      setArchivingTeacher(null);
    } else {
      setActionError(res.error || 'Failed to archive teacher account.');
    }
  };

  const handleConfirmRestore = () => {
    if (!restoringTeacher || isSubmittingAction) return;
    setIsSubmittingAction(true);
    setActionError(null);

    const res = dataStore.restoreTeacher(restoringTeacher.id);
    setIsSubmittingAction(false);

    if (res.success) {
      setToastMsg(`Teacher "${restoringTeacher.name}" (${restoringTeacher.teacherId}) restored to active status.`);
      setTimeout(() => setToastMsg(null), 4000);
      setRestoringTeacher(null);
    } else {
      setActionError(res.error || 'Failed to restore teacher.');
    }
  };

  const handleConfirmDeletePermanently = () => {
    if (!deletingTeacher || isSubmittingAction) return;
    setIsSubmittingAction(true);
    setActionError(null);

    const res = dataStore.deleteTeacherPermanently(deletingTeacher.id);
    setIsSubmittingAction(false);

    if (res.success) {
      setToastMsg(`Teacher "${deletingTeacher.name}" (${deletingTeacher.teacherId}) was permanently deleted.`);
      setTimeout(() => setToastMsg(null), 4000);
      setDeletingTeacher(null);
    } else {
      setActionError(res.error || 'Failed to delete teacher permanently.');
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalTeacher) return;
    if (!newPassword || newPassword.trim().length < 6) {
      setResetMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    const res = dataStore.adminResetTeacherPassword(resetModalTeacher.teacherId, newPassword.trim());
    if (res.success) {
      setResetMsg({ type: 'success', text: res.message });
      setNewPassword('');
      setTimeout(() => {
        setResetModalTeacher(null);
        setResetMsg(null);
      }, 1200);
    } else {
      setResetMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase tracking-wider">
              Administration
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Teacher & Faculty Management
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Create teacher accounts with unique Teacher IDs, manage assigned grades 1–12, batches, subjects, and granular permissions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="py-2.5 px-4 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Active vs Archived Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'active'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Active Teachers ({activeTeachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'archived'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-amber-50 hover:text-amber-800'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archived Teachers ({archivedTeachers.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by teacher name, Teacher ID (e.g. TCH-101), or email..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Grade Filter */}
          <select
            value={filterGrade}
            onChange={e => setFilterGrade(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer"
          >
            <option value="All">All Grades (1–12)</option>
            {ALL_GRADES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No teachers found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No faculty members match your search criteria. Add a new teacher or adjust your filters.
            </p>
          </div>
        ) : (
          filteredTeachers.map(teacher => {
            const assignedBatchNames = allBatches
              .filter(b => teacher.assignedBatchIds.includes(b.id))
              .map(b => b.name);

            return (
              <div 
                key={teacher.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Header Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-snug">
                          {teacher.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                          ID: {teacher.teacherId}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(teacher.id)}
                      title={teacher.status === 'active' ? 'Click to deactivate teacher' : 'Click to activate teacher'}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition cursor-pointer ${
                        teacher.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {teacher.status}
                    </button>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-1 text-xs text-slate-600 mb-3.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Assigned Grades & Subjects */}
                  <div className="space-y-2 py-2.5 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Assigned Grades:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {teacher.assignedGrades.map(g => (
                          <span key={g} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Subjects:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {teacher.assignedSubjects.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md text-[11px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {assignedBatchNames.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Batches ({assignedBatchNames.length}):
                        </span>
                        <div className="text-[11px] text-slate-600 space-y-0.5 line-clamp-2">
                          {assignedBatchNames.join(', ')}
                        </div>
                      </div>
                    )}

                    {/* Permissions summary chips */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Authorized Permissions:
                      </span>
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {teacher.permissions.canScheduleClasses && (
                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded-sm font-semibold">Class Scheduling</span>
                        )}
                        {teacher.permissions.canManageMaterials && (
                          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-sm font-semibold">Study Materials</span>
                        )}
                        {teacher.permissions.canTakeAttendance && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-sm font-semibold">Attendance</span>
                        )}
                        {teacher.permissions.canCreateTests && (
                          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-sm font-semibold">Tests</span>
                        )}
                        {teacher.permissions.canEnterMarks && (
                          <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded-sm font-semibold">Marks Entry</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {activeTab === 'active' ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(teacher)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                          title="Edit teacher details & assignments"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setResetModalTeacher(teacher);
                            setNewPassword('');
                            setResetMsg(null);
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                          title="Reset teacher account password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(teacher.id)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            teacher.status === 'active' 
                              ? 'text-slate-600 hover:text-rose-600 hover:bg-rose-50' 
                              : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={teacher.status === 'active' ? 'Deactivate account' : 'Reactivate account'}
                        >
                          {teacher.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setActionError(null);
                          setArchivingTeacher(teacher);
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition flex items-center gap-1 cursor-pointer"
                        title="Archive teacher account"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setActionError(null);
                          setRestoringTeacher(teacher);
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                        title="Restore teacher to active list"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setActionError(null);
                          setDeletingTeacher(teacher);
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                        title="Permanently delete teacher record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Permanently</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {editingTeacher ? `Edit Teacher: ${editingTeacher.name}` : 'Add New Faculty Member'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure login credentials, assigned curriculum, and permissions
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* Personal & Login Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Prof. Rajesh Khanna"
                    required
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Unique Teacher ID (Login Identifier) *
                  </label>
                  <input
                    type="text"
                    value={teacherId}
                    onChange={e => setTeacherId(e.target.value)}
                    placeholder="e.g. TCH-105"
                    required
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 uppercase font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. rajesh@phimatics.com"
                    required
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98111 22334"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {!editingTeacher && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="e.g. teacher123 (minimum 6 characters)"
                    required
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    The teacher can change this password after their first sign-in.
                  </p>
                </div>
              )}

              {/* Assigned Grades (1-12) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Assigned Grades (Grade 1 to Grade 12) *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Selected: {assignedGrades.length}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {ALL_GRADES.map(g => {
                    const isChecked = assignedGrades.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGradeSelection(g)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold text-center transition cursor-pointer border ${
                          isChecked
                            ? 'bg-indigo-700 text-white border-indigo-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Subjects */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Assigned Subjects
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_OPTIONS.map(s => {
                    const isChecked = assignedSubjects.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSubjectSelection(s)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                          isChecked
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Batches */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Assigned Class Batches
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                  {allBatches.map(b => {
                    const isChecked = assignedBatchIds.includes(b.id);
                    return (
                      <label 
                        key={b.id} 
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-white transition cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBatchSelection(b.id)}
                          className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-bold text-slate-800">{b.name}</span>
                        <span className="text-[11px] text-slate-400">({b.grade})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Granular Permissions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Teacher Portal Capabilities & Permissions
                </label>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canScheduleClasses}
                      onChange={e => setPermissions({ ...permissions, canScheduleClasses: e.target.checked })}
                      className="rounded-md border-slate-300 text-indigo-600"
                    />
                    <div>
                      <span className="font-bold text-slate-800">Class Scheduling & Management</span>
                      <p className="text-[11px] text-slate-500">Allow scheduling online Google Meet sessions and in-person classes.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canManageMaterials}
                      onChange={e => setPermissions({ ...permissions, canManageMaterials: e.target.checked })}
                      className="rounded-md border-slate-300 text-indigo-600"
                    />
                    <div>
                      <span className="font-bold text-slate-800">Study Materials Management</span>
                      <p className="text-[11px] text-slate-500">Allow uploading notes, formula sheets, saving drafts, and publishing resources.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canTakeAttendance}
                      onChange={e => setPermissions({ ...permissions, canTakeAttendance: e.target.checked })}
                      className="rounded-md border-slate-300 text-indigo-600"
                    />
                    <div>
                      <span className="font-bold text-slate-800">Daily Attendance Recording</span>
                      <p className="text-[11px] text-slate-500">Allow marking student attendance in assigned batches.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canCreateTests}
                      onChange={e => setPermissions({ ...permissions, canCreateTests: e.target.checked })}
                      className="rounded-md border-slate-300 text-indigo-600"
                    />
                    <div>
                      <span className="font-bold text-slate-800">Test Creation</span>
                      <p className="text-[11px] text-slate-500">Allow creating tests and unit assessments for assigned grades.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.canEnterMarks}
                      onChange={e => setPermissions({ ...permissions, canEnterMarks: e.target.checked })}
                      className="rounded-md border-slate-300 text-indigo-600"
                    />
                    <div>
                      <span className="font-bold text-slate-800">Marks Entry & Scoring</span>
                      <p className="text-[11px] text-slate-500">Allow entering student scores and generating rankings.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-700/20 cursor-pointer"
                >
                  {editingTeacher ? 'Save Changes' : 'Create Teacher Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Reset Teacher Password Modal */}
      {resetModalTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">
                  Reset Password for {resetModalTeacher.name}
                </h3>
              </div>
              <button 
                onClick={() => setResetModalTeacher(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Set a new password for Teacher ID <strong className="font-mono text-slate-900">{resetModalTeacher.teacherId}</strong>.
              </p>

              {resetMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  resetMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'
                }`}>
                  {resetMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{resetMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  New Password (min 6 chars)
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetModalTeacher(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARCHIVE TEACHER CONFIRMATION MODAL */}
      {archivingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="p-3 bg-amber-100 rounded-2xl shrink-0">
                <Archive className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Archive Teacher Account</h3>
                <p className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md mt-0.5 inline-block border border-amber-200">
                  Teacher ID: {archivingTeacher.teacherId}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                Are you sure you want to archive faculty member <strong className="text-slate-900">{archivingTeacher.name}</strong>?
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 text-slate-700">
                <p className="font-semibold text-slate-900">What happens when archived:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  <li>Teacher will be removed from the active teacher list.</li>
                  <li>Account login access will be restricted.</li>
                  <li>Assigned batch history, study materials, and test records will be safely preserved.</li>
                </ul>
              </div>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmittingAction}
                onClick={() => {
                  setArchivingTeacher(null);
                  setActionError(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingAction}
                onClick={handleConfirmArchive}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Archive className="w-4 h-4" />
                <span>{isSubmittingAction ? 'Archiving...' : 'Confirm Archive'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESTORE TEACHER CONFIRMATION MODAL */}
      {restoringTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="p-3 bg-emerald-100 rounded-2xl shrink-0">
                <RotateCcw className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Restore Teacher Account</h3>
                <p className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5 inline-block border border-emerald-200">
                  Teacher ID: {restoringTeacher.teacherId}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Restore teacher <strong className="text-slate-900">{restoringTeacher.name}</strong> to active status? This will reactivate account login access securely without creating duplicate records.
            </p>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmittingAction}
                onClick={() => {
                  setRestoringTeacher(null);
                  setActionError(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingAction}
                onClick={handleConfirmRestore}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isSubmittingAction ? 'Restoring...' : 'Restore Account'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE TEACHER PERMANENTLY CONFIRMATION MODAL */}
      {deletingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="p-3 bg-rose-100 rounded-2xl shrink-0">
                <Trash2 className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Teacher Permanently</h3>
                <p className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md mt-0.5 inline-block border border-rose-200">
                  Teacher ID: {deletingTeacher.teacherId}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                Are you sure you want to PERMANENTLY delete teacher <strong className="text-slate-900">{deletingTeacher.name}</strong>?
              </p>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-semibold space-y-1">
                <p className="font-bold flex items-center gap-1 text-rose-950">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                  PERMANENT ACTION:
                </p>
                <p className="text-rose-800 font-medium">
                  This action CANNOT be undone. The teacher's authentication credentials and account profile will be permanently removed from the database.
                </p>
              </div>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isSubmittingAction}
                onClick={() => {
                  setDeletingTeacher(null);
                  setActionError(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingAction}
                onClick={handleConfirmDeletePermanently}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isSubmittingAction ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
