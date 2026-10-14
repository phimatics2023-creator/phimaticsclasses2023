import React, { useState } from 'react';
import { AuthUser, StudyMaterial } from '../types';
import { dataStore, ALL_GRADES, normalizeGrade } from '../services/storage';
import { useAppContent } from '../context/ContentContext';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Download, 
  Eye, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle2, 
  X,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface StudyMaterialsViewProps {
  currentUser: AuthUser | null;
  onOpenPdf: (url: string, title: string) => void;
}

export const StudyMaterialsView: React.FC<StudyMaterialsViewProps> = ({
  currentUser,
  onOpenPdf
}) => {
  const { content } = useAppContent();
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  const studentGrade = isStudent ? normalizeGrade(currentUser.data.grade) : 'Grade 10';
  const [selectedGrade, setSelectedGrade] = useState<string>(
    isStudent ? studentGrade : 'Grade 10'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin add modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState('Grade 10');
  const [subject, setSubject] = useState('Mathematics');
  const [chapter, setChapter] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'link' | 'video'>('pdf');
  const [isPublished, setIsPublished] = useState(true);

  // Retrieve materials - dataStore already enforces student grade restriction
  const allMaterials = dataStore.getMaterials();
  const visibleMaterials = allMaterials.filter(m => {
    if (isStudent) {
      // Strict student check: only allow their enrolled grade
      if (normalizeGrade(m.grade) !== studentGrade || !m.isPublished) return false;
    } else {
      const matchGrade = selectedGrade === 'All' || normalizeGrade(m.grade) === normalizeGrade(selectedGrade);
      if (!matchGrade) return false;
    }
    
    const matchSub = selectedSubject === 'All' || m.subject === selectedSubject;
    const matchSearch = searchQuery.trim() === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchSub && matchSearch;
  });

  // Group visible materials by chapter
  const groupedByChapter: Record<string, StudyMaterial[]> = {};
  visibleMaterials.forEach(m => {
    const ch = m.chapter?.trim() || 'General Topics';
    if (!groupedByChapter[ch]) {
      groupedByChapter[ch] = [];
    }
    groupedByChapter[ch].push(m);
  });

  const availableGrades = ALL_GRADES;
  const availableSubjects = ['All', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English'];

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setGrade(selectedGrade === 'All' ? 'Grade 10' : selectedGrade);
    setSubject(selectedSubject === 'All' ? 'Mathematics' : selectedSubject);
    setChapter('');
    setFileUrl('');
    setFileName('');
    setFileType('pdf');
    setIsPublished(true);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapter.trim() || !fileUrl.trim()) {
      alert('Please fill out all required fields: Title, Chapter, and File URL.');
      return;
    }

    dataStore.addMaterial({
      title: title.trim(),
      description: description.trim(),
      grade,
      subject,
      chapter: chapter.trim(),
      fileUrl: fileUrl.trim(),
      fileName: fileName.trim() || undefined,
      fileType,
      isPublished
    });

    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this study material?')) {
      dataStore.deleteMaterial(id);
    }
  };

  const handleTogglePublish = (m: StudyMaterial) => {
    dataStore.updateMaterial(m.id, { isPublished: !m.isPublished });
  };

  // Helper for simulated local file selection
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFileUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{content.materialsAndClasses?.materialsTitle || 'Study Materials & Notes'}</h1>
          <p className="text-sm text-slate-600">
            {content.materialsAndClasses?.materialsSubtitle || 'Curated chapter notes, worksheets, solved exemplar sets, and practice papers'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            {content.materialsAndClasses?.uploadMaterialButton || 'Upload Material'}
          </button>
        )}
      </div>

      {/* Grade Selector Tabs / Student Grade Lock */}
      {isStudent ? (
        <div className="p-3 bg-sky-50 border border-sky-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-sky-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Enrolled Curriculum: <strong>{studentGrade}</strong> • Access restricted to your assigned grade resources.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-600 text-white shrink-0">
            {studentGrade} Only
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Grade:</span>
          <button
            onClick={() => setSelectedGrade('All')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
              selectedGrade === 'All'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Grades
          </button>
          {availableGrades.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                selectedGrade === g
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Subject Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 uppercase text-[10px] font-bold">Subject:</span>
          {availableSubjects.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search chapters or topics..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>

      {/* Structured Chapter & Materials List */}
      {Object.keys(groupedByChapter).length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center text-slate-500 text-sm">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">No study materials found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your grade or subject filters above.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByChapter).map(([chapterTitle, materials]) => (
            <div key={chapterTitle} className="space-y-3">
              {/* Chapter Header */}
              <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm tracking-tight">{chapterTitle}</h3>
                <span className="text-xs text-slate-400">({materials.length} resources)</span>
              </div>

              {/* Material Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {materials.map(m => (
                  <div
                    key={m.id}
                    className={`bg-white rounded-2xl p-4 border transition flex flex-col justify-between ${
                      !m.isPublished 
                        ? 'border-amber-300 bg-amber-50/20 opacity-80' 
                        : 'border-slate-200 hover:border-sky-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700">
                            {m.subject}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-600 bg-slate-100">
                            {m.grade}
                          </span>
                        </div>

                        {isAdmin && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleTogglePublish(m)}
                              title={m.isPublished ? "Unpublish" : "Publish"}
                              className={`text-[10px] px-1.5 py-0.5 rounded ${
                                m.isPublished 
                                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                                  : 'bg-amber-100 text-amber-800 font-semibold'
                              }`}
                            >
                              {m.isPublished ? 'Published' : 'Draft'}
                            </button>
                            <button
                              onClick={() => handleDelete(m.id)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {m.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        {m.fileType === 'pdf' && <FileText className="w-3.5 h-3.5 text-red-500" />}
                        {m.fileType === 'video' && <Video className="w-3.5 h-3.5 text-purple-500" />}
                        {m.fileType === 'link' && <LinkIcon className="w-3.5 h-3.5 text-sky-500" />}
                        <span className="text-[11px] font-medium uppercase">{m.fileType}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {m.fileType === 'pdf' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenPdf(m.fileUrl, m.title)}
                              className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Read PDF
                            </button>
                            <a
                              href={m.fileUrl}
                              download={m.fileName || `${m.title}.pdf`}
                              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </>
                        ) : (
                          <a
                            href={m.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                          >
                            Open Link
                            <ChevronRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Upload / Add Material Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Study Material</h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Grade
                  </label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    {availableGrades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Chapter Name
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={e => setChapter(e.target.value)}
                  placeholder="e.g. Chapter 3: Pair of Linear Equations"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Material Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Graphical Method Notes & Solved Problems"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Description / Topic Summary
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Key concepts, formula sheet, revision tips..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={fileType}
                    onChange={e => setFileType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="link">External Website Link</option>
                    <option value="video">Educational Video Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Upload Local File (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleLocalFileSelect}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  File URL or Link
                </label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={e => setFileUrl(e.target.value)}
                  placeholder="https://... or auto-filled from selected file"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubToggle"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="pubToggle" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Publish immediately (visible to students)
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
                  Save Study Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
