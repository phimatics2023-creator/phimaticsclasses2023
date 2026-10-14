import React, { useState, useRef } from 'react';
import { AuthUser, Student } from '../types';
import { dataStore } from '../services/storage';
import { StudentAvatar } from './StudentAvatar';
import { compressImage } from '../utils/imageCompressor';
import { 
  User, 
  Camera, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  ShieldCheck, 
  BookOpen, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  CreditCard, 
  CalendarCheck2, 
  KeyRound, 
  Award, 
  Building2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface StudentProfileViewProps {
  currentUser: AuthUser | null;
  onSelectTab: (tab: string) => void;
  onOpenChangePassword?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  currentUser,
  onSelectTab,
  onOpenChangePassword
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Strictly ensure student record is retrieved from dataStore or active session
  let student: Student | undefined;
  if (currentUser?.role === 'student') {
    student = dataStore.getStudentById(currentUser.data.id) || currentUser.data;
  } else if (currentUser?.role === 'admin') {
    // If an admin opens this view without student context, fallback to first active student
    student = dataStore.getStudents()[0];
  }

  if (!student) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto my-12 shadow-sm">
        <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Student Profile Not Found</h3>
        <p className="text-sm text-slate-500 mt-1">Please sign in with a valid student account to access your profile details.</p>
      </div>
    );
  }

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast('error', 'Invalid file format. Please upload a JPG, JPEG, PNG, or WebP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('error', 'File size exceeds limit (5MB). Please select a smaller photo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    compressImage(file, 300, 300, 0.7)
      .then((compressedDataUrl) => {
        setSelectedPreview(compressedDataUrl);
        setIsUploading(false);
      })
      .catch((err) => {
        console.error('Failed to compress image:', err);
        showToast('error', 'Failed to process image file. Please try another photo.');
        setIsUploading(false);
      });
  };

  const handleSavePhoto = async () => {
    if (!selectedPreview || !student) return;

    try {
      // Ensure optimized compression before saving to persistent storage
      const finalCompressed = await compressImage(selectedPreview, 256, 256, 0.7);
      const result = dataStore.updateStudentProfilePicture(student.id, finalCompressed);
      if (result.success) {
        setSelectedPreview(null);
        showToast('success', 'Profile photo updated and synchronized persistently!');
      } else {
        showToast('error', result.message || 'Failed to update profile photo.');
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save profile photo.');
    }
  };

  const handleRemovePhoto = () => {
    if (!student) return;

    if (window.confirm('Are you sure you want to remove your profile photo and revert to the default avatar?')) {
      const result = dataStore.updateStudentProfilePicture(student.id, '');
      if (result.success) {
        setSelectedPreview(null);
        showToast('success', 'Profile photo removed successfully.');
      } else {
        showToast('error', result.message || 'Failed to remove profile photo.');
      }
    }
  };

  const handleCancelPreview = () => {
    setSelectedPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Fetch student metrics for profile summary
  const attendanceData = dataStore.getStudentAttendance(student.id);
  const attendanceStats = attendanceData.stats;
  const feeLedger = dataStore.getStudentFeeLedger(student.id);

  const displayPhoto = selectedPreview || student.photoUrl;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="flex-1">{feedback.message}</span>
          <button 
            onClick={() => setFeedback(null)} 
            className="p-1 rounded-lg hover:bg-black/5 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Graphic Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-sky-600 via-indigo-600 to-slate-900 relative p-6 flex items-end">
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
            <span>Verified Student Account</span>
          </div>
        </div>

        {/* Profile Avatar & Primary Controls */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar container */}
            <div className="relative group self-center sm:self-auto">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                {displayPhoto ? (
                  <img 
                    src={displayPhoto} 
                    alt={student.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <StudentAvatar name={student.name} size="2xl" />
                )}
              </div>

              {/* Upload Trigger Badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change profile photo"
                className="absolute bottom-1 right-1 p-2.5 bg-slate-900 text-white rounded-full shadow-lg hover:bg-sky-600 transition cursor-pointer ring-2 ring-white"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
              {selectedPreview ? (
                <>
                  <button
                    onClick={handleSavePhoto}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Photo</span>
                  </button>
                  <button
                    onClick={handleCancelPreview}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-sky-400" />
                    <span>{student.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                  </button>

                  {student.photoUrl && (
                    <button
                      onClick={handleRemovePhoto}
                      className="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </>
              )}

              {onOpenChangePassword && (
                <button
                  onClick={onOpenChangePassword}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Change Password</span>
                </button>
              )}
            </div>
          </div>

          {/* Student Header Summary */}
          <div className="text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {student.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-black font-mono bg-sky-100 text-sky-800 border border-sky-200">
                {student.rollNumber}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {student.grade}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                {student.status.toUpperCase()}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="flex items-center gap-1 font-medium">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>{student.batch || 'Unassigned Batch'}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Session {student.academicSession || '2026-2027'}</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Profile Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Academic Details</h3>
              <p className="text-xs text-slate-500">Official student registration records</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Full Name</span>
              <span className="font-bold text-slate-900">{student.name}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Roll Number</span>
              <span className="font-bold font-mono text-slate-900">{student.rollNumber}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Current Grade</span>
              <span className="font-bold text-slate-900">{student.grade}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Assigned Batch</span>
              <span className="font-bold text-sky-700">{student.batch || 'Unassigned'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Academic Session</span>
              <span className="font-bold text-slate-900">{student.academicSession || '2026-2027'}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Date of Admission / Joined</span>
              <span className="font-bold text-slate-900">{student.joinedDate || '2026-04-01'}</span>
            </div>
          </div>
        </div>

        {/* Contact & Parent Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Contact & Parent Info</h3>
              <p className="text-xs text-slate-500">Registered phone, email & guardian details</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </span>
              <span className="font-bold text-slate-900">{student.email || 'Not provided'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Student Phone
              </span>
              <span className="font-bold text-slate-900">{student.phone || 'Not provided'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Parent / Guardian Name</span>
              <span className="font-bold text-slate-900">{student.parentName || student.fatherName || student.motherName || 'Not provided'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Parent Phone
              </span>
              <span className="font-bold text-slate-900">{student.parentPhone || student.fatherPhone || student.motherPhone || 'Not provided'}</span>
            </div>

            {student.parentWhatsapp && (
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">WhatsApp Number</span>
                <span className="font-bold text-emerald-700">{student.parentWhatsapp}</span>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Attendance Stats</h3>
                <p className="text-xs text-slate-500">Live summary of recorded sessions</p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('attendance')}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Percentage</span>
              <span className={`text-xl font-black font-mono ${
                attendanceStats.percentage >= 75 ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {attendanceStats.percentage}%
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Present</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {attendanceStats.present}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Total Classes</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {attendanceStats.total}
              </span>
            </div>
          </div>
        </div>

        {/* Fee Account Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Fee Structure & Status</h3>
                <p className="text-xs text-slate-500">Tuition schedule and payments</p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('fees')}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Fee Account
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Monthly Fee</span>
              <span className="text-lg font-black text-slate-900 font-mono">
                ₹{student.monthlyFee?.toLocaleString('en-IN') || '1,500'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Current Due Balance</span>
              <span className={`text-lg font-black font-mono ${
                feeLedger.summary.totalOutstanding > 0 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                ₹{feeLedger.summary.totalOutstanding.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
