import React, { useState } from 'react';
import { AuthUser, Announcement } from '../types';
import { dataStore, ALL_GRADES, normalizeGrade } from '../services/storage';
import { useAppContent } from '../context/ContentContext';
import { 
  Bell, 
  Pin, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  FileText, 
  Users, 
  Calendar, 
  X, 
  AlertCircle,
  Check,
  Building2,
  GraduationCap
} from 'lucide-react';

interface AnnouncementsViewProps {
  currentUser: AuthUser | null;
  selectedAnnouncementModal?: Announcement | null;
  onCloseAnnouncementModal?: () => void;
  onOpenPdf?: (url: string, title: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  currentUser,
  selectedAnnouncementModal,
  onCloseAnnouncementModal,
  onOpenPdf
}) => {
  const { content } = useAppContent();
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  // Filters
  const [audienceFilter, setAudienceFilter] = useState<string>(
    isStudent ? currentUser.data.grade : 'All'
  );

  // Modal / Form state for Admin
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formTargetType, setFormTargetType] = useState<'all' | 'single_grade' | 'multiple_grades' | 'batch'>('all');
  const [formSingleGrade, setFormSingleGrade] = useState<string>('Grade 10');
  const [formMultipleGrades, setFormMultipleGrades] = useState<string[]>(['Grade 9', 'Grade 10']);
  const [formTargetBatch, setFormTargetBatch] = useState<string>('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formAttachmentUrl, setFormAttachmentUrl] = useState('');
  const [formAttachmentName, setFormAttachmentName] = useState('');

  // Reader modal state
  const [activeReadAnn, setActiveReadAnn] = useState<Announcement | null>(
    selectedAnnouncementModal || null
  );

  const allBatches = dataStore.getBatches();

  // Sync if prop changes
  React.useEffect(() => {
    if (selectedAnnouncementModal) {
      setActiveReadAnn(selectedAnnouncementModal);
    }
  }, [selectedAnnouncementModal]);

  const announcements = dataStore.getAnnouncements(
    isStudent ? currentUser.data.grade : (audienceFilter === 'All' ? undefined : audienceFilter)
  );

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormTitle('');
    setFormMessage('');
    setFormTargetType('all');
    setFormSingleGrade('Grade 10');
    setFormMultipleGrades(['Grade 9', 'Grade 10']);
    setFormTargetBatch(allBatches[0]?.name || 'Morning Batch (A)');
    setFormIsPinned(false);
    setFormAttachmentUrl('');
    setFormAttachmentName('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setFormTitle(ann.title);
    setFormMessage(ann.message);
    const resolvedType = ann.targetType || (ann.audience === 'All' ? 'all' : (ALL_GRADES.includes(ann.audience) ? 'single_grade' : 'batch'));
    setFormTargetType(resolvedType);
    setFormSingleGrade(resolvedType === 'single_grade' ? ann.audience : 'Grade 10');
    setFormMultipleGrades(ann.targetGrades && ann.targetGrades.length > 0 ? ann.targetGrades : (ALL_GRADES.includes(ann.audience) ? [ann.audience] : ['Grade 9', 'Grade 10']));
    setFormTargetBatch(ann.targetBatch || ann.audience || (allBatches[0]?.name || ''));
    setFormIsPinned(ann.isPinned);
    setFormAttachmentUrl(ann.attachmentUrl || '');
    setFormAttachmentName(ann.attachmentName || '');
    setIsFormOpen(true);
  };

  // Delete Confirmation state
  const [deletingAnn, setDeletingAnn] = useState<Announcement | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenDeleteConfirm = (ann: Announcement) => {
    setDeletingAnn(ann);
  };

  const handleConfirmDelete = () => {
    if (!deletingAnn) return;
    const success = dataStore.deleteAnnouncement(deletingAnn.id);
    if (success) {
      showFeedback('success', `Announcement "${deletingAnn.title}" was deleted permanently.`);
      if (activeReadAnn?.id === deletingAnn.id) setActiveReadAnn(null);
    } else {
      showFeedback('error', 'Failed to delete announcement. Authorization required.');
    }
    setDeletingAnn(null);
  };

  const handleTogglePin = (ann: Announcement) => {
    dataStore.updateAnnouncement(ann.id, { isPinned: !ann.isPinned });
  };

  const toggleGradeSelection = (g: string) => {
    setFormMultipleGrades(prev => 
      prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) {
      alert('Title and message are required.');
      return;
    }

    let audienceStr = 'All';
    if (formTargetType === 'all') {
      audienceStr = 'All';
    } else if (formTargetType === 'single_grade') {
      audienceStr = formSingleGrade;
    } else if (formTargetType === 'multiple_grades') {
      if (formMultipleGrades.length === 0) {
        alert('Please select at least one grade for the target audience.');
        return;
      }
      audienceStr = formMultipleGrades.join(', ');
    } else if (formTargetType === 'batch') {
      if (!formTargetBatch) {
        alert('Please select a specific batch.');
        return;
      }
      audienceStr = formTargetBatch;
    }

    const payload = {
      title: formTitle.trim(),
      message: formMessage.trim(),
      audience: audienceStr,
      targetType: formTargetType,
      targetGrades: formTargetType === 'multiple_grades' ? formMultipleGrades : undefined,
      targetBatch: formTargetType === 'batch' ? formTargetBatch : undefined,
      isPinned: formIsPinned,
      attachmentUrl: formAttachmentUrl.trim() || undefined,
      attachmentName: formAttachmentName.trim() || undefined
    };

    if (editingId) {
      dataStore.updateAnnouncement(editingId, payload);
    } else {
      dataStore.addAnnouncement(payload);
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{content.announcements?.pageTitle || 'Announcements'}</h1>
          <p className="text-sm text-slate-600">
            {content.announcements?.pageSubtitle || 'Official circulars, exam notifications, holiday schedules, and academic updates'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            {content.announcements?.newAnnouncementButton || 'New Announcement'}
          </button>
        )}
      </div>

      {/* Audience Filter Pills (for Admin or Browse) */}
      {!isStudent && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Filter:</span>
          {['All', ...ALL_GRADES].map(aud => (
            <button
              key={aud}
              onClick={() => setAudienceFilter(aud)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                audienceFilter === aud
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {aud}
            </button>
          ))}
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No announcements found for this audience.
          </div>
        ) : (
          announcements.map(ann => {
            const dateStr = new Date(ann.publishedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={ann.id}
                className={`bg-white rounded-2xl p-5 border transition ${
                  ann.isPinned 
                    ? 'border-amber-300 shadow-sm bg-gradient-to-r from-amber-50/20 to-white' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {ann.isPinned && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-amber-700" />
                        Pinned Notice
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      Audience: {ann.audience}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <button
                        onClick={() => handleTogglePin(ann)}
                        title={ann.isPinned ? "Unpin notice" : "Pin notice"}
                        className={`p-1.5 rounded-lg hover:bg-slate-100 transition ${
                          ann.isPinned ? 'text-amber-600' : 'text-slate-400'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(ann)}
                        title="Edit announcement"
                        className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm(ann)}
                        title="Delete announcement"
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 
                  onClick={() => setActiveReadAnn(ann)}
                  className="text-base font-bold text-slate-900 cursor-pointer hover:text-sky-600 transition"
                >
                  {ann.title}
                </h3>

                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {ann.message}
                </p>

                {/* Attachment Link if present */}
                {ann.attachmentUrl && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span className="font-medium">{ann.attachmentName || 'Attached Document'}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (onOpenPdf && ann.attachmentUrl?.endsWith('.pdf')) {
                          onOpenPdf(ann.attachmentUrl, ann.attachmentName || ann.title);
                        } else {
                          window.open(ann.attachmentUrl, '_blank');
                        }
                      }}
                      className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Attachment</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Admin Create/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingId ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Schedule for Upcoming Mathematics Olympiad"
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Target Audience (Requirement 8)
                </label>
                
                {/* Target Type selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFormTargetType('all')}
                    className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                      formTargetType === 'all'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All Students
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTargetType('single_grade')}
                    className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                      formTargetType === 'single_grade'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Single Grade
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTargetType('multiple_grades')}
                    className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                      formTargetType === 'multiple_grades'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Multiple Grades
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTargetType('batch')}
                    className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                      formTargetType === 'batch'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Specific Batch
                  </button>
                </div>

                {/* Sub-selector based on Target Type */}
                {formTargetType === 'all' && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
                    ✓ This announcement will be visible to all active students from <strong>Grade 1 to Grade 12</strong> across all batches.
                  </p>
                )}

                {formTargetType === 'single_grade' && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Select Target Grade (Grades 1 to 12):
                    </label>
                    <select
                      value={formSingleGrade}
                      onChange={e => setFormSingleGrade(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                    >
                      {ALL_GRADES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                )}

                {formTargetType === 'multiple_grades' && (
                  <div className="pt-1 bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Select Target Grades (1 to 12):</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormMultipleGrades([...ALL_GRADES])}
                          className="text-[11px] text-sky-600 font-bold hover:underline cursor-pointer"
                        >
                          Select All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => setFormMultipleGrades([])}
                          className="text-[11px] text-slate-500 font-bold hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      {ALL_GRADES.map(g => {
                        const isChecked = formMultipleGrades.includes(g);
                        return (
                          <label
                            key={g}
                            onClick={() => toggleGradeSelection(g)}
                            className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-xs cursor-pointer select-none transition ${
                              isChecked 
                                ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-2xs' 
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="sr-only"
                            />
                            <span className="truncate">{g}</span>
                          </label>
                        );
                      })}
                    </div>
                    {formMultipleGrades.length === 0 && (
                      <p className="text-[11px] text-rose-600 font-medium">Please select at least one grade.</p>
                    )}
                  </div>
                )}

                {formTargetType === 'batch' && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Select Target Batch:
                    </label>
                    <select
                      value={formTargetBatch}
                      onChange={e => setFormTargetBatch(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                    >
                      {allBatches.map(b => (
                        <option key={b.id} value={b.name}>{b.name} ({b.grade})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Announcement Message
                </label>
                <textarea
                  value={formMessage}
                  onChange={e => setFormMessage(e.target.value)}
                  placeholder="Type the full announcement message here..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Attachment Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formAttachmentName}
                    onChange={e => setFormAttachmentName(e.target.value)}
                    placeholder="e.g. Test_Syllabus.pdf"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Attachment URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formAttachmentUrl}
                    onChange={e => setFormAttachmentUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pinToggle"
                  checked={formIsPinned}
                  onChange={e => setFormIsPinned(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="pinToggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Pin this announcement to the top
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  {editingId ? 'Save Changes' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reader Modal (for students or clicking "Read Full Notice") */}
      {activeReadAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {activeReadAnn.isPinned && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Pinned
                    </span>
                  )}
                  <span className="text-xs text-slate-500">
                    {new Date(activeReadAnn.publishedAt).toLocaleDateString(undefined, { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {activeReadAnn.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveReadAnn(null);
                  if (onCloseAnnouncementModal) onCloseAnnouncementModal();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {activeReadAnn.message}
              </p>

              {activeReadAnn.attachmentUrl && (
                <div className="mt-5 p-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-sky-900">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span className="font-semibold">{activeReadAnn.attachmentName || 'Attached Document'}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenPdf && activeReadAnn.attachmentUrl?.endsWith('.pdf')) {
                        onOpenPdf(activeReadAnn.attachmentUrl, activeReadAnn.attachmentName || activeReadAnn.title);
                      } else {
                        window.open(activeReadAnn.attachmentUrl, '_blank');
                      }
                    }}
                    className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View File
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Audience: {activeReadAnn.audience}</span>
              <button
                onClick={() => {
                  setActiveReadAnn(null);
                  if (onCloseAnnouncementModal) onCloseAnnouncementModal();
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Announcement Confirmation Modal */}
      {deletingAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="p-3 bg-rose-100 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Announcement</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">"{deletingAnn.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAnn(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
