import React, { useState, useEffect } from 'react';
import { 
  AuthUser, 
  Student, 
  FeeObligation, 
  FeePayment, 
  PaymentMethod 
} from '../types';
import { dataStore, ACADEMIC_MONTHS, ALL_GRADES } from '../services/storage';
import { useAppContent } from '../context/ContentContext';
import { StudentAvatar } from './StudentAvatar';
import { 
  CreditCard, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Search, 
  Calendar, 
  RotateCcw, 
  FileText, 
  X, 
  Banknote,
  Receipt,
  UserCheck,
  Edit3,
  Copy,
  Layers
} from 'lucide-react';

interface MonthlyFeesViewProps {
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
}

export const MonthlyFeesView: React.FC<MonthlyFeesViewProps> = ({
  currentUser,
  onOpenLogin
}) => {
  const { content } = useAppContent();
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  // Force re-render on dataStore changes
  const [, setTick] = useState(0);
  useEffect(() => {
    return dataStore.subscribe(() => setTick(t => t + 1));
  }, []);

  // Admin view state
  const [adminTab, setAdminTab] = useState<'students' | 'record_payment' | 'reports'>('students');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-101');
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');

  // Record Payment Form State
  const [payStudentId, setPayStudentId] = useState<string>('stu-101');
  const [payAmount, setPayAmount] = useState<number>(1500);
  const [payDate, setPayDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('UPI');
  const [payReceiptNo, setPayReceiptNo] = useState<string>('');
  const [payRefNo, setPayRefNo] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('');
  
  // Allocations mapping: monthKey -> allocated amount
  const [allocationsMap, setAllocationsMap] = useState<Record<string, number>>({});
  
  // Month-Wise Fee Structure Edit Modal State
  const [isEditStructureOpen, setIsEditStructureOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string>('stu-101');
  const [editAcademicSession, setEditAcademicSession] = useState<string>('2026-2027');
  const [editSchedule, setEditSchedule] = useState<Record<string, { feeAmount: number; dueDate?: string }>>({});
  const [quickSameFee, setQuickSameFee] = useState<number | string>(1500);

  // Toast notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const allStudents = dataStore.getStudents();
  const allObligations = dataStore.getFeeObligations();
  const allPayments = dataStore.getFeePayments();

  // Determine which student statement to view
  const currentViewStudentId = isStudent 
    ? currentUser.data.id 
    : selectedStudentId;

  const currentLedger = dataStore.getStudentFeeLedger(currentViewStudentId);

  // Setup allocations whenever selected student for payment changes
  useEffect(() => {
    if (payStudentId) {
      const stuLedger = dataStore.getStudentFeeLedger(payStudentId);
      const targetMonth = stuLedger.obligations.find(o => o.status === 'pending' || o.status === 'partial');
      if (targetMonth) {
        setAllocationsMap({ [targetMonth.monthKey]: targetMonth.balance });
        setPayAmount(targetMonth.balance);
      } else {
        const firstUnpaid = stuLedger.obligations.find(o => o.balance > 0);
        if (firstUnpaid) {
          setAllocationsMap({ [firstUnpaid.monthKey]: firstUnpaid.balance });
          setPayAmount(firstUnpaid.balance);
        } else {
          setAllocationsMap({ ['2026-10']: 1500 });
          setPayAmount(1500);
        }
      }
    }
  }, [payStudentId]);

  const handleAllocationChange = (monthKey: string, val: number) => {
    const updated = { ...allocationsMap };
    if (val <= 0) {
      delete updated[monthKey];
    } else {
      updated[monthKey] = val;
    }
    setAllocationsMap(updated);
    
    // Auto-update total payAmount to match sum of allocations
    const newSum = Object.values(updated).reduce((s, a) => s + a, 0);
    setPayAmount(newSum);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const allocations = Object.entries(allocationsMap).map(([mKey, amount]) => {
      const monthObj = ACADEMIC_MONTHS.find(m => m.key === mKey);
      return {
        monthKey: mKey,
        monthName: monthObj?.name || mKey,
        allocatedAmount: Number(amount)
      };
    });

    if (allocations.length === 0) {
      showFeedback('error', 'Please allocate payment amount to at least one month.');
      return;
    }

    const res = dataStore.recordFeePayment({
      studentId: payStudentId,
      amount: Number(payAmount),
      paymentDate: payDate,
      paymentMethod: payMethod,
      receiptNumber: payReceiptNo.trim() || undefined,
      referenceNumber: payRefNo.trim() || undefined,
      notes: payNotes.trim() || undefined,
      allocations,
      recordedBy: 'Administrator'
    });

    if (res.success) {
      showFeedback('success', res.message);
      setPayNotes('');
      setPayRefNo('');
      setPayReceiptNo('');
      setAdminTab('students');
    } else {
      showFeedback('error', res.message);
    }
  };

  const handleReversePayment = (paymentId: string) => {
    const reason = prompt('Please enter the reason for correcting / reversing this payment:');
    if (reason && reason.trim()) {
      const res = dataStore.reverseFeePayment(paymentId, reason.trim(), 'Administrator');
      if (res.success) {
        showFeedback('success', res.message);
      } else {
        showFeedback('error', res.message);
      }
    }
  };

  // Open Month-Wise Fee Structure Editor Modal for a specific student
  const handleOpenEditStructureModal = (studentId: string) => {
    const student = dataStore.getStudentById(studentId);
    if (!student) return;

    setEditStudentId(studentId);
    setEditAcademicSession(student.academicSession || '2026-2027');

    const sched: Record<string, { feeAmount: number; dueDate?: string }> = {};
    ACADEMIC_MONTHS.forEach(m => {
      const existing = student.monthlyFeeSchedule?.[m.key];
      sched[m.key] = {
        feeAmount: existing?.feeAmount ?? student.monthlyFee ?? 1500,
        dueDate: existing?.dueDate || ''
      };
    });

    setEditSchedule(sched);
    setQuickSameFee(student.monthlyFee || 1500);
    setIsEditStructureOpen(true);
  };

  // Quick action: Apply same fee to all 12 months
  const handleApplySameFeeToAll = () => {
    if (quickSameFee === '' || quickSameFee === null || quickSameFee === undefined) {
      showFeedback('error', 'Please enter a valid tuition fee amount.');
      return;
    }
    const amount = Number(quickSameFee);
    if (isNaN(amount) || amount < 0) {
      showFeedback('error', 'Please enter a valid tuition fee amount.');
      return;
    }

    const updated: Record<string, { feeAmount: number; dueDate?: string }> = {};
    ACADEMIC_MONTHS.forEach(m => {
      updated[m.key] = {
        feeAmount: amount,
        dueDate: editSchedule[m.key]?.dueDate || ''
      };
    });
    setEditSchedule(updated);
    showFeedback('success', `Applied ₹${amount.toLocaleString('en-IN')} to all 12 months.`);
  };

  // Save Month-Wise Fee Schedule
  const handleSaveFeeScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = dataStore.updateStudentFeeSchedule(
      editStudentId,
      editSchedule,
      editAcademicSession,
      'Administrator'
    );
    if (res.success) {
      setIsEditStructureOpen(false);
      showFeedback('success', res.message);
    } else {
      showFeedback('error', res.message);
    }
  };

  const handleExportFeesCsv = () => {
    const csv = dataStore.exportFeesCsv(allObligations);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phimatics_fees_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If user is not logged in
  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-lg mx-auto shadow-sm my-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CreditCard className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Monthly Tuition Fee Portal</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Parents and students can track month-wise fee payment status and balance. The administrator records receipts and maintains fee accounts.
        </p>
        <button
          onClick={onOpenLogin}
          className="mt-2 py-2.5 px-6 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition cursor-pointer"
        >
          Sign In to Access Fee Portal
        </button>
      </div>
    );
  }

  // Calculate live total for the schedule editor modal
  const editingStudent = dataStore.getStudentById(editStudentId);
  const totalScheduleFeeSum = Object.values(editSchedule).reduce((sum, item) => sum + (Number(item?.feeAmount) || 0), 0);

  // ==========================================
  // STUDENT OR PARENT READ-ONLY DASHBOARD VIEW
  // ==========================================
  if (isStudent) {
    const student = currentLedger.student;
    const { summary, obligations, payments } = currentLedger;

    return (
      <div className="space-y-6 pb-20 md:pb-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Monthly Tuition Fees</h1>
            <p className="text-sm text-slate-600">
              Student: <strong className="text-slate-800">{student?.name}</strong> ({student?.rollNumber}) • {student?.grade} • {student?.batch}
            </p>
          </div>

          <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 font-medium">
            Session: {student?.academicSession || '2026-2027'}
          </div>
        </div>

        {/* Big Clear "Up to which month have I paid?" Answer Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tuition Fee Payment Status
              </span>

              <h2 className="text-xl md:text-2xl font-black">
                Fees Cleared Up To: <span className="text-sky-300 font-mono underline decoration-sky-500/50">{summary.paidUpToMonth}</span>
              </h2>

              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Total Annual Academic Fee: <strong>₹{summary.totalDue.toLocaleString('en-IN')}</strong>. 
                {summary.totalOutstanding === 0 
                  ? ' All applicable months are fully cleared with no pending balance.' 
                  : ` Total outstanding dues across current/pending months: ₹${summary.totalOutstanding.toLocaleString('en-IN')}.`}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 bg-white/10 rounded-2xl p-3.5 border border-white/15 text-center shrink-0">
              <div className="px-2">
                <div className="text-xl font-black text-emerald-400">{summary.clearedMonthsCount}</div>
                <div className="text-[10px] text-slate-300 uppercase font-bold">Cleared</div>
              </div>
              <div className="px-2 border-x border-white/10">
                <div className="text-xl font-black text-amber-300">{summary.partialMonthsCount}</div>
                <div className="text-[10px] text-slate-300 uppercase font-bold">Partial</div>
              </div>
              <div className="px-2">
                <div className="text-xl font-black text-red-400">{summary.pendingMonthsCount}</div>
                <div className="text-[10px] text-slate-300 uppercase font-bold">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Month-wise Fee Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              Academic Year {student?.academicSession || '2026–2027'} Month-Wise Tuition Fee Ledger
            </h3>
            <span className="text-xs text-slate-500 font-medium">Session: {student?.academicSession}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Configured Fee</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {obligations.map(ob => {
                  return (
                    <tr key={ob.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <span>{ob.monthName}</span>
                        {ob.monthKey === '2026-10' && (
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded">
                            Current
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 font-mono">
                        {ob.dueDate ? ob.dueDate : 'Not specified'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ₹{ob.feeAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600">
                        ₹{ob.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        {ob.balance > 0 ? (
                          <span className="text-red-600">₹{ob.balance.toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {ob.status === 'paid' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            Paid
                          </span>
                        )}
                        {ob.status === 'partial' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Clock className="w-3 h-3" />
                            Partial (₹{ob.balance} left)
                          </span>
                        )}
                        {ob.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                            <AlertCircle className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {ob.status === 'not_due' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
                            Not Due
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section C: Complete Payment Receipt History */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              Official Fee Receipts & Payment History
            </h3>
          </div>

          {payments.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No payments recorded yet for this academic year.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {payments.map(pay => (
                <div key={pay.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {pay.receiptNumber}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700">
                        {pay.paymentMethod}
                      </span>
                      <span className="text-xs text-slate-400">
                        Date: {pay.paymentDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      Allocated to: <strong>{pay.allocations.map(a => `${a.monthName.split(' ')[0]} (₹${a.allocatedAmount})`).join(', ')}</strong>
                    </p>

                    {pay.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        Notes: {pay.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black font-mono text-emerald-600">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Verified by: {pay.recordedBy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // ADMINISTRATOR MANAGEMENT VIEW
  // ==========================================
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{content.fees?.pageTitle || 'Monthly Tuition Fee Management'}</h1>
          <p className="text-sm text-slate-600">
            {content.fees?.pageSubtitle || 'Set month-wise fee schedules, record payment receipts, view student ledgers, and export financial CSVs.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setAdminTab('students')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                adminTab === 'students' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Student Ledgers
            </button>
            <button
              onClick={() => {
                setPayStudentId(selectedStudentId);
                setAdminTab('record_payment');
              }}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                adminTab === 'record_payment' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              Record Payment
            </button>
            <button
              onClick={() => setAdminTab('reports')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                adminTab === 'reports' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Reports & CSV
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* TAB 1: STUDENT LEDGERS */}
      {adminTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Student Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchStudentQuery}
                  onChange={e => setSearchStudentQuery(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300"
                />
              </div>

              {/* Grade Filter */}
              <select
                value={filterGrade}
                onChange={e => setFilterGrade(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
              >
                <option value="All">All Grades (1–12)</option>
                {ALL_GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {allStudents
                .filter(s => {
                  if (filterGrade !== 'All' && s.grade !== filterGrade) return false;
                  if (searchStudentQuery && !s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) && !s.rollNumber.toLowerCase().includes(searchStudentQuery.toLowerCase())) return false;
                  return true;
                })
                .map(stu => {
                  const sLedger = dataStore.getStudentFeeLedger(stu.id);
                  const isSelected = stu.id === selectedStudentId;

                  return (
                    <div
                      key={stu.id}
                      onClick={() => setSelectedStudentId(stu.id)}
                      className={`p-3.5 cursor-pointer transition flex items-center justify-between ${
                        isSelected ? 'bg-sky-50/80 border-l-4 border-sky-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <StudentAvatar photoUrl={stu.photoUrl} name={stu.name} size="sm" />
                        <div>
                          <div className="font-bold text-xs text-slate-900">{stu.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {stu.rollNumber} • {stu.grade}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Paid up to: <strong className="text-slate-700">{sLedger.summary.paidUpToMonth}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {sLedger.summary.totalOutstanding > 0 ? (
                          <span className="text-[11px] font-bold text-red-600 font-mono block">
                            ₹{sLedger.summary.totalOutstanding} due
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                            Cleared
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right Detailed Ledger Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {currentLedger.student && (
              <>
                {/* Student Fee Card Header */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <StudentAvatar 
                      photoUrl={currentLedger.student.photoUrl} 
                      name={currentLedger.student.name} 
                      size="md" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {currentLedger.student.name}
                        </h2>
                        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {currentLedger.student.rollNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentLedger.student.grade} • {currentLedger.student.batch} • Parent: {currentLedger.student.parentName || 'N/A'} ({currentLedger.student.parentPhone || 'N/A'})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditStructureModal(currentLedger.student!.id)}
                      className="px-3.5 py-2 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                      Configure Month Fees
                    </button>

                    <button
                      onClick={() => {
                        setPayStudentId(currentLedger.student!.id);
                        setAdminTab('record_payment');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Record Payment
                    </button>
                  </div>
                </div>

                {/* Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Configured Fee</span>
                    <div className="text-base font-black font-mono text-slate-900 mt-0.5">
                      ₹{currentLedger.summary.totalDue.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Paid Up To</span>
                    <div className="text-sm font-bold text-sky-700 truncate mt-0.5">
                      {currentLedger.summary.paidUpToMonth}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Collected</span>
                    <div className="text-base font-black font-mono text-emerald-600 mt-0.5">
                      ₹{currentLedger.summary.totalPaid.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Balance</span>
                    <div className="text-base font-black font-mono text-red-600 mt-0.5">
                      ₹{currentLedger.summary.totalOutstanding.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Month-wise Ledger Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-900 flex items-center justify-between">
                    <span>Month-Wise Fee Breakdown & Due Dates</span>
                    <span className="text-[11px] text-slate-500 font-normal">Session: {currentLedger.student.academicSession || '2026-2027'}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-2.5 px-3">Month</th>
                          <th className="py-2.5 px-3">Due Date</th>
                          <th className="py-2.5 px-3 text-right">Fee Configured</th>
                          <th className="py-2.5 px-3 text-right">Paid</th>
                          <th className="py-2.5 px-3 text-right">Balance</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {currentLedger.obligations.map(ob => (
                          <tr key={ob.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">
                              {ob.monthName}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-sans">
                              {ob.dueDate ? ob.dueDate : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-900 font-bold">
                              ₹{ob.feeAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">
                              ₹{ob.amountPaid.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {ob.balance > 0 ? (
                                <span className="text-red-600 font-bold">₹{ob.balance.toLocaleString('en-IN')}</span>
                              ) : (
                                <span className="text-slate-400">₹0</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-sans">
                              {ob.status === 'paid' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  Paid
                                </span>
                              )}
                              {ob.status === 'partial' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                  Partial (₹{ob.balance} left)
                                </span>
                              )}
                              {ob.status === 'pending' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                                  Pending
                                </span>
                              )}
                              {ob.status === 'not_due' && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                  Not Due
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payment History & Reversal with Audit Trail */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-900 flex items-center justify-between">
                    <span>Payment History & Audit Trail</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {currentLedger.payments.length} receipts
                    </span>
                  </div>

                  {currentLedger.payments.length === 0 ? (
                    <div className="p-5 text-center text-slate-400 text-xs">
                      No payments recorded yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {currentLedger.payments.map(p => (
                        <div key={p.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">{p.receiptNumber}</span>
                              <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                {p.paymentMethod}
                              </span>
                              <span className="text-slate-400">{p.paymentDate}</span>
                            </div>
                            <div className="text-slate-600 mt-1">
                              Allocated: {p.allocations.map(a => `${a.monthName.split(' ')[0]}: ₹${a.allocatedAmount}`).join(', ')}
                            </div>
                            {p.notes && <div className="text-[11px] text-slate-500 italic mt-0.5">Note: {p.notes}</div>}
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span className="text-sm font-black font-mono text-emerald-600">
                              ₹{p.amount.toLocaleString('en-IN')}
                            </span>
                            <button
                              onClick={() => handleReversePayment(p.id)}
                              title="Reverse this payment and recompute balance"
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RECORD PAYMENT FORM */}
      {adminTab === 'record_payment' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-600" />
              Record Tuition Fee Payment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select student, payment method, and allocate payment across one or multiple months using configured fee balances.
            </p>
          </div>

          <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
            {/* Student Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Select Student
              </label>
              <select
                value={payStudentId}
                onChange={e => setPayStudentId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white font-medium"
              >
                {allStudents.map(s => {
                  const sLedger = dataStore.getStudentFeeLedger(s.id);
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber}) — {s.grade} • Due Balance: ₹{sLedger.summary.totalOutstanding}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={payDate}
                  onChange={e => setPayDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash (Front Desk)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Receipt Number (Auto or Custom)
                </label>
                <input
                  type="text"
                  value={payReceiptNo}
                  onChange={e => setPayReceiptNo(e.target.value)}
                  placeholder={`RCP-${new Date().getFullYear()}-001`}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Transaction / UPI Ref No (Optional)
                </label>
                <input
                  type="text"
                  value={payRefNo}
                  onChange={e => setPayRefNo(e.target.value)}
                  placeholder="e.g. UPI/628019482711"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            {/* Total Payment Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Total Payment Amount (₹)
                </label>
                <span className="text-xs text-slate-500 font-mono font-bold">
                  Allocated: ₹{Object.values(allocationsMap).reduce((s, a) => s + a, 0)}
                </span>
              </div>
              <input
                type="number"
                min="1"
                value={payAmount}
                onChange={e => setPayAmount(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 text-base font-bold font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Monthly Allocations Grid */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Allocate Amount Across Configured Months:
                </span>
                <span className="text-[11px] text-slate-500">
                  Monthly fees reflect configured fee schedule
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ACADEMIC_MONTHS.map(m => {
                  const studentLedger = dataStore.getStudentFeeLedger(payStudentId);
                  const obligation = studentLedger.obligations.find(o => o.monthKey === m.key);
                  const isAllocated = !!allocationsMap[m.key];
                  const configuredFee = obligation?.feeAmount || 1500;
                  const currentBalance = obligation?.balance ?? configuredFee;

                  return (
                    <div 
                      key={m.key} 
                      className={`p-2.5 rounded-xl border text-xs transition ${
                        isAllocated ? 'bg-emerald-50/70 border-emerald-300' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5 font-bold text-slate-800">
                        <span>{m.short}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Fee: ₹{configuredFee}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 mb-1 flex items-center justify-between font-mono">
                        <span>Bal Left:</span>
                        <span className={currentBalance > 0 ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                          ₹{currentBalance}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-xs font-mono">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={allocationsMap[m.key] || ''}
                          onChange={e => handleAllocationChange(m.key, Number(e.target.value))}
                          placeholder="0"
                          className="w-full px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Payment Remarks / Notes
              </label>
              <input
                type="text"
                value={payNotes}
                onChange={e => setPayNotes(e.target.value)}
                placeholder="e.g. Paid in full by parent at office"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAdminTab('students')}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Submit Payment & Update Ledger
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: FINANCIAL REPORTS & CSV */}
      {adminTab === 'reports' && (
        <div className="space-y-5">
          {/* Top Aggregate Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-400 block">Total Fees Due (Academic Session)</span>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                ₹{allObligations.filter(o => o.status !== 'not_due').reduce((s, o) => s + o.feeAmount, 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Across all active students</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-emerald-600 block">Total Collected</span>
              <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
                ₹{allPayments.filter(p => !p.isReversed).reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Verified received receipts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-red-600 block">Total Outstanding</span>
              <div className="text-2xl font-black font-mono text-red-600 mt-1">
                ₹{Math.max(0, 
                  allObligations.filter(o => o.status !== 'not_due').reduce((s, o) => s + o.feeAmount, 0) -
                  allPayments.filter(p => !p.isReversed).reduce((s, p) => s + p.amount, 0)
                ).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Pending across students</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase text-amber-600 block">Students with Pending Dues</span>
              <div className="text-2xl font-black font-mono text-amber-600 mt-1">
                {allStudents.filter(s => dataStore.getStudentFeeLedger(s.id).summary.totalOutstanding > 0).length}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Out of {allStudents.length} enrolled</span>
            </div>
          </div>

          {/* Report Table Header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Comprehensive Tuition Fee Statements
                </h3>
                <p className="text-xs text-slate-500">
                  Month-wise configured fees, collected amounts, and balance statements
                </p>
              </div>

              <button
                onClick={handleExportFeesCsv}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export Ledger to CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Grade & Batch</th>
                    <th className="py-3 px-4 text-right">Annual Configured Fee</th>
                    <th className="py-3 px-4 text-center">Paid Up To</th>
                    <th className="py-3 px-4 text-right">Collected</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {allStudents.map(stu => {
                    const sLedger = dataStore.getStudentFeeLedger(stu.id);

                    return (
                      <tr key={stu.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                          {stu.name} ({stu.rollNumber})
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-600">
                          {stu.grade} • {stu.batch}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-800 font-bold">
                          ₹{sLedger.summary.totalDue.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-center font-sans font-bold text-sky-700">
                          {sLedger.summary.paidUpToMonth}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600">
                          ₹{sLedger.summary.totalPaid.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-bold">
                          {sLedger.summary.totalOutstanding > 0 ? (
                            <span className="text-red-600">₹{sLedger.summary.totalOutstanding.toLocaleString('en-IN')}</span>
                          ) : (
                            <span className="text-slate-400">₹0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-sans">
                          <button
                            onClick={() => {
                              setSelectedStudentId(stu.id);
                              setAdminTab('students');
                            }}
                            className="text-xs font-semibold text-sky-600 hover:underline cursor-pointer"
                          >
                            View Ledger →
                          </button>
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

      {/* MONTH-WISE FEE SCHEDULE EDITOR MODAL */}
      {isEditStructureOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-400" />
                  Month-Wise Tuition Fee Schedule
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Configure individual monthly tuition fees and optional due dates for every month.
                </p>
              </div>
              <button 
                onClick={() => setIsEditStructureOpen(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <form onSubmit={handleSaveFeeScheduleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Top Controls: Student Selector & Academic Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Selected Student
                  </label>
                  <select
                    value={editStudentId}
                    onChange={e => handleOpenEditStructureModal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900"
                  >
                    {allStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNumber}) — {s.grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Academic Year Session
                  </label>
                  <input
                    type="text"
                    value={editAcademicSession}
                    onChange={e => setEditAcademicSession(e.target.value)}
                    placeholder="2026-2027"
                    required
                    className="w-full px-3 py-2 font-mono font-bold rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* "Apply the Same Fee to All Months" Banner */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5 text-sky-600" />
                    Quick Action: Set Uniform Monthly Fee
                  </span>
                  <span className="text-[11px] text-sky-700 font-medium">
                    Optionally copy one fee to all 12 months
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono font-bold select-none z-10">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={quickSameFee}
                      onChange={e => {
                        const val = e.target.value;
                        setQuickSameFee(val === '' ? '' : Number(val));
                      }}
                      placeholder="1500"
                      className="w-full pl-8 pr-3 py-2 text-xs font-mono font-bold rounded-xl border border-sky-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplySameFeeToAll}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
                  >
                    Apply Same Fee to All Months
                  </button>
                </div>
              </div>

              {/* Month-Wise Fee Schedule Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
                  <span>Academic Session Month-Wise Fee Table ({ACADEMIC_MONTHS.length} Months)</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Student: {editingStudent?.name} ({editingStudent?.rollNumber})
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="grid grid-cols-12 bg-slate-50 p-2.5 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                    <div className="col-span-4">Academic Month</div>
                    <div className="col-span-4">Tuition Fee (₹)</div>
                    <div className="col-span-4">Due Date (Optional)</div>
                  </div>

                  {ACADEMIC_MONTHS.map(m => {
                    const item = editSchedule[m.key] || { feeAmount: 1500, dueDate: '' };

                    return (
                      <div key={m.key} className="grid grid-cols-12 items-center p-2.5 gap-2 hover:bg-slate-50/80 transition">
                        <div className="col-span-4 font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{m.name}</span>
                        </div>

                        <div className="col-span-4 flex items-center gap-1 relative">
                          <span className="absolute left-2.5 text-slate-400 font-mono font-bold text-xs select-none z-10">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={item.feeAmount}
                            onChange={e => {
                              const val = e.target.value;
                              const numVal = val === '' ? 0 : Number(val);
                              setEditSchedule({
                                ...editSchedule,
                                [m.key]: {
                                  ...item,
                                  feeAmount: isNaN(numVal) ? 0 : numVal
                                }
                              });
                            }}
                            required
                            className="w-full pl-7 pr-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-sky-500/20"
                          />
                        </div>

                        <div className="col-span-4">
                          <input
                            type="text"
                            value={item.dueDate || ''}
                            onChange={e => {
                              setEditSchedule({
                                ...editSchedule,
                                [m.key]: {
                                  ...item,
                                  dueDate: e.target.value
                                }
                              });
                            }}
                            placeholder="e.g. 10th of month"
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300 font-mono bg-white text-slate-900"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Summary Footer Strip inside modal */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Academic Year Tuition Fee</span>
                  <span className="text-xs text-slate-300">Sum across all 12 configured months</span>
                </div>
                <div className="text-xl font-black font-mono text-emerald-400">
                  ₹{totalScheduleFeeSum.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditStructureOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition cursor-pointer"
                >
                  Save Fee Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
