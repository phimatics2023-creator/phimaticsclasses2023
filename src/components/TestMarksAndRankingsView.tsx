import React, { useState, useMemo } from 'react';
import { StudentAvatar } from './StudentAvatar';
import { 
  AuthUser, 
  TestRecord, 
  StudentTestMark, 
  RankedStudent, 
  Student 
} from '../types';
import { 
  dataStore, 
  ALL_GRADES, 
  ACADEMIC_MONTHS, 
  normalizeGrade 
} from '../services/storage';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Search, 
  Filter, 
  FileText, 
  TrendingUp, 
  Send, 
  Download, 
  Users, 
  Sparkles, 
  X, 
  Save, 
  Clock, 
  Building2, 
  GraduationCap, 
  Check, 
  ShieldAlert,
  Sliders,
  CheckCheck,
  ChevronRight
} from 'lucide-react';

interface TestMarksAndRankingsViewProps {
  currentUser: AuthUser | null;
}

export const TestMarksAndRankingsView: React.FC<TestMarksAndRankingsViewProps> = ({ currentUser }) => {
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';
  const studentData: Student | undefined = isStudent ? currentUser.data : undefined;

  // Navigation Sub-tabs
  const [adminTab, setAdminTab] = useState<'tests' | 'test_ranks' | 'monthly_ranks' | 'reports'>('tests');
  const [studentTab, setStudentTab] = useState<'my_tests' | 'monthly_rank' | 'leaderboard'>('my_tests');

  // Filters
  const [selectedGrade, setSelectedGrade] = useState<string>(
    isStudent ? normalizeGrade(studentData?.grade || 'Grade 10') : 'Grade 10'
  );
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin: Create / Edit Test Modal
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [formTestName, setFormTestName] = useState<string>('');
  const [formGrade, setFormGrade] = useState<string>('Grade 10');
  const [formSubject, setFormSubject] = useState<string>('Mathematics');
  const [formTestDate, setFormTestDate] = useState<string>('2026-10-12');
  const [formMaxMarks, setFormMaxMarks] = useState<number>(50);
  const [formBatch, setFormBatch] = useState<string>('All');
  const [formShowLeaderboard, setFormShowLeaderboard] = useState<boolean>(true);

  // Admin: Marks Entry Modal / Screen
  const [markingTest, setMarkingTest] = useState<TestRecord | null>(null);
  const [marksDraft, setMarksDraft] = useState<Record<string, { marks: string; isAbsent: boolean; remarks: string }>>({});
  const [marksValidationErrors, setMarksValidationErrors] = useState<Record<string, string>>({});
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Selected test for Test-wise Ranking view
  const [selectedRankingTestId, setSelectedRankingTestId] = useState<string>('');

  // Monthly ranking configuration state (Admin)
  const rankingConfig = dataStore.getMonthlyRankingConfig();
  const [minTestsInput, setMinTestsInput] = useState<number>(rankingConfig.minCompletedTests);
  const [showLeaderboardToggle, setShowLeaderboardToggle] = useState<boolean>(rankingConfig.showStudentLeaderboard);
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);

  const allBatches = dataStore.getBatches();
  const allTests = dataStore.getTests(isAdmin ? (selectedGrade === 'All' ? undefined : selectedGrade) : undefined);
  const allStudents = dataStore.getStudents();

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusFeedback({ type, text });
    setTimeout(() => setStatusFeedback(null), 5000);
  };

  // Open Create Test modal
  const handleOpenCreateTest = () => {
    setEditingTestId(null);
    setFormTestName('');
    setFormGrade(selectedGrade === 'All' ? 'Grade 10' : selectedGrade);
    setFormSubject('Mathematics');
    setFormTestDate(new Date().toISOString().split('T')[0]);
    setFormMaxMarks(50);
    setFormBatch('All');
    setFormShowLeaderboard(true);
    setIsTestModalOpen(true);
  };

  // Open Edit Test modal
  const handleOpenEditTest = (test: TestRecord) => {
    setEditingTestId(test.id);
    setFormTestName(test.name);
    setFormGrade(test.grade);
    setFormSubject(test.subject);
    setFormTestDate(test.testDate);
    setFormMaxMarks(test.maxMarks);
    setFormBatch(test.batch);
    setFormShowLeaderboard(test.showLeaderboard ?? true);
    setIsTestModalOpen(true);
  };

  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTestName.trim()) {
      showToast('error', 'Please enter a test title.');
      return;
    }
    if (formMaxMarks <= 0) {
      showToast('error', 'Maximum marks must be greater than zero.');
      return;
    }

    if (editingTestId) {
      const res = dataStore.updateTest(editingTestId, {
        name: formTestName.trim(),
        grade: formGrade,
        subject: formSubject.trim(),
        testDate: formTestDate,
        maxMarks: Number(formMaxMarks),
        batch: formBatch,
        showLeaderboard: formShowLeaderboard
      });
      if (res.success) {
        showToast('success', 'Test details updated successfully.');
        setIsTestModalOpen(false);
      } else {
        showToast('error', res.message);
      }
    } else {
      const res = dataStore.createTest({
        name: formTestName.trim(),
        grade: formGrade,
        subject: formSubject.trim(),
        testDate: formTestDate,
        maxMarks: Number(formMaxMarks),
        batch: formBatch,
        showLeaderboard: formShowLeaderboard
      });
      if (res.success) {
        showToast('success', res.message);
        setIsTestModalOpen(false);
      } else {
        showToast('error', res.message);
      }
    }
  };

  const handleDeleteTest = (test: TestRecord) => {
    if (confirm(`Are you sure you want to delete test "${test.name}" and all recorded marks? This action cannot be undone.`)) {
      const res = dataStore.deleteTest(test.id);
      if (res.success) {
        showToast('success', res.message);
        if (markingTest?.id === test.id) setMarkingTest(null);
      } else {
        showToast('error', res.message);
      }
    }
  };

  // Open Marks Entry screen for a test
  const handleOpenMarking = (test: TestRecord) => {
    setMarkingTest(test);
    const existingMarks = dataStore.getTestMarks(test.id);
    const draft: Record<string, { marks: string; isAbsent: boolean; remarks: string }> = {};

    // Get active students eligible for this test
    const eligibleStudents = allStudents.filter(s => {
      if (s.status !== 'active') return false;
      const matchGrade = normalizeGrade(s.grade) === normalizeGrade(test.grade);
      const matchBatch = test.batch === 'All' || s.batch === test.batch;
      return matchGrade && matchBatch;
    });

    eligibleStudents.forEach(stu => {
      const rec = existingMarks.find(m => m.studentId === stu.id);
      draft[stu.id] = {
        marks: rec && rec.marksObtained !== null ? String(rec.marksObtained) : '',
        isAbsent: rec ? Boolean(rec.isAbsent) : false,
        remarks: rec?.remarks || ''
      };
    });

    setMarksDraft(draft);
    setMarksValidationErrors({});
  };

  // Handle mark input change with validation
  const handleMarkChange = (studentId: string, val: string, maxMarks: number) => {
    setMarksDraft(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { isAbsent: false, remarks: '' }),
        marks: val
      }
    }));

    if (val.trim() === '') {
      setMarksValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
      return;
    }

    const num = Number(val);
    if (isNaN(num)) {
      setMarksValidationErrors(prev => ({ ...prev, [studentId]: 'Must be a valid number' }));
    } else if (num < 0) {
      setMarksValidationErrors(prev => ({ ...prev, [studentId]: 'Marks cannot be negative' }));
    } else if (num > maxMarks) {
      setMarksValidationErrors(prev => ({ ...prev, [studentId]: `Cannot exceed max (${maxMarks})` }));
    } else {
      setMarksValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
    }
  };

  const handleToggleAbsent = (studentId: string) => {
    setMarksDraft(prev => {
      const current = prev[studentId] || { marks: '', isAbsent: false, remarks: '' };
      return {
        ...prev,
        [studentId]: {
          ...current,
          isAbsent: !current.isAbsent,
          marks: !current.isAbsent ? '' : current.marks
        }
      };
    });
    setMarksValidationErrors(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });
  };

  const handleSaveMarks = (publishNow: boolean) => {
    if (!markingTest) return;

    // Check for any validation errors
    if (Object.keys(marksValidationErrors).length > 0) {
      showToast('error', 'Please resolve all invalid marks errors before saving.');
      return;
    }

    const entries = Object.entries(marksDraft).map(([studentId, data]) => {
      const marksNum = data.isAbsent || data.marks.trim() === '' ? null : Number(data.marks.trim());
      return {
        studentId,
        marksObtained: marksNum,
        isAbsent: data.isAbsent,
        remarks: data.remarks
      };
    });

    try {
      const res = dataStore.saveStudentMarks(markingTest.id, entries, publishNow);
      if (res.success) {
        showToast('success', res.message);
        setMarkingTest(null);
      } else {
        showToast('error', res.message);
      }
    } catch (e: any) {
      showToast('error', e.message || 'Failed to save marks.');
    }
  };

  const handleTogglePublish = (test: TestRecord) => {
    const res = dataStore.togglePublishTest(test.id, !test.isPublished);
    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  const handleSaveRankingConfig = () => {
    setIsSavingConfig(true);
    dataStore.updateMonthlyRankingConfig({
      minCompletedTests: Math.max(1, Number(minTestsInput)),
      showStudentLeaderboard: showLeaderboardToggle
    });
    showToast('success', 'Monthly ranking configuration updated successfully!');
    setIsSavingConfig(false);
  };

  const handleExportCsv = (testId: string) => {
    const csvData = dataStore.exportTestResultsCsv(testId);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_results_${testId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Test-wise rankings query
  const effectiveRankingTestId = selectedRankingTestId || (allTests[0]?.id || '');
  const testRankingData = useMemo(() => {
    if (!effectiveRankingTestId) return null;
    return dataStore.getTestRankings(effectiveRankingTestId);
  }, [effectiveRankingTestId, allTests]);

  // Monthly rankings query
  const monthlyRankingData = useMemo(() => {
    return dataStore.getMonthlyRankings(selectedGrade, selectedMonth);
  }, [selectedGrade, selectedMonth, allTests]);

  // Student specific queries
  const studentTests = useMemo(() => {
    if (!isStudent || !studentData) return [];
    const myTests = dataStore.getTests(studentData.grade);
    return myTests.map(test => {
      const marks = dataStore.getTestMarks(test.id).find(m => m.studentId === studentData.id);
      const rankingInfo = dataStore.getTestRankings(test.id);
      return {
        test,
        marks,
        rank: rankingInfo.userRank?.rank
      };
    });
  }, [isStudent, studentData, allTests]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Toast Feedback */}
      {statusFeedback && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${
          statusFeedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : statusFeedback.type === 'error' 
            ? 'bg-rose-50 text-rose-800 border border-rose-200' 
            : 'bg-sky-50 text-sky-800 border border-sky-200'
        }`}>
          <div className="flex items-center gap-2">
            {statusFeedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {statusFeedback.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {statusFeedback.type === 'info' && <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />}
            <span>{statusFeedback.text}</span>
          </div>
          <button onClick={() => setStatusFeedback(null)} className="p-1 hover:opacity-75 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Academic Assessment & Merit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {isAdmin ? 'Test Marks & Ranking System' : 'My Test Results & Rankings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {isAdmin 
              ? 'Enter test marks, publish results with parent dispatches, and review test-wise and monthly overall competition ranks across Grades 1 to 12.'
              : `Personal academic marks, subject-wise percentages, and monthly merit standing in ${studentData?.grade}.`}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreateTest}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Test</span>
          </button>
        )}
      </div>

      {/* ADMIN VIEW */}
      {isAdmin && (
        <div className="space-y-6">
          {/* Main Sub-nav Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setAdminTab('tests')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'tests'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Tests & Marks Entry ({allTests.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('test_ranks')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'test_ranks'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Test-wise Rank</span>
            </button>

            <button
              onClick={() => setAdminTab('monthly_ranks')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'monthly_ranks'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Monthly Overall Rank</span>
            </button>

            <button
              onClick={() => setAdminTab('reports')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                adminTab === 'reports'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Ranking Settings & Reports</span>
            </button>
          </div>

          {/* TAB 1: Tests & Marks Entry */}
          {adminTab === 'tests' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Grade:</span>
                  </span>
                  <select
                    value={selectedGrade}
                    onChange={e => setSelectedGrade(e.target.value)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    <option value="All">All Grades (1–12)</option>
                    {ALL_GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search tests or subjects..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Tests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTests
                  .filter(t => {
                    if (searchQuery.trim() === '') return true;
                    return t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.subject.toLowerCase().includes(searchQuery.toLowerCase());
                  })
                  .map(test => {
                    const testMarks = dataStore.getTestMarks(test.id);
                    const markedCount = testMarks.filter(m => m.marksObtained !== null || m.isAbsent).length;
                    const passCount = testMarks.filter(m => m.resultStatus === 'Pass').length;

                    return (
                      <div
                        key={test.id}
                        className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {test.grade}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                              test.isPublished 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {test.isPublished ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              <span>{test.isPublished ? 'Published' : 'Draft'}</span>
                            </span>
                          </div>

                          <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                            {test.name}
                          </h3>

                          <div className="text-xs text-slate-600 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Subject:</span>
                              <span className="font-semibold text-slate-800">{test.subject}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Max Marks:</span>
                              <span className="font-bold font-mono text-slate-900">{test.maxMarks}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Date:</span>
                              <span>{test.testDate}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Target Batch:</span>
                              <span className="truncate max-w-[140px]">{test.batch}</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                            <span>Evaluated: <strong>{markedCount}</strong> / {testMarks.length}</span>
                            <span>Passed: <strong className="text-emerald-700">{passCount}</strong></span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                          <button
                            onClick={() => handleOpenMarking(test)}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                            <span>Enter Marks</span>
                          </button>

                          <button
                            onClick={() => handleTogglePublish(test)}
                            title={test.isPublished ? 'Unpublish test' : 'Publish test & notify'}
                            className={`p-2 rounded-xl border transition cursor-pointer ${
                              test.isPublished
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {test.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleOpenEditTest(test)}
                            title="Edit test info"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                          >
                            <Sliders className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteTest(test)}
                            title="Delete test"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {allTests.length === 0 && (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">No Tests Created Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Create a test for any grade between Grade 1 and Grade 12 to record student marks, evaluate results, and compute merit ranks.
                  </p>
                  <button
                    onClick={handleOpenCreateTest}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Test</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Test-wise Rankings */}
          {adminTab === 'test_ranks' && (
            <div className="space-y-4">
              {/* Select Test dropdown */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-600">Select Test:</span>
                  <select
                    value={effectiveRankingTestId}
                    onChange={e => setSelectedRankingTestId(e.target.value)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-sky-500 cursor-pointer min-w-[260px]"
                  >
                    {allTests.map(t => (
                      <option key={t.id} value={t.id}>
                        [{t.grade}] {t.name} ({t.testDate}) - {t.isPublished ? 'Published' : 'Draft'}
                      </option>
                    ))}
                  </select>
                </div>

                {testRankingData?.test && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportCsv(testRankingData.test!.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        const next = !testRankingData.test!.showLeaderboard;
                        dataStore.toggleTestLeaderboard(testRankingData.test!.id, next);
                        showToast('info', next ? 'Leaderboard enabled for students.' : 'Leaderboard hidden from students.');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                        testRankingData.test.showLeaderboard
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {testRankingData.test.showLeaderboard ? <Eye className="w-3.5 h-3.5 text-indigo-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{testRankingData.test.showLeaderboard ? 'Student Leaderboard: ON' : 'Student Leaderboard: OFF'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Competition Rankings Table (1, 2, 2, 4) */}
              {testRankingData?.test && (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{testRankingData.test.name}</h3>
                      <p className="text-xs text-slate-500">
                        Grade: <strong>{testRankingData.test.grade}</strong> • Subject: <strong>{testRankingData.test.subject}</strong> • Max Marks: <strong>{testRankingData.test.maxMarks}</strong>
                      </p>
                    </div>
                    <div className="text-xs text-slate-500">
                      Standard Competition Ranking (1, 2, 2, 4)
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-4 w-16 text-center">Rank</th>
                          <th className="py-3 px-4">Roll Number</th>
                          <th className="py-3 px-4">Student Name</th>
                          <th className="py-3 px-4">Batch</th>
                          <th className="py-3 px-4 text-center">Marks Obtained</th>
                          <th className="py-3 px-4 text-center">Percentage</th>
                          <th className="py-3 px-4 text-center">Result Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {testRankingData.rankings.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400">
                              No marks entered or evaluated for this test yet.
                            </td>
                          </tr>
                        ) : (
                          testRankingData.rankings.map(student => (
                            <tr key={student.studentId} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                                  student.rank === 1
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : student.rank === 2
                                    ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                    : student.rank === 3
                                    ? 'bg-amber-700/10 text-amber-900 border border-amber-700/20'
                                    : 'text-slate-600 bg-slate-100'
                                }`}>
                                  #{student.rank}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                {student.rollNumber}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900">
                                {student.studentName}
                              </td>
                              <td className="py-3 px-4 text-slate-600 truncate max-w-[160px]">
                                {student.batch}
                              </td>
                              <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                                {student.marksObtained} / {student.maxMarks}
                              </td>
                              <td className="py-3 px-4 text-center font-mono font-extrabold text-sky-700">
                                {student.percentage}%
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  student.resultStatus === 'Pass'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                  {student.resultStatus}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Monthly Overall Ranking */}
          {adminTab === 'monthly_ranks' && (
            <div className="space-y-4">
              {/* Monthly Filter Bar */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-600">Grade:</span>
                    <select
                      value={selectedGrade}
                      onChange={e => setSelectedGrade(e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 cursor-pointer"
                    >
                      {ALL_GRADES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-600">Month:</span>
                    <select
                      value={selectedMonth}
                      onChange={e => setSelectedMonth(e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 cursor-pointer"
                    >
                      {ACADEMIC_MONTHS.map(m => (
                        <option key={m.key} value={m.key}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Eligible Published Tests: <strong>{monthlyRankingData.eligibleTests.length}</strong></span>
                  <span>• Min Tests Threshold: <strong>{monthlyRankingData.minCompletedTests}</strong></span>
                </div>
              </div>

              {/* Monthly Ranked Students Table */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Overall Monthly Merit Ranking: {selectedGrade} ({monthlyRankingData.monthKey})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Computed from student average percentage across eligible completed tests taken during {selectedMonth}. Standard competition ranking (1, 2, 2, 4).
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto px-4 pb-4">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 w-16 text-center">Rank</th>
                        <th className="py-3 px-4">Roll Number</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Batch</th>
                        <th className="py-3 px-4 text-center">Tests Completed</th>
                        <th className="py-3 px-4 text-center">Average %</th>
                        <th className="py-3 px-4 text-center">Standing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {monthlyRankingData.rankedStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            No students currently qualify for overall monthly ranking in this grade for {selectedMonth}. (Need at least {monthlyRankingData.minCompletedTests} completed published tests).
                          </td>
                        </tr>
                      ) : (
                        monthlyRankingData.rankedStudents.map(student => {
                          const st = dataStore.getStudentById(student.studentId);
                          return (
                            <tr key={student.studentId} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                                  student.rank === 1
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : student.rank === 2
                                    ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                    : student.rank === 3
                                    ? 'bg-amber-700/10 text-amber-900 border border-amber-700/20'
                                    : 'text-slate-600 bg-slate-100'
                                }`}>
                                  #{student.rank}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                {student.rollNumber}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900">
                                <div className="flex items-center gap-2.5">
                                  <StudentAvatar photoUrl={st?.photoUrl} name={student.studentName} size="xs" />
                                  <span>{student.studentName}</span>
                                </div>
                              </td>
                            <td className="py-3 px-4 text-slate-600 truncate max-w-[160px]">
                              {student.batch}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                              {student.testsCompleted}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-extrabold text-sky-700 text-sm">
                              {student.percentage}%
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Qualified
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                    </tbody>
                  </table>
                </div>

                {/* Unranked Students Section (Below minimum completed test threshold) */}
                {monthlyRankingData.unrankedStudents.length > 0 && (
                  <div className="p-4 mx-4 mb-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-xs text-slate-700 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Unranked Students in {selectedGrade} (Did not meet minimum {monthlyRankingData.minCompletedTests} tests threshold):</span>
                    </h4>
                    <div className="divide-y divide-slate-200 text-xs">
                      {monthlyRankingData.unrankedStudents.map(u => (
                        <div key={u.studentId} className="py-2 flex items-center justify-between gap-2 text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-800">{u.studentName}</span> ({u.rollNumber})
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {u.unqualifiedReason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Ranking Settings & Reports */}
          {adminTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Config Card */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">Monthly Ranking Configuration</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Minimum Completed Tests for Overall Ranking
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={minTestsInput}
                      onChange={e => setMinTestsInput(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Students must complete at least this many published tests in the selected month to be awarded an overall competition rank.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">Allow Student Leaderboard View</h4>
                      <p className="text-[11px] text-slate-500">
                        When enabled, students can view the top performers and class merit ranks. When disabled, students see only their own rank card.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showLeaderboardToggle}
                        onChange={e => setShowLeaderboardToggle(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:after:w-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <button
                    onClick={handleSaveRankingConfig}
                    disabled={isSavingConfig}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
                  >
                    Save Ranking Configuration
                  </button>
                </div>
              </div>

              {/* Grade-wise Results Summary Card */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">Grade-wise Performance Overview</h3>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {ALL_GRADES.map(gradeName => {
                    const gradeTests = allTests.filter(t => normalizeGrade(t.grade) === gradeName && t.isPublished);
                    const gradeStudents = allStudents.filter(s => s.status === 'active' && normalizeGrade(s.grade) === gradeName);
                    
                    return (
                      <div
                        key={gradeName}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900">{gradeName}</h4>
                          <p className="text-[11px] text-slate-500">
                            {gradeStudents.length} active students • {gradeTests.length} published tests
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedGrade(gradeName);
                            setAdminTab('monthly_ranks');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-100 cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <span>View Ranks</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STUDENT VIEW */}
      {isStudent && (
        <div className="space-y-6">
          {/* Student Sub-nav */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setStudentTab('my_tests')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                studentTab === 'my_tests'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Test Results ({studentTests.length})</span>
            </button>

            <button
              onClick={() => setStudentTab('monthly_rank')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                studentTab === 'monthly_rank'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>My Monthly Merit Rank</span>
            </button>
          </div>

          {/* Student Tab 1: My Tests */}
          {studentTab === 'my_tests' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentTests.map(item => {
                  const hasMark = item.marks && item.marks.marksObtained !== null;
                  const isAbsent = item.marks?.isAbsent;

                  return (
                    <div
                      key={item.test.id}
                      className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-50 text-sky-700 border border-sky-200">
                            {item.test.subject}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{item.test.testDate}</span>
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-base">
                          {item.test.name}
                        </h3>

                        {/* Marks & Rank Badge Card */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Marks</span>
                            <span className="text-sm font-mono font-extrabold text-slate-900">
                              {isAbsent ? 'Absent' : (hasMark ? `${item.marks?.marksObtained}/${item.test.maxMarks}` : 'Pending')}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Percentage</span>
                            <span className="text-sm font-mono font-black text-sky-700">
                              {hasMark ? `${item.marks?.percentage}%` : '—'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Test Rank</span>
                            <span className="text-sm font-black text-amber-700">
                              {item.rank ? `#${item.rank}` : '—'}
                            </span>
                          </div>
                        </div>

                        {item.marks?.remarks && (
                          <p className="text-xs text-slate-600 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                            <strong>Faculty Remarks:</strong> {item.marks.remarks}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.marks?.resultStatus === 'Pass'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.marks?.resultStatus === 'Fail'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          Result: {item.marks?.resultStatus || 'Pending Evaluation'}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          PhiMatiCs Verified Result
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {studentTests.length === 0 && (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">No Test Results Published Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Once tests for {studentData?.grade} are conducted and evaluated by the faculty, your marks and test-wise merit rank will appear here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Student Tab 2: Monthly Rank */}
          {studentTab === 'monthly_rank' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Calendar Month:</span>
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 cursor-pointer"
                  >
                    {ACADEMIC_MONTHS.map(m => (
                      <option key={m.key} value={m.key}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <span className="text-xs text-slate-500">
                  Enrolled Grade: <strong>{studentData?.grade}</strong>
                </span>
              </div>

              {/* Personal Rank Card */}
              {monthlyRankingData.userRank && (
                <div className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl border border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Monthly Merit Standing</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black">
                      {monthlyRankingData.userRank.studentName} ({monthlyRankingData.userRank.rollNumber})
                    </h3>
                    <p className="text-xs text-slate-300">
                      Completed <strong>{monthlyRankingData.userRank.testsCompleted}</strong> test(s) during {selectedMonth}.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-300 block">Class Rank</span>
                      <span className="text-2xl sm:text-3xl font-black text-amber-400">
                        {monthlyRankingData.userRank.isQualified ? `#${monthlyRankingData.userRank.rank}` : '—'}
                      </span>
                    </div>

                    <div className="text-center border-l border-white/20 pl-6">
                      <span className="text-[10px] uppercase font-bold text-slate-300 block">Average %</span>
                      <span className="text-2xl sm:text-3xl font-mono font-black text-sky-300">
                        {monthlyRankingData.userRank.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!monthlyRankingData.userRank?.isQualified && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">Not Yet Qualified for Overall Monthly Rank</h5>
                    <p className="mt-0.5">{monthlyRankingData.userRank?.unqualifiedReason || `Requires minimum ${monthlyRankingData.minCompletedTests} completed tests in this month to be awarded an overall rank.`}</p>
                  </div>
                </div>
              )}

              {/* Class Leaderboard (Only if Admin has explicitly enabled it) */}
              {monthlyRankingData.canViewLeaderboard && monthlyRankingData.rankedStudents.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-3">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Class Top Rankers Leaderboard ({selectedMonth})</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">Published by Administration</span>
                  </div>

                  <div className="overflow-x-auto px-4 pb-4">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                          <th className="py-2.5 px-4 w-16 text-center">Rank</th>
                          <th className="py-2.5 px-4">Student</th>
                          <th className="py-2.5 px-4 text-center">Average %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {monthlyRankingData.rankedStudents.slice(0, 10).map(item => {
                          const st = dataStore.getStudentById(item.studentId);
                          return (
                            <tr 
                              key={item.studentId}
                              className={item.studentId === studentData?.id ? 'bg-sky-50 font-bold' : 'hover:bg-slate-50'}
                            >
                              <td className="py-2.5 px-4 text-center">
                                <span className="font-black text-xs text-slate-800">#{item.rank}</span>
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2">
                                  <StudentAvatar photoUrl={st?.photoUrl} name={item.studentName} size="xs" />
                                  <span>{item.studentName}</span>
                                  {item.studentId === studentData?.id && (
                                    <span className="px-1.5 py-0.5 rounded-sm bg-sky-600 text-white text-[10px]">You</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 px-4 text-center font-mono font-extrabold text-sky-700">
                                {item.percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ADMIN MODAL: Create / Edit Test */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">
                    {editingTestId ? 'Edit Test Details' : 'Create New Test'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure academic assessment and maximum marks</p>
                </div>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Test Name / Title *
                </label>
                <input
                  type="text"
                  value={formTestName}
                  onChange={e => setFormTestName(e.target.value)}
                  placeholder="e.g. Periodic Test 1 - Real Numbers & Polynomials"
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Grade (1–12) *
                  </label>
                  <select
                    value={formGrade}
                    onChange={e => setFormGrade(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white cursor-pointer"
                  >
                    {ALL_GRADES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={e => setFormSubject(e.target.value)}
                    placeholder="Mathematics, Science, etc."
                    required
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Test Date *
                  </label>
                  <input
                    type="date"
                    value={formTestDate}
                    onChange={e => setFormTestDate(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Maximum Marks *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={formMaxMarks}
                    onChange={e => setFormMaxMarks(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Applicable Batch
                </label>
                <select
                  value={formBatch}
                  onChange={e => setFormBatch(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white cursor-pointer"
                >
                  <option value="All">All Batches in {formGrade}</option>
                  {allBatches
                    .filter(b => normalizeGrade(b.grade) === normalizeGrade(formGrade))
                    .map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Allow Student Leaderboard</h4>
                  <p className="text-[11px] text-slate-500">Students in this grade can view top ranked scores</p>
                </div>
                <input
                  type="checkbox"
                  checked={formShowLeaderboard}
                  onChange={e => setFormShowLeaderboard(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded-sm cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  {editingTestId ? 'Update Test' : 'Create Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN MODAL / SCREEN: Marks Entry */}
      {markingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {markingTest.grade}
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight">{markingTest.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Subject: <strong>{markingTest.subject}</strong> • Max Marks: <strong>{markingTest.maxMarks}</strong> • Batch: <strong>{markingTest.batch}</strong>
                </p>
              </div>

              <button
                onClick={() => setMarkingTest(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Notice */}
            <div className="px-4 py-2.5 bg-sky-50 border-b border-sky-100 text-xs text-sky-900 flex items-center justify-between gap-2">
              <span>
                Enter marks obtained (0 to {markingTest.maxMarks}) or toggle Absent. Percentages and Pass/Fail status calculate automatically.
              </span>
              <span className="font-bold shrink-0">Pass Mark: 40%</span>
            </div>

            {/* Students Marks Table */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3">Roll Number</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Parent Contact</th>
                      <th className="py-2.5 px-3 text-center w-20">Absent</th>
                      <th className="py-2.5 px-3 w-32">Marks (Max {markingTest.maxMarks})</th>
                      <th className="py-2.5 px-3 text-center">Percentage</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.keys(marksDraft).length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No active enrolled students found in {markingTest.grade} ({markingTest.batch}).
                        </td>
                      </tr>
                    ) : (
                      Object.entries(marksDraft).map(([studentId, data]) => {
                        const student = allStudents.find(s => s.id === studentId);
                        const num = data.marks.trim() !== '' ? Number(data.marks.trim()) : null;
                        const percentage = num !== null && !data.isAbsent 
                          ? ((num / markingTest.maxMarks) * 100).toFixed(1) 
                          : '—';
                        
                        let statusText = 'Pending';
                        if (data.isAbsent) statusText = 'Absent';
                        else if (num !== null) statusText = Number(percentage) >= 40 ? 'Pass' : 'Fail';

                        const hasError = Boolean(marksValidationErrors[studentId]);

                        return (
                          <tr key={studentId} className={`hover:bg-slate-50 transition ${data.isAbsent ? 'opacity-60 bg-slate-50/50' : ''}`}>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                              {student?.rollNumber}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {student?.name}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                              {student?.parentPhone ? `${student.parentPhone}` : 'No phone'}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={data.isAbsent}
                                onChange={() => handleToggleAbsent(studentId)}
                                className="w-4 h-4 text-rose-600 rounded-sm cursor-pointer"
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                min={0}
                                max={markingTest.maxMarks}
                                step="0.5"
                                disabled={data.isAbsent}
                                value={data.marks}
                                onChange={e => handleMarkChange(studentId, e.target.value, markingTest.maxMarks)}
                                placeholder="0"
                                className={`w-24 px-2.5 py-1 text-xs rounded-lg border font-mono font-bold ${
                                  hasError 
                                    ? 'border-rose-400 bg-rose-50 text-rose-700 focus:ring-rose-400' 
                                    : 'border-slate-300 focus:ring-sky-500'
                                }`}
                              />
                              {hasError && (
                                <p className="text-[10px] text-rose-600 mt-0.5">{marksValidationErrors[studentId]}</p>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-sky-700">
                              {percentage !== '—' ? `${percentage}%` : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                statusText === 'Pass'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : statusText === 'Fail'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : statusText === 'Absent'
                                  ? 'bg-slate-200 text-slate-700 border-slate-300'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                {statusText}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={data.remarks}
                                onChange={e => setMarksDraft(prev => ({
                                  ...prev,
                                  [studentId]: {
                                    ...(prev[studentId] || { marks: '', isAbsent: false, remarks: '' }),
                                    remarks: e.target.value
                                  }
                                }))}
                                placeholder="Remarks (optional)"
                                className="w-full px-2 py-1 text-[11px] rounded-lg border border-slate-200 focus:ring-1 focus:ring-sky-500"
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                Total Enrolled Students: <strong>{Object.keys(marksDraft).length}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMarkingTest(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveMarks(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 text-slate-300" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveMarks(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish & Notify Students/Parents</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
