export type UserRole = 'admin' | 'teacher' | 'student';
export type StudentStatus = 'active' | 'inactive' | 'archived';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email?: string;
  password: string; // Plaintext or hash in local store
  grade: string; // Grade 1 to Grade 10 (or Grade I to Grade X)
  batch: string;
  phone?: string;
  parentPhone?: string;
  parentWhatsapp?: string;
  parentName?: string;
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  motherPhone?: string;
  dateOfAdmission?: string;
  photoUrl?: string;
  parentConsent?: boolean;
  status: StudentStatus;
  joinedDate: string;
  archivedAt?: string;
  archivedPreviousBatch?: string;
  archivedReason?: string;
  // Fee configuration
  monthlyFee: number; // e.g. 1500 (default fallback)
  feeStartMonth: string; // e.g. "2026-04"
  academicSession: string; // e.g. "2026-2027"
  monthlyFeeSchedule?: Record<string, { feeAmount: number; dueDate?: string }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface TeacherPermissions {
  canTakeAttendance: boolean;
  canCreateTests: boolean;
  canEnterMarks: boolean;
  canScheduleClasses: boolean;
  canManageMaterials: boolean;
}

export interface Teacher {
  id: string;
  teacherId: string; // e.g. "TCH-001" (unique login identifier)
  name: string;
  email: string;
  phone?: string;
  password: string;
  assignedGrades: string[]; // e.g. ["Grade 9", "Grade 10"]
  assignedSubjects: string[]; // e.g. ["Mathematics", "Physics"]
  assignedBatchIds: string[]; // e.g. ["batch-10-m", "batch-9-f"]
  status: 'active' | 'inactive' | 'archived';
  isArchived?: boolean;
  archivedAt?: string;
  archivedReason?: string;
  joinedDate: string;
  permissions: TeacherPermissions;
}

export interface EntryExitRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  grade: string;
  batch: string;
  date: string; // YYYY-MM-DD
  entryTime?: string; // HH:mm AM/PM
  entryTimestamp?: string;
  exitTime?: string; // HH:mm AM/PM
  exitTimestamp?: string;
  status: 'Not Arrived' | 'Present' | 'Exited' | 'Incomplete';
  fatherPhone?: string;
  motherPhone?: string;
  notificationSent?: boolean;
  entryNotificationStatus?: 'sent' | 'failed' | 'pending';
  exitNotificationStatus?: 'sent' | 'failed' | 'pending';
  recordedBy: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
  correctionReason?: string;
}

export type AuthUser = 
  | { role: 'admin'; data: AdminUser }
  | { role: 'teacher'; data: Teacher }
  | { role: 'student'; data: Student };

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  grade: string;
  batch: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: AttendanceStatus;
  entryTime?: string; // e.g. "07:05 AM"
  departureTime?: string; // e.g. "08:30 AM"
  recordedAt: string;
  recordedBy: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
}

export interface ClassBatch {
  id: string;
  name: string;
  grade: string; // Grade 1 to Grade 10
  subjects?: string;
  timings?: string;
  days?: string;
  teacherName?: string;
  description?: string;
  room?: string;
  schedule?: string;
  instructorName?: string;
  isArchived?: boolean;
  archivedAt?: string;
  archivedReason?: string;
}

export type FeeObligationStatus = 'paid' | 'partial' | 'pending' | 'not_due';

export interface FeeObligation {
  id: string; // `${studentId}_${monthKey}`
  studentId: string;
  studentName: string;
  grade: string;
  batch: string;
  academicSession: string; // e.g. "2026-2027"
  monthKey: string; // "2026-04", "2026-05", etc.
  monthName: string; // "April 2026", "May 2026", etc.
  feeAmount: number; // e.g. 1500
  dueDate?: string; // e.g. "10th April 2026" or "2026-04-10"
  amountPaid: number; // Total allocated payments
  balance: number; // feeAmount - amountPaid
  status: FeeObligationStatus;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Other';

export interface PaymentAllocation {
  monthKey: string;
  monthName: string;
  allocatedAmount: number;
}

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  receiptNumber?: string;
  referenceNumber?: string;
  notes?: string;
  allocations: PaymentAllocation[];
  recordedBy: string;
  recordedAt: string;
  isReversed?: boolean;
  reversalReason?: string;
}

export interface FeeAuditLog {
  id: string;
  timestamp: string;
  action: 'payment_recorded' | 'payment_corrected' | 'payment_reversed' | 'fee_updated';
  performedBy: string;
  studentId: string;
  details: string;
}

export type ClassType = 'Online' | 'In-Person';
export type ClassScheduleStatus = 'scheduled' | 'completed' | 'cancelled';

export interface OnlineClass {
  id: string;
  title: string;
  grade: string; // Grade 1 to Grade 12
  batch: string;
  subject: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "06:00 PM – 07:15 PM"
  startTime?: string; // e.g. "18:00"
  endTime?: string; // e.g. "19:15"
  classType?: ClassType; // 'Online' | 'In-Person'
  meetUrl: string; // Meeting link if online or venue note if in-person
  instructorName?: string;
  teacherId?: string;
  teacherName?: string;
  instructions?: string;
  status?: ClassScheduleStatus; // 'scheduled' | 'completed' | 'cancelled'
  isPublished: boolean;
  createdAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: string; // 'All' | 'Grade 1' .. 'Grade 12' or formatted summary
  targetType?: 'all' | 'single_grade' | 'multiple_grades' | 'batch';
  targetGrades?: string[]; // e.g. ['Grade 9', 'Grade 10']
  targetBatch?: string; // batch name or id
  isPinned: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
  publishedAt: string;
  publishedBy: string;
  isArchived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
}

export interface TestRecord {
  id: string;
  name: string; // e.g. "Unit Test 1 - Algebra", "Term 1 Science Assessment"
  grade: string; // Grade 1 to Grade 12
  subject: string; // Mathematics, Science, Physics, Chemistry, etc.
  testDate: string; // YYYY-MM-DD
  maxMarks: number; // e.g. 50, 100
  batch: string; // 'All' or specific batch name
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  createdBy: string;
  showLeaderboard?: boolean; // Whether students in this grade can view top scores
}

export type TestResultStatus = 'Pass' | 'Fail' | 'Absent' | 'Pending';

export interface StudentTestMark {
  id: string; // `${testId}_${studentId}`
  testId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  grade: string;
  batch: string;
  subject: string;
  marksObtained: number | null; // null if absent/unmarked
  isAbsent: boolean;
  maxMarks: number;
  percentage: number; // (marksObtained / maxMarks) * 100
  resultStatus: TestResultStatus;
  remarks?: string;
  lastNotifiedMarks?: number | null; // Tracks previous marks to avoid duplicate notification
  isPublished: boolean;
  enteredAt: string;
  updatedAt: string;
}

export interface MonthlyRankingConfig {
  minCompletedTests: number; // Default 1 or 2
  showStudentLeaderboard: boolean; // Admin can toggle whether students see full leaderboard or only their own rank
  passingPercentage: number; // e.g. 40
}

export interface RankedStudent {
  rank: number;
  studentId: string;
  studentName: string;
  rollNumber: string;
  grade: string;
  batch: string;
  marksObtained?: number;
  maxMarks?: number;
  percentage: number;
  testsCompleted?: number;
  resultStatus?: string;
  isQualified?: boolean;
  unqualifiedReason?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  grade: string; // Grade 1 to Grade 12
  batch?: string; // Optional specific batch or 'All Batches'
  subject: string;
  chapter: string;
  fileUrl: string;
  fileName?: string;
  fileType: 'pdf' | 'link' | 'video';
  externalUrl?: string;
  isPublished: boolean;
  status?: 'draft' | 'published';
  uploadedByTeacherId?: string;
  uploadedByName?: string;
  uploadedAt: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  caption: string;
  eventName: string;
  eventDate: string;
  imageUrl: string;
  isPublished: boolean;
  uploadedAt: string;
}

export interface ContactSettings {
  institutionName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  website: string;
  mapsUrl: string;
  workingHours: string;
  logoUrl?: string; // Persistent uploaded official PhiMatiCs Classes logo
}

export interface GeneralContent {
  appName: string;
  tagline: string;
  welcomeMessage: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  website: string;
  mapsUrl: string;
  workingHours: string;
  footerText: string;
  logoUrl?: string;
}

export interface LoginContent {
  heading: string;
  description: string;
  studentTabLabel: string;
  studentInstruction: string;
  adminTabLabel: string;
  adminInstruction: string;
  idFieldLabel: string;
  passwordFieldLabel: string;
  submitButton: string;
  helpText: string;
}

export interface DashboardContent {
  heroHeading: string;
  heroSubtitle: string;
  adminWelcome: string;
  adminSubtitle: string;
  studentWelcomePrefix: string;
  statsStudentsLabel: string;
  statsBatchesLabel: string;
  statsMaterialsLabel: string;
  statsFeesLabel: string;
  announcementsSectionTitle: string;
  quickActionsTitle: string;
}

export interface NavigationContent {
  brandName: string;
  brandTagline: string;
  navHome: string;
  navBatches: string;
  navAttendance: string;
  navFees: string;
  navAnnouncements: string;
  navMaterials: string;
  navOnlineClasses: string;
  navGallery: string;
  navContact: string;
  navAppSettings: string;
  navManageStudents: string;
  signInButton: string;
  signOutButton: string;
}

export interface BatchesContent {
  pageTitle: string;
  pageSubtitle: string;
  studentSubtitle: string;
  addBatchButton: string;
  createModalTitle: string;
  editModalTitle: string;
  fieldBatchName: string;
  fieldGrade: string;
  fieldSubjects: string;
  fieldTimings: string;
  fieldDays: string;
  fieldTeacher: string;
  fieldDescription: string;
  assignStudentsButton: string;
  emptyStateMessage: string;
}

export interface AttendanceContent {
  pageTitle: string;
  pageSubtitle: string;
  instructions: string;
  statusPresent: string;
  statusAbsent: string;
  statusLeave: string;
  markAllPresentButton: string;
  saveAttendanceButton: string;
}

export interface FeesContent {
  pageTitle: string;
  pageSubtitle: string;
  paymentInstructions: string;
  recordPaymentButton: string;
  statusPaid: string;
  statusPartial: string;
  statusPending: string;
  statusNotDue: string;
  reminderTemplate: string;
  downloadReceiptButton: string;
}

export interface AnnouncementsContent {
  pageTitle: string;
  pageSubtitle: string;
  newAnnouncementButton: string;
  defaultAudienceLabel: string;
  pinNoticeLabel: string;
  defaultTemplate: string;
}

export interface MaterialsClassesGalleryContent {
  materialsTitle: string;
  materialsSubtitle: string;
  uploadMaterialButton: string;
  classesTitle: string;
  classesSubtitle: string;
  scheduleClassButton: string;
  joinClassButton: string;
  galleryTitle: string;
  gallerySubtitle: string;
  addPhotoButton: string;
}

export interface FormsButtonsContent {
  saveChangesButton: string;
  cancelButton: string;
  deleteButton: string;
  editButton: string;
  closeButton: string;
  searchPlaceholder: string;
  filterAllGrades: string;
  confirmDeletePrompt: string;
  successSavedMessage: string;
}

export interface AppContentConfig {
  general: GeneralContent;
  login: LoginContent;
  dashboard: DashboardContent;
  navigation: NavigationContent;
  batches: BatchesContent;
  attendance: AttendanceContent;
  fees: FeesContent;
  announcements: AnnouncementsContent;
  materialsAndClasses: MaterialsClassesGalleryContent;
  formsAndButtons: FormsButtonsContent;
}

export type NotificationCategory = 
  | 'attendance' 
  | 'announcement' 
  | 'fee_payment' 
  | 'fee_reminder' 
  | 'test_marks' 
  | 'class_schedule' 
  | 'study_material' 
  | 'system';

export interface AppNotification {
  id: string;
  recipientStudentId: string; // Target student ID or 'all'
  recipientName?: string;
  recipientEmail?: string;
  recipientRollNumber?: string;
  parentWhatsapp?: string;
  category: NotificationCategory;
  title: string;
  message: string;
  createdAt: string; // ISO string
  isRead: boolean;
  actionUrl?: string; // 'attendance' | 'announcements' | 'fees' | 'test-marks'
  actionPayload?: {
    announcementId?: string;
    testId?: string;
    date?: string;
    monthKey?: string;
    amount?: number;
    balance?: number;
    batch?: string;
    status?: string;
    receiptNumber?: string;
    marksObtained?: number | null;
    maxMarks?: number;
    percentage?: number;
  };
  deliveryStatus: 'delivered' | 'read' | 'failed';
  inAppStatus: 'delivered' | 'read' | 'failed';
  whatsappStatus: 'queued' | 'sent' | 'delivered' | 'failed' | 'not_applicable';
  whatsappErrorMessage?: string;
  channel: 'in_app' | 'whatsapp' | 'both';
}

export interface NotificationSettings {
  inAppEnabled: boolean;
  whatsappEnabled: boolean;
  attendanceEnabled: boolean;
  announcementsEnabled: boolean;
  feePaymentsEnabled: boolean;
  feeRemindersEnabled: boolean;
  testMarksEnabled: boolean;
  feeDueDayOfMonth: number; // e.g. 15
  reminderPreDueDays: number; // e.g. 3 days before
  reminderOverdueDays: number; // e.g. 5 days after
  browserPushEnabled: boolean;
  whatsappApiKey?: string;
  whatsappPhoneNumberId?: string;
  whatsappTemplateStatus?: 'approved' | 'pending' | 'unconfigured';
}

export interface AdminOtpSession {
  email: string;
  otpHash: string;
  expiresAt: number;
  resendAvailableAt: number;
  attemptsLeft: number;
  isUsed: boolean;
}

export interface AppDatabase {
  students: Student[];
  teachers: Teacher[];
  batches: ClassBatch[];
  attendance: AttendanceRecord[];
  entryExitRecords?: EntryExitRecord[];
  feeObligations: FeeObligation[];
  feePayments: FeePayment[];
  feeAuditLogs: FeeAuditLog[];
  onlineClasses: OnlineClass[];
  announcements: Announcement[];
  materials: StudyMaterial[];
  tests: TestRecord[];
  testMarks: StudentTestMark[];
  rankingConfig: MonthlyRankingConfig;
  gallery: GalleryImage[];
  contact: ContactSettings;
  appContent: AppContentConfig;
  notifications: AppNotification[];
  notificationSettings: NotificationSettings;
  adminCredentials: {
    email: string;
    passwordHash: string; // Default admin password
  };
  lastUpdated: string;
  isCustomized: boolean; // True if admin added or edited records
}
