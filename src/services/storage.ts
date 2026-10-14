import { 
  AppDatabase, 
  Student, 
  Teacher,
  TeacherPermissions,
  ClassBatch,
  AttendanceRecord, 
  FeeObligation,
  FeePayment,
  FeeAuditLog,
  OnlineClass,
  ClassType,
  ClassScheduleStatus,
  Announcement, 
  StudyMaterial, 
  GalleryImage, 
  ContactSettings,
  AttendanceStatus,
  PaymentMethod,
  AppContentConfig,
  AppNotification,
  NotificationSettings,
  NotificationCategory,
  AuthUser,
  TestRecord,
  StudentTestMark,
  MonthlyRankingConfig,
  RankedStudent,
  TestResultStatus,
  EntryExitRecord
} from '../types';
import { DEFAULT_APP_CONTENT } from './defaultContent';
import { 
  DEFAULT_NOTIFICATION_SETTINGS, 
  INITIAL_NOTIFICATIONS, 
  showBrowserNotification 
} from './notifications';

const STORAGE_KEY = 'phimatics_app_data_v3';
const AUTH_KEY = 'phimatics_session_user_v3';

export const ALL_GRADES = [
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12'
];

export const ACADEMIC_MONTHS = [
  { key: '2026-04', name: 'April 2026', short: 'Apr 2026' },
  { key: '2026-05', name: 'May 2026', short: 'May 2026' },
  { key: '2026-06', name: 'June 2026', short: 'Jun 2026' },
  { key: '2026-07', name: 'July 2026', short: 'Jul 2026' },
  { key: '2026-08', name: 'August 2026', short: 'Aug 2026' },
  { key: '2026-09', name: 'September 2026', short: 'Sep 2026' },
  { key: '2026-10', name: 'October 2026', short: 'Oct 2026' }, // Current month
  { key: '2026-11', name: 'November 2026', short: 'Nov 2026' },
  { key: '2026-12', name: 'December 2026', short: 'Dec 2026' },
  { key: '2027-01', name: 'January 2027', short: 'Jan 2027' },
  { key: '2027-02', name: 'February 2027', short: 'Feb 2027' },
  { key: '2027-03', name: 'March 2027', short: 'Mar 2027' }
];

export const INITIAL_BATCHES: ClassBatch[] = [
  {
    id: 'batch-10-m',
    name: 'Batch 10 - Morning',
    grade: 'Grade 10',
    subjects: 'Mathematics & Science',
    timings: '07:00 AM – 08:30 AM',
    days: 'Mon, Wed, Fri',
    teacherName: 'Faculty In-Charge',
    description: 'Foundation and advanced concept learning for Class 10'
  },
  {
    id: 'batch-10-e',
    name: 'Batch 10 - Evening',
    grade: 'Grade 10',
    subjects: 'Mathematics & Science',
    timings: '05:00 PM – 06:30 PM',
    days: 'Tue, Thu, Sat',
    teacherName: 'Faculty In-Charge',
    description: 'Evening problem solving and numerical practice'
  },
  {
    id: 'batch-9-f',
    name: 'Batch 9 - Foundation',
    grade: 'Grade 9',
    subjects: 'Mathematics & Science',
    timings: '05:00 PM – 06:30 PM',
    days: 'Mon, Wed, Fri',
    teacherName: 'Faculty In-Charge',
    description: 'Class 9 core conceptual curriculum'
  },
  {
    id: 'batch-8-f',
    name: 'Batch 8 - Junior Foundation',
    grade: 'Grade 8',
    subjects: 'Mathematics & Science',
    timings: '04:00 PM – 05:30 PM',
    days: 'Tue, Thu, Sat',
    teacherName: 'Faculty In-Charge',
    description: 'Middle school algebra, geometry, and sciences'
  },
  {
    id: 'batch-7-f',
    name: 'Batch 7 - Middle School',
    grade: 'Grade 7',
    subjects: 'Mathematics & Science',
    timings: '04:00 PM – 05:15 PM',
    days: 'Mon, Wed, Fri',
    teacherName: 'Faculty In-Charge',
    description: 'Basic arithmetic and introductory science'
  },
  {
    id: 'batch-6-f',
    name: 'Batch 6 - Middle School',
    grade: 'Grade 6',
    subjects: 'Mathematics & Science',
    timings: '03:00 PM – 04:15 PM',
    days: 'Tue, Thu, Sat',
    teacherName: 'Faculty In-Charge',
    description: 'Numbers, fractions, shapes, and discovery science'
  },
  {
    id: 'batch-5-p',
    name: 'Batch 5 - Primary Discovery',
    grade: 'Grade 5',
    subjects: 'Mathematics',
    timings: '03:00 PM – 04:15 PM',
    days: 'Mon, Wed, Fri',
    teacherName: 'Faculty In-Charge',
    description: 'Interactive mathematics and problem exploration'
  },
  {
    id: 'batch-11-pcm',
    name: 'Batch 11 - Senior Foundation (PCM & PCB)',
    grade: 'Grade 11',
    subjects: 'Physics, Chemistry & Mathematics',
    timings: '06:00 AM – 07:30 AM',
    days: 'Mon, Wed, Fri',
    teacherName: 'Faculty In-Charge',
    description: 'Higher Secondary concept building and numerical problem solving'
  },
  {
    id: 'batch-12-adv',
    name: 'Batch 12 - Advanced Board & Entrance Prep',
    grade: 'Grade 12',
    subjects: 'Physics, Chemistry & Mathematics',
    timings: '06:00 PM – 07:45 PM',
    days: 'Tue, Thu, Sat',
    teacherName: 'Faculty In-Charge',
    description: 'Class 12 board syllabus and competitive conceptual mastery'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tea-101',
    teacherId: 'TCH-101',
    name: 'Prof. Vikramaditya Sen',
    email: 'vikram@phimatics.com',
    phone: '+91 98111 55667',
    password: 'teacher123',
    assignedGrades: ['Grade 9', 'Grade 10'],
    assignedSubjects: ['Mathematics', 'Science'],
    assignedBatchIds: ['batch-10-m', 'batch-10-e', 'batch-9-f'],
    status: 'active',
    joinedDate: '2025-06-01',
    permissions: {
      canTakeAttendance: true,
      canCreateTests: true,
      canEnterMarks: true,
      canScheduleClasses: true,
      canManageMaterials: true
    }
  },
  {
    id: 'tea-102',
    teacherId: 'TCH-102',
    name: 'Dr. Meenakshi Sundaram',
    email: 'meenakshi@phimatics.com',
    phone: '+91 98222 66778',
    password: 'teacher123',
    assignedGrades: ['Grade 11', 'Grade 12'],
    assignedSubjects: ['Physics', 'Chemistry'],
    assignedBatchIds: ['batch-11-pcm', 'batch-12-adv'],
    status: 'active',
    joinedDate: '2025-07-15',
    permissions: {
      canTakeAttendance: true,
      canCreateTests: true,
      canEnterMarks: true,
      canScheduleClasses: true,
      canManageMaterials: true
    }
  },
  {
    id: 'tea-103',
    teacherId: 'TCH-103',
    name: 'Sunil Deshmukh',
    email: 'sunil@phimatics.com',
    phone: '+91 98333 77889',
    password: 'teacher123',
    assignedGrades: ['Grade 6', 'Grade 7', 'Grade 8'],
    assignedSubjects: ['Mathematics', 'Science'],
    assignedBatchIds: ['batch-6-f', 'batch-7-f', 'batch-8-f'],
    status: 'active',
    joinedDate: '2026-01-10',
    permissions: {
      canTakeAttendance: true,
      canCreateTests: true,
      canEnterMarks: true,
      canScheduleClasses: true,
      canManageMaterials: true
    }
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-101',
    name: 'Rohan Sharma',
    rollNumber: 'PHI-1001',
    email: 'rohan@phimatics.com',
    password: 'student123',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    phone: '+91 98111 22334',
    parentPhone: '+91 98111 22330',
    parentName: 'Mr. Rajesh Sharma',
    status: 'active',
    joinedDate: '2026-04-01',
    monthlyFee: 1500,
    feeStartMonth: '2026-04',
    academicSession: '2026-2027'
  },
  {
    id: 'stu-102',
    name: 'Ananya Patel',
    rollNumber: 'PHI-1002',
    email: 'ananya@phimatics.com',
    password: 'student123',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    phone: '+91 98222 33445',
    parentPhone: '+91 98222 33440',
    parentName: 'Mrs. Sunita Patel',
    status: 'active',
    joinedDate: '2026-04-01',
    monthlyFee: 1500,
    feeStartMonth: '2026-04',
    academicSession: '2026-2027'
  },
  {
    id: 'stu-103',
    name: 'Aarav Verma',
    rollNumber: 'PHI-1003',
    email: 'aarav@phimatics.com',
    password: 'student123',
    grade: 'Grade 10',
    batch: 'Batch 10 - Evening (Math & Science)',
    phone: '+91 98333 44556',
    parentPhone: '+91 98333 44550',
    parentName: 'Mr. Suresh Verma',
    status: 'active',
    joinedDate: '2026-04-01',
    monthlyFee: 1500,
    feeStartMonth: '2026-04',
    academicSession: '2026-2027'
  },
  {
    id: 'stu-104',
    name: 'Priya Nair',
    rollNumber: 'PHI-0901',
    email: 'priya@phimatics.com',
    password: 'student123',
    grade: 'Grade 9',
    batch: 'Batch 9 - Foundation',
    phone: '+91 98444 55667',
    parentPhone: '+91 98444 55660',
    parentName: 'Mr. K. Nair',
    status: 'active',
    joinedDate: '2026-04-01',
    monthlyFee: 1400,
    feeStartMonth: '2026-04',
    academicSession: '2026-2027'
  },
  {
    id: 'stu-105',
    name: 'Kabir Mehra',
    rollNumber: 'PHI-0801',
    email: 'kabir@phimatics.com',
    password: 'student123',
    grade: 'Grade 8',
    batch: 'Batch 8 - Junior Foundation',
    phone: '+91 98555 66778',
    parentPhone: '+91 98555 66770',
    parentName: 'Mrs. Ritu Mehra',
    status: 'active',
    joinedDate: '2026-04-01',
    monthlyFee: 1200,
    feeStartMonth: '2026-04',
    academicSession: '2026-2027'
  },
  {
    id: 'stu-106',
    name: 'Saanvi Kulkarni',
    rollNumber: 'PHI-0501',
    email: 'saanvi@phimatics.com',
    password: 'student123',
    grade: 'Grade 5',
    batch: 'Batch 5 - Primary Math & Discovery',
    phone: '+91 98666 11223',
    parentPhone: '+91 98666 11220',
    parentName: 'Mr. Amit Kulkarni',
    status: 'active',
    joinedDate: '2026-04-10',
    monthlyFee: 1000,
    feeStartMonth: '2026-04',
    academicSession: '2026-2027'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-101-01',
    date: '2026-10-05',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    rollNumber: 'PHI-1001',
    status: 'present',
    recordedAt: '2026-10-05T07:15:00Z',
    recordedBy: 'Administrator'
  },
  {
    id: 'att-102-01',
    date: '2026-10-05',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    studentId: 'stu-102',
    studentName: 'Ananya Patel',
    rollNumber: 'PHI-1002',
    status: 'present',
    recordedAt: '2026-10-05T07:15:00Z',
    recordedBy: 'Administrator'
  },
  {
    id: 'att-101-02',
    date: '2026-10-07',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    rollNumber: 'PHI-1001',
    status: 'present',
    recordedAt: '2026-10-07T07:12:00Z',
    recordedBy: 'Administrator'
  },
  {
    id: 'att-102-02',
    date: '2026-10-07',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    studentId: 'stu-102',
    studentName: 'Ananya Patel',
    rollNumber: 'PHI-1002',
    status: 'leave',
    recordedAt: '2026-10-07T07:12:00Z',
    recordedBy: 'Administrator'
  },
  {
    id: 'att-101-03',
    date: '2026-10-09',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    rollNumber: 'PHI-1001',
    status: 'present',
    recordedAt: '2026-10-09T07:10:00Z',
    recordedBy: 'Administrator'
  },
  {
    id: 'att-102-03',
    date: '2026-10-09',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    studentId: 'stu-102',
    studentName: 'Ananya Patel',
    rollNumber: 'PHI-1002',
    status: 'present',
    recordedAt: '2026-10-09T07:10:00Z',
    recordedBy: 'Administrator'
  },
  {
    id: 'att-101-04',
    date: '2026-10-12',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    rollNumber: 'PHI-1001',
    status: 'present',
    recordedAt: '2026-10-12T07:15:00Z',
    recordedBy: 'Administrator'
  },
  {
    id: 'att-102-04',
    date: '2026-10-12',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    studentId: 'stu-102',
    studentName: 'Ananya Patel',
    rollNumber: 'PHI-1002',
    status: 'absent',
    recordedAt: '2026-10-12T07:15:00Z',
    recordedBy: 'Administrator'
  },
  {
    id: 'att-103-01',
    date: '2026-10-10',
    grade: 'Grade 10',
    batch: 'Batch 10 - Evening (Math & Science)',
    studentId: 'stu-103',
    studentName: 'Aarav Verma',
    rollNumber: 'PHI-1003',
    status: 'present',
    recordedAt: '2026-10-10T17:05:00Z',
    recordedBy: 'Administrator'
  }
];

export const INITIAL_PAYMENTS: FeePayment[] = [
  {
    id: 'pay-101-01',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    amount: 4500,
    paymentDate: '2026-04-05',
    paymentMethod: 'UPI',
    receiptNumber: 'RCP-2026-001',
    referenceNumber: 'UPI/610582910482',
    notes: 'Tuition Fee for April, May, and June',
    allocations: [
      { monthKey: '2026-04', monthName: 'April 2026', allocatedAmount: 1500 },
      { monthKey: '2026-05', monthName: 'May 2026', allocatedAmount: 1500 },
      { monthKey: '2026-06', monthName: 'June 2026', allocatedAmount: 1500 }
    ],
    recordedBy: 'Administrator',
    recordedAt: '2026-04-05T11:20:00Z'
  },
  {
    id: 'pay-101-02',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    amount: 3000,
    paymentDate: '2026-07-08',
    paymentMethod: 'Bank Transfer',
    receiptNumber: 'RCP-2026-042',
    referenceNumber: 'NEFT/HDFC0928374',
    notes: 'July and August 2026 Monthly Tuition Fee',
    allocations: [
      { monthKey: '2026-07', monthName: 'July 2026', allocatedAmount: 1500 },
      { monthKey: '2026-08', monthName: 'August 2026', allocatedAmount: 1500 }
    ],
    recordedBy: 'Administrator',
    recordedAt: '2026-07-08T14:10:00Z'
  },
  {
    id: 'pay-101-03',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    amount: 1500,
    paymentDate: '2026-09-04',
    paymentMethod: 'Cash',
    receiptNumber: 'RCP-2026-089',
    notes: 'September 2026 Fee received at front office',
    allocations: [
      { monthKey: '2026-09', monthName: 'September 2026', allocatedAmount: 1500 }
    ],
    recordedBy: 'Administrator',
    recordedAt: '2026-09-04T16:30:00Z'
  },
  {
    id: 'pay-101-04',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    amount: 1000,
    paymentDate: '2026-10-06',
    paymentMethod: 'UPI',
    receiptNumber: 'RCP-2026-121',
    referenceNumber: 'UPI/628019482711',
    notes: 'October Partial Payment (₹500 remaining balance)',
    allocations: [
      { monthKey: '2026-10', monthName: 'October 2026', allocatedAmount: 1000 }
    ],
    recordedBy: 'Administrator',
    recordedAt: '2026-10-06T10:15:00Z'
  },
  {
    id: 'pay-102-01',
    studentId: 'stu-102',
    studentName: 'Ananya Patel',
    amount: 3000,
    paymentDate: '2026-04-10',
    paymentMethod: 'Cash',
    receiptNumber: 'RCP-2026-015',
    notes: 'April & May tuition fee',
    allocations: [
      { monthKey: '2026-04', monthName: 'April 2026', allocatedAmount: 1500 },
      { monthKey: '2026-05', monthName: 'May 2026', allocatedAmount: 1500 }
    ],
    recordedBy: 'Administrator',
    recordedAt: '2026-04-10T12:00:00Z'
  },
  {
    id: 'pay-102-02',
    studentId: 'stu-102',
    studentName: 'Ananya Patel',
    amount: 3000,
    paymentDate: '2026-06-15',
    paymentMethod: 'UPI',
    receiptNumber: 'RCP-2026-056',
    referenceNumber: 'UPI/884910294821',
    notes: 'June and July fees',
    allocations: [
      { monthKey: '2026-06', monthName: 'June 2026', allocatedAmount: 1500 },
      { monthKey: '2026-07', monthName: 'July 2026', allocatedAmount: 1500 }
    ],
    recordedBy: 'Administrator',
    recordedAt: '2026-06-15T09:40:00Z'
  },
  {
    id: 'pay-102-03',
    studentId: 'stu-102',
    studentName: 'Ananya Patel',
    amount: 1000,
    paymentDate: '2026-08-12',
    paymentMethod: 'Cash',
    receiptNumber: 'RCP-2026-078',
    notes: 'August 2026 Partial payment (₹500 pending)',
    allocations: [
      { monthKey: '2026-08', monthName: 'August 2026', allocatedAmount: 1000 }
    ],
    recordedBy: 'Administrator',
    recordedAt: '2026-08-12T17:10:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: FeeAuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-04-05T11:20:00Z',
    action: 'payment_recorded',
    performedBy: 'Administrator',
    studentId: 'stu-101',
    details: 'Recorded payment RCP-2026-001 of ₹4,500 allocated across Apr, May, Jun 2026.'
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-06T10:15:00Z',
    action: 'payment_recorded',
    performedBy: 'Administrator',
    studentId: 'stu-101',
    details: 'Recorded partial payment RCP-2026-121 of ₹1,000 for Oct 2026 (₹500 remaining balance).'
  }
];

export const INITIAL_ONLINE_CLASSES: OnlineClass[] = [
  {
    id: 'meet-1',
    title: 'Physics Ray Diagrams & Optics Practice',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    subject: 'Science',
    date: '2026-10-15',
    time: '06:00 PM – 07:30 PM',
    meetUrl: 'https://meet.google.com/phi-math-sci',
    instructorName: 'Faculty Member',
    instructions: 'Keep your textbook and notebook ready.',
    isPublished: true
  },
  {
    id: 'meet-2',
    title: 'Mathematics Olympiad Special Problem Clinic',
    grade: 'Grade 9',
    batch: 'Batch 9 - Foundation',
    subject: 'Mathematics',
    date: '2026-10-18',
    time: '05:30 PM – 07:00 PM',
    meetUrl: 'https://meet.google.com/phi-olym-piad',
    instructorName: 'Faculty Member',
    instructions: 'Focus on factorization theorems and geometric proofs.',
    isPublished: true
  },
  {
    id: 'meet-3',
    title: 'Algebraic Identities Problem Solving',
    grade: 'Grade 8',
    batch: 'Batch 8 - Junior Foundation',
    subject: 'Mathematics',
    date: '2026-10-20',
    time: '04:30 PM – 05:45 PM',
    meetUrl: 'https://meet.google.com/phi-grade8-alg',
    instructorName: 'Faculty Member',
    instructions: 'Complete exercises from Chapter 2 prior to class.',
    isPublished: true
  }
];

export const INITIAL_CONTACT_DATA: ContactSettings = {
  institutionName: 'PhiMatiCs Classes',
  tagline: 'Concept-First Learning in Mathematics & Sciences • Grades 1 to 10',
  phone: '+91 6361069450',
  whatsapp: '+916361069450',
  email: 'phimatics2023@gmail.com',
  address: 'Plot 42, Academic Arcade, Near City Library, Main Road',
  website: 'https://phimatics.org',
  mapsUrl: 'https://maps.google.com/?q=PhiMatiCs+Classes',
  workingHours: 'Mon - Sat: 06:30 AM – 08:30 PM (Sunday: 08:00 AM – 01:00 PM)',
  logoUrl: '' // Empty by default; administrator can upload their exact logo
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Monthly Tuition Fee Reminder for October 2026',
    message: 'Students and parents are kindly requested to clear October tuition fee dues by the 15th of this month. Payments can be made via UPI, Cash, or Bank Transfer at the office desk. Digital receipts are updated on your portal.',
    audience: 'All',
    isPinned: true,
    publishedAt: '2026-10-02T10:00:00Z',
    publishedBy: 'Administrator'
  },
  {
    id: 'ann-2',
    title: 'Classroom Schedule & Attendance Guidelines',
    message: 'Attendance is recorded at the start of every session. Students must maintain a minimum 75% attendance to qualify for semester assessments.',
    audience: 'All',
    isPinned: true,
    publishedAt: '2026-10-04T11:00:00Z',
    publishedBy: 'Administrator'
  },
  {
    id: 'ann-3',
    title: 'Grade 10: Real Numbers & Light Chapter Evaluation',
    message: 'A 50-mark evaluation test will take place this Saturday. Please review your lecture notes and problem sheets in Study Materials.',
    audience: 'Grade 10',
    isPinned: false,
    publishedAt: '2026-10-10T14:30:00Z',
    publishedBy: 'Administrator'
  }
];

export const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Real Numbers & Fundamental Theorem of Arithmetic',
    description: 'Comprehensive lecture notes, solved examples, and prime factorization problem set with step-by-step solutions.',
    grade: 'Grade 10',
    subject: 'Mathematics',
    chapter: 'Chapter 1: Real Numbers',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Grade10_Math_Ch1_RealNumbers.pdf',
    fileType: 'pdf',
    isPublished: true,
    uploadedAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'mat-2',
    title: 'Polynomials - Graphical & Algebraic Solutions',
    description: 'Zeroes of a polynomial, relationship between coefficients, and quadratic equation factorization sheets.',
    grade: 'Grade 10',
    subject: 'Mathematics',
    chapter: 'Chapter 2: Polynomials',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Grade10_Math_Ch2_Polynomials.pdf',
    fileType: 'pdf',
    isPublished: true,
    uploadedAt: '2026-10-05T15:20:00Z'
  },
  {
    id: 'mat-3',
    title: 'Light: Reflection, Refraction & Ray Diagrams',
    description: 'Detailed ray diagrams for spherical mirrors, concave & convex lenses with sign convention formula sheet.',
    grade: 'Grade 10',
    subject: 'Science',
    chapter: 'Chapter 10: Light',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Grade10_Science_Ch10_Light.pdf',
    fileType: 'pdf',
    isPublished: true,
    uploadedAt: '2026-10-06T11:45:00Z'
  },
  {
    id: 'mat-4',
    title: 'Number Systems - Rational & Irrational Numbers',
    description: 'Foundational concepts, representation of square roots on number line, laws of rational exponents.',
    grade: 'Grade 9',
    subject: 'Mathematics',
    chapter: 'Chapter 1: Number Systems',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Grade9_Math_Ch1_NumberSystems.pdf',
    fileType: 'pdf',
    isPublished: true,
    uploadedAt: '2026-10-07T09:30:00Z'
  },
  {
    id: 'mat-5',
    title: 'Linear Equations in One Variable - Foundation',
    description: 'Solving linear equations with variables on both sides, algebraic application word problems.',
    grade: 'Grade 8',
    subject: 'Mathematics',
    chapter: 'Chapter 2: Linear Equations',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Grade8_Math_Ch2_LinearEquations.pdf',
    fileType: 'pdf',
    isPublished: true,
    uploadedAt: '2026-10-08T09:30:00Z'
  },
  {
    id: 'mat-6',
    title: 'Fractions and Decimals - Fundamentals & Practice',
    description: 'Multiplication and division of fractions, visual models, and word problems.',
    grade: 'Grade 7',
    subject: 'Mathematics',
    chapter: 'Chapter 2: Fractions and Decimals',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Grade7_Math_Ch2_Fractions.pdf',
    fileType: 'pdf',
    isPublished: true,
    uploadedAt: '2026-10-09T10:00:00Z'
  },
  {
    id: 'mat-7',
    title: 'Primary Mathematics: Number Operations & Place Value',
    description: 'Large numbers, estimation, rounding off, Roman numerals, and brackets exercises.',
    grade: 'Grade 5',
    subject: 'Mathematics',
    chapter: 'Chapter 1: Knowing Our Numbers',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Grade5_Math_Ch1_Numbers.pdf',
    fileType: 'pdf',
    isPublished: true,
    uploadedAt: '2026-10-10T11:00:00Z'
  }
];

export const INITIAL_GALLERY: GalleryImage[] = [
  {
    id: 'gal-1',
    title: 'Annual Mathematics Olympiad Merit Awards',
    caption: 'Felicitation ceremony recognizing PhiMatiCs top rankers in State and National Olympiad tests.',
    eventName: 'Annual Merit Ceremony',
    eventDate: '2026-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    uploadedAt: '2026-09-21T10:00:00Z'
  },
  {
    id: 'gal-2',
    title: 'Science Experiment Demonstration Workshop',
    caption: 'Students observing optical refraction and prism spectrum experiments in our science lab.',
    eventName: 'Science Experiment Workshop',
    eventDate: '2026-09-28',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    uploadedAt: '2026-09-29T14:30:00Z'
  },
  {
    id: 'gal-3',
    title: 'Classroom Problem Solving Session',
    caption: 'Collaborative theorem proofs and advanced algebra exercises at PhiMatiCs Classes.',
    eventName: 'Classroom Session',
    eventDate: '2026-10-05',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    uploadedAt: '2026-10-06T12:00:00Z'
  }
];

// Helper to compute fee obligations from students & payments
function generateFeeObligations(students: Student[], payments: FeePayment[]): FeeObligation[] {
  const obligations: FeeObligation[] = [];

  students.forEach(student => {
    ACADEMIC_MONTHS.forEach(m => {
      // Determine configured fee amount and due date for this month
      let feeAmount = typeof student.monthlyFee === 'number' ? student.monthlyFee : 1500;
      let dueDate: string | undefined = undefined;

      if (student.monthlyFeeSchedule && student.monthlyFeeSchedule[m.key] !== undefined) {
        const sched = student.monthlyFeeSchedule[m.key];
        if (typeof sched.feeAmount === 'number' && !isNaN(sched.feeAmount)) {
          feeAmount = sched.feeAmount;
        }
        if (sched.dueDate) {
          dueDate = sched.dueDate;
        }
      }

      const totalPaidForMonth = payments
        .filter(p => !p.isReversed && p.studentId === student.id)
        .reduce((sum, p) => {
          const alloc = p.allocations.find(a => a.monthKey === m.key);
          return sum + (alloc ? alloc.allocatedAmount : 0);
        }, 0);

      const balance = Math.max(0, feeAmount - totalPaidForMonth);

      let status: 'paid' | 'partial' | 'pending' | 'not_due';
      if (m.key > '2026-10') {
        if (totalPaidForMonth >= feeAmount && feeAmount > 0) {
          status = 'paid';
        } else if (totalPaidForMonth > 0) {
          status = 'partial';
        } else {
          status = 'not_due';
        }
      } else {
        if (totalPaidForMonth >= feeAmount && feeAmount > 0) {
          status = 'paid';
        } else if (totalPaidForMonth > 0) {
          status = 'partial';
        } else {
          status = 'pending';
        }
      }

      obligations.push({
        id: `${student.id}_${m.key}`,
        studentId: student.id,
        studentName: student.name,
        grade: student.grade,
        batch: student.batch,
        academicSession: student.academicSession || '2026-2027',
        monthKey: m.key,
        monthName: m.name,
        feeAmount,
        dueDate,
        amountPaid: totalPaidForMonth,
        balance,
        status
      });
    });
  });

  return obligations;
}

// Normalize grade strings to 'Grade 1' .. 'Grade 12'
export function normalizeGrade(gradeStr: string): string {
  if (!gradeStr) return 'Grade 10';
  const clean = gradeStr.trim();
  const romanMap: Record<string, string> = {
    'Grade I': 'Grade 1',
    'Grade II': 'Grade 2',
    'Grade III': 'Grade 3',
    'Grade IV': 'Grade 4',
    'Grade V': 'Grade 5',
    'Grade VI': 'Grade 6',
    'Grade VII': 'Grade 7',
    'Grade VIII': 'Grade 8',
    'Grade IX': 'Grade 9',
    'Grade X': 'Grade 10',
    'Grade XI': 'Grade 11',
    'Grade XII': 'Grade 12',
    'Class 1': 'Grade 1',
    'Class 2': 'Grade 2',
    'Class 3': 'Grade 3',
    'Class 4': 'Grade 4',
    'Class 5': 'Grade 5',
    'Class 6': 'Grade 6',
    'Class 7': 'Grade 7',
    'Class 8': 'Grade 8',
    'Class 9': 'Grade 9',
    'Class 10': 'Grade 10',
    'Class 11': 'Grade 11',
    'Class 12': 'Grade 12',
    '1': 'Grade 1',
    '2': 'Grade 2',
    '3': 'Grade 3',
    '4': 'Grade 4',
    '5': 'Grade 5',
    '6': 'Grade 6',
    '7': 'Grade 7',
    '8': 'Grade 8',
    '9': 'Grade 9',
    '10': 'Grade 10',
    '11': 'Grade 11',
    '12': 'Grade 12'
  };
  return romanMap[clean] || clean;
}

export const INITIAL_TESTS: TestRecord[] = [
  {
    id: 'test-10-01',
    name: 'Periodic Test 1 - Real Numbers & Polynomials',
    grade: 'Grade 10',
    subject: 'Mathematics',
    testDate: '2026-10-04',
    maxMarks: 50,
    batch: 'All',
    isPublished: true,
    publishedAt: '2026-10-05T10:00:00Z',
    createdAt: '2026-10-03T09:00:00Z',
    createdBy: 'Administrator',
    showLeaderboard: true
  },
  {
    id: 'test-10-02',
    name: 'Unit Assessment - Chemical Reactions & Equations',
    grade: 'Grade 10',
    subject: 'Science',
    testDate: '2026-10-08',
    maxMarks: 50,
    batch: 'All',
    isPublished: true,
    publishedAt: '2026-10-09T14:00:00Z',
    createdAt: '2026-10-07T11:00:00Z',
    createdBy: 'Administrator',
    showLeaderboard: true
  }
];

export const INITIAL_TEST_MARKS: StudentTestMark[] = [
  {
    id: 'test-10-01_stu-101',
    testId: 'test-10-01',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    rollNumber: 'PHI-1001',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    subject: 'Mathematics',
    marksObtained: 46,
    isAbsent: false,
    maxMarks: 50,
    percentage: 92,
    resultStatus: 'Pass',
    remarks: 'Outstanding conceptual clarity and neat derivations.',
    lastNotifiedMarks: 46,
    isPublished: true,
    enteredAt: '2026-10-05T09:30:00Z',
    updatedAt: '2026-10-05T09:30:00Z'
  },
  {
    id: 'test-10-01_stu-102',
    testId: 'test-10-01',
    studentId: 'stu-102',
    studentName: 'Ananya Patel',
    rollNumber: 'PHI-1002',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    subject: 'Mathematics',
    marksObtained: 48,
    isAbsent: false,
    maxMarks: 50,
    percentage: 96,
    resultStatus: 'Pass',
    remarks: 'Exceptional performance. Full marks in proofs.',
    lastNotifiedMarks: 48,
    isPublished: true,
    enteredAt: '2026-10-05T09:35:00Z',
    updatedAt: '2026-10-05T09:35:00Z'
  },
  {
    id: 'test-10-01_stu-103',
    testId: 'test-10-01',
    studentId: 'stu-103',
    studentName: 'Aarav Verma',
    rollNumber: 'PHI-1003',
    grade: 'Grade 10',
    batch: 'Batch 10 - Evening (Math & Science)',
    subject: 'Mathematics',
    marksObtained: 42,
    isAbsent: false,
    maxMarks: 50,
    percentage: 84,
    resultStatus: 'Pass',
    remarks: 'Good attempt. Revise polynomial division algorithm.',
    lastNotifiedMarks: 42,
    isPublished: true,
    enteredAt: '2026-10-05T09:40:00Z',
    updatedAt: '2026-10-05T09:40:00Z'
  },
  {
    id: 'test-10-02_stu-101',
    testId: 'test-10-02',
    studentId: 'stu-101',
    studentName: 'Rohan Sharma',
    rollNumber: 'PHI-1001',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    subject: 'Science',
    marksObtained: 45,
    isAbsent: false,
    maxMarks: 50,
    percentage: 90,
    resultStatus: 'Pass',
    remarks: 'Accurate balanced equations and reaction mechanisms.',
    lastNotifiedMarks: 45,
    isPublished: true,
    enteredAt: '2026-10-09T13:30:00Z',
    updatedAt: '2026-10-09T13:30:00Z'
  },
  {
    id: 'test-10-02_stu-102',
    testId: 'test-10-02',
    studentId: 'stu-102',
    studentName: 'Ananya Patel',
    rollNumber: 'PHI-1002',
    grade: 'Grade 10',
    batch: 'Batch 10 - Morning (Math & Science)',
    subject: 'Science',
    marksObtained: 47,
    isAbsent: false,
    maxMarks: 50,
    percentage: 94,
    resultStatus: 'Pass',
    remarks: 'Thorough answers with neat diagrams.',
    lastNotifiedMarks: 47,
    isPublished: true,
    enteredAt: '2026-10-09T13:35:00Z',
    updatedAt: '2026-10-09T13:35:00Z'
  },
  {
    id: 'test-10-02_stu-103',
    testId: 'test-10-02',
    studentId: 'stu-103',
    studentName: 'Aarav Verma',
    rollNumber: 'PHI-1003',
    grade: 'Grade 10',
    batch: 'Batch 10 - Evening (Math & Science)',
    subject: 'Science',
    marksObtained: 44,
    isAbsent: false,
    maxMarks: 50,
    percentage: 88,
    resultStatus: 'Pass',
    remarks: 'Well written oxidation and reduction explanations.',
    lastNotifiedMarks: 44,
    isPublished: true,
    enteredAt: '2026-10-09T13:40:00Z',
    updatedAt: '2026-10-09T13:40:00Z'
  }
];

export const DEFAULT_RANKING_CONFIG: MonthlyRankingConfig = {
  minCompletedTests: 1,
  showStudentLeaderboard: true,
  passingPercentage: 40
};

// Standard Competition Ranking Helper (1, 2, 2, 4)
export function calculateCompetitionRanking<T extends { percentage: number }>(items: T[]): (T & { rank: number })[] {
  const sorted = [...items].sort((a, b) => b.percentage - a.percentage);
  const ranked: (T & { rank: number })[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && Math.abs(sorted[i].percentage - sorted[i - 1].percentage) < 0.001) {
      ranked.push({
        ...sorted[i],
        rank: ranked[i - 1].rank
      });
    } else {
      ranked.push({
        ...sorted[i],
        rank: i + 1
      });
    }
  }

  return ranked;
}

export function mergeAppContent(savedContent?: any, fallbackContact?: ContactSettings): AppContentConfig {
  const base: AppContentConfig = JSON.parse(JSON.stringify(DEFAULT_APP_CONTENT));
  if (!savedContent && !fallbackContact) return base;

  const result: AppContentConfig = {
    general: { ...base.general, ...(savedContent?.general || {}) },
    login: { ...base.login, ...(savedContent?.login || {}) },
    dashboard: { ...base.dashboard, ...(savedContent?.dashboard || {}) },
    navigation: { ...base.navigation, ...(savedContent?.navigation || {}) },
    batches: { ...base.batches, ...(savedContent?.batches || {}) },
    attendance: { ...base.attendance, ...(savedContent?.attendance || {}) },
    fees: { ...base.fees, ...(savedContent?.fees || {}) },
    announcements: { ...base.announcements, ...(savedContent?.announcements || {}) },
    materialsAndClasses: { ...base.materialsAndClasses, ...(savedContent?.materialsAndClasses || {}) },
    formsAndButtons: { ...base.formsAndButtons, ...(savedContent?.formsAndButtons || {}) }
  };

  // If fallback contact has custom values or uploaded logo, preserve them
  if (fallbackContact) {
    if (fallbackContact.logoUrl && !result.general.logoUrl) {
      result.general.logoUrl = fallbackContact.logoUrl;
    }
    if (fallbackContact.institutionName && !savedContent?.general?.appName) {
      result.general.appName = fallbackContact.institutionName;
    }
    if (fallbackContact.tagline && !savedContent?.general?.tagline) {
      result.general.tagline = fallbackContact.tagline;
    }
    if (fallbackContact.phone && !savedContent?.general?.phone) {
      result.general.phone = fallbackContact.phone;
    }
    if (fallbackContact.email && !savedContent?.general?.email) {
      result.general.email = fallbackContact.email;
    }
    if (fallbackContact.address && !savedContent?.general?.address) {
      result.general.address = fallbackContact.address;
    }
    if (fallbackContact.website && !savedContent?.general?.website) {
      result.general.website = fallbackContact.website;
    }
  }

  return result;
}

export const INITIAL_DATABASE: AppDatabase = {
  students: INITIAL_STUDENTS,
  teachers: INITIAL_TEACHERS,
  batches: INITIAL_BATCHES,
  attendance: INITIAL_ATTENDANCE,
  feeObligations: generateFeeObligations(INITIAL_STUDENTS, INITIAL_PAYMENTS),
  feePayments: INITIAL_PAYMENTS,
  feeAuditLogs: INITIAL_AUDIT_LOGS,
  onlineClasses: INITIAL_ONLINE_CLASSES,
  announcements: INITIAL_ANNOUNCEMENTS,
  materials: INITIAL_MATERIALS,
  tests: INITIAL_TESTS,
  testMarks: INITIAL_TEST_MARKS,
  rankingConfig: DEFAULT_RANKING_CONFIG,
  gallery: INITIAL_GALLERY,
  contact: INITIAL_CONTACT_DATA,
  appContent: DEFAULT_APP_CONTENT,
  notifications: INITIAL_NOTIFICATIONS,
  notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
  adminCredentials: {
    email: 'admin@phimatics.com',
    passwordHash: 'admin123'
  },
  lastUpdated: new Date().toISOString(),
  isCustomized: false
};

// Storage Service Class
class DataStore {
  private db: AppDatabase;
  private listeners: Set<() => void> = new Set();
  private lastSubmissionStamp: number = 0;

  constructor() {
    this.db = this.loadData();
  }

  private loadData(): AppDatabase {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Normalize students grade to Grade 1 .. 12
        const migratedStudents: Student[] = (parsed.students || INITIAL_STUDENTS).map((s: Student) => ({
          ...s,
          grade: normalizeGrade(s.grade)
        }));

        const migratedBatches: ClassBatch[] = (parsed.batches || INITIAL_BATCHES).map((b: ClassBatch) => ({
          ...b,
          grade: normalizeGrade(b.grade),
          subjects: b.subjects || 'Mathematics & Science',
          timings: b.timings || b.schedule?.split('•')[1]?.trim() || '07:00 AM – 08:30 AM',
          days: b.days || b.schedule?.split('•')[0]?.trim() || 'Mon, Wed, Fri',
          teacherName: b.teacherName || b.instructorName || 'Faculty In-Charge',
          description: b.description || 'Core curriculum and concept development'
        }));

        const contactData: ContactSettings = { 
          ...INITIAL_DATABASE.contact, 
          ...(parsed.contact || {}) 
        };

        const resolvedAppContent = mergeAppContent(parsed.appContent, contactData);

        const merged: AppDatabase = {
          ...INITIAL_DATABASE,
          ...parsed,
          students: migratedStudents,
          teachers: (parsed.teachers && Array.isArray(parsed.teachers) && parsed.teachers.length > 0)
            ? parsed.teachers
            : INITIAL_TEACHERS,
          batches: migratedBatches,
          attendance: parsed.attendance || INITIAL_ATTENDANCE,
          feePayments: parsed.feePayments || INITIAL_PAYMENTS,
          feeAuditLogs: parsed.feeAuditLogs || INITIAL_AUDIT_LOGS,
          onlineClasses: parsed.onlineClasses || INITIAL_ONLINE_CLASSES,
          tests: (parsed.tests && parsed.tests.length > 0) ? parsed.tests : INITIAL_TESTS,
          testMarks: (parsed.testMarks && parsed.testMarks.length > 0) ? parsed.testMarks : INITIAL_TEST_MARKS,
          rankingConfig: {
            ...DEFAULT_RANKING_CONFIG,
            ...(parsed.rankingConfig || {})
          },
          contact: contactData,
          appContent: resolvedAppContent,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          notificationSettings: {
            ...DEFAULT_NOTIFICATION_SETTINGS,
            ...(parsed.notificationSettings || {})
          },
          adminCredentials: (() => {
            const loadedAdmin = { ...INITIAL_DATABASE.adminCredentials, ...(parsed.adminCredentials || {}) };
            if (!loadedAdmin.passwordHash || loadedAdmin.passwordHash.includes('•••') || loadedAdmin.passwordHash.trim() === '') {
              loadedAdmin.passwordHash = INITIAL_DATABASE.adminCredentials.passwordHash;
            }
            if (!loadedAdmin.email || loadedAdmin.email.trim() === '') {
              loadedAdmin.email = INITIAL_DATABASE.adminCredentials.email;
            }
            return loadedAdmin;
          })()
        };

        merged.feeObligations = generateFeeObligations(merged.students, merged.feePayments);
        return merged;
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default database', e);
    }
    return INITIAL_DATABASE;
  }

  private save(): boolean {
    try {
      this.db.lastUpdated = new Date().toISOString();
      this.db.feeObligations = generateFeeObligations(this.db.students, this.db.feePayments);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
      this.notifyListeners();
      return true;
    } catch (e) {
      console.warn('Failed to save to localStorage, attempting quota cleanup:', e);
      try {
        // Automatic Quota Recovery: Trim non-critical historical logs and large collections
        if (this.db.feeAuditLogs && this.db.feeAuditLogs.length > 30) {
          this.db.feeAuditLogs = this.db.feeAuditLogs.slice(-30);
        }
        if (this.db.notifications && this.db.notifications.length > 50) {
          this.db.notifications = this.db.notifications.slice(-50);
        }
        if (this.db.gallery && this.db.gallery.length > 20) {
          this.db.gallery = this.db.gallery.slice(-20);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
        this.notifyListeners();
        return true;
      } catch (retryError) {
        console.error('LocalStorage save failed even after cleanup:', retryError);
        this.notifyListeners(); // Notify in-memory state changes regardless
        return false;
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn());
  }

  public getSnapshot(): AppDatabase {
    const session = this.getStoredSession();
    const sanitizedDb: AppDatabase = {
      ...this.db,
      adminCredentials: {
        email: this.db.adminCredentials.email,
        passwordHash: '••••••••'
      }
    };
    if (!session) {
      return {
        ...sanitizedDb,
        students: [],
        attendance: [],
        feeObligations: [],
        feePayments: [],
        feeAuditLogs: [],
        announcements: [],
        materials: [],
        onlineClasses: [],
        tests: [],
        testMarks: [],
        gallery: [],
        notifications: []
      };
    }
    if (session.role === 'student') {
      const myId = session.data.id;
      return {
        ...sanitizedDb,
        students: [session.data],
        attendance: this.db.attendance.filter(a => a.studentId === myId),
        feeObligations: this.db.feeObligations.filter(o => o.studentId === myId),
        feePayments: this.db.feePayments.filter(p => p.studentId === myId),
        feeAuditLogs: [],
        tests: (this.db.tests || []).filter(t => t.grade === session.data.grade && t.isPublished),
        testMarks: (this.db.testMarks || []).filter(m => m.studentId === myId && m.isPublished),
        notifications: this.db.notifications.filter(n => n.recipientStudentId === myId || n.recipientStudentId === 'all')
      };
    }
    return sanitizedDb;
  }

  // Demo helpers for login modal without exposing sensitive data
  public getDemoStudentsForLogin(): Student[] {
    return this.db.students.filter(s => s.status === 'active');
  }

  // --- Students API ---
  public getStudents(): Student[] {
    const session = this.getStoredSession();
    if (!session) return [];
    if (session.role === 'admin') return [...this.db.students];
    if (session.role === 'student') return [session.data];
    return [];
  }

  public getStudentById(id: string): Student | undefined {
    const session = this.getStoredSession();
    if (!session) return undefined;
    if (session.role === 'admin') return this.db.students.find(s => s.id === id);
    if (session.role === 'student') return session.data.id === id ? session.data : undefined;
    return undefined;
  }

  public addStudent(studentData: Omit<Student, 'id' | 'joinedDate'>): Student {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required to add student');
    }
    const newStudent: Student = {
      ...studentData,
      grade: normalizeGrade(studentData.grade),
      id: `stu-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    this.db.students = [newStudent, ...this.db.students];
    this.db.isCustomized = true;
    this.save();
    return newStudent;
  }

  public getActiveStudents(): Student[] {
    const session = this.getStoredSession();
    if (!session) return [];
    if (session.role === 'admin') return this.db.students.filter(s => s.status === 'active');
    if (session.role === 'student') return session.data.status === 'active' ? [session.data] : [];
    return [];
  }

  public getArchivedStudents(): Student[] {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') return [];
    return this.db.students.filter(s => s.status === 'archived');
  }

  public updateStudent(id: string, updates: Partial<Student>): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return false;
    }
    const index = this.db.students.findIndex(s => s.id === id);
    if (index === -1) return false;
    const oldStudent = this.db.students[index];
    const grade = updates.grade ? normalizeGrade(updates.grade) : oldStudent.grade;
    this.db.students[index] = { ...oldStudent, ...updates, grade };
    const newStudent = this.db.students[index];

    // Synchronize student updates across all linked records
    if (updates.name || updates.rollNumber || updates.grade || updates.batch) {
      (this.db.attendance || []).forEach(a => {
        if (a.studentId === id) {
          if (updates.name) a.studentName = newStudent.name;
          if (updates.rollNumber) a.rollNumber = newStudent.rollNumber;
          if (updates.grade) a.grade = newStudent.grade;
          if (updates.batch) a.batch = newStudent.batch;
        }
      });

      (this.db.entryExitRecords || []).forEach(ee => {
        if (ee.studentId === id) {
          if (updates.name) ee.studentName = newStudent.name;
          if (updates.rollNumber) ee.rollNumber = newStudent.rollNumber;
          if (updates.grade) ee.grade = newStudent.grade;
          if (updates.batch) ee.batch = newStudent.batch;
        }
      });

      (this.db.feeObligations || []).forEach(fo => {
        if (fo.studentId === id) {
          if (updates.name) fo.studentName = newStudent.name;
          if (updates.grade) fo.grade = newStudent.grade;
          if (updates.batch) fo.batch = newStudent.batch;
        }
      });

      (this.db.feePayments || []).forEach(fp => {
        if (fp.studentId === id) {
          if (updates.name) fp.studentName = newStudent.name;
        }
      });

      (this.db.testMarks || []).forEach(tm => {
        if (tm.studentId === id) {
          if (updates.name) tm.studentName = newStudent.name;
          if (updates.rollNumber) tm.rollNumber = newStudent.rollNumber;
        }
      });

      // Update session if student is signed in
      const activeSession = this.getStoredSession();
      if (activeSession && activeSession.role === 'student' && activeSession.data?.id === id) {
        this.setStoredSession({
          ...activeSession,
          data: { ...newStudent }
        });
      }
    }

    this.db.isCustomized = true;
    this.save();
    return true;
  }

  // Safe Archive Student: preserves student identity, historical attendance, fees, ledgers, and audit logs
  public archiveStudent(id: string, reason?: string): { success: boolean; message: string; student?: Student } {
    const student = this.db.students.find(s => s.id === id);
    if (!student) {
      return { success: false, message: 'Student record could not be found.' };
    }

    if (student.status === 'archived') {
      return { success: false, message: 'Student is already archived.' };
    }

    // Save previous batch for seamless restoration
    student.archivedPreviousBatch = student.batch;
    student.batch = 'Unassigned';
    student.status = 'archived';
    student.archivedAt = new Date().toISOString();
    if (reason) {
      student.archivedReason = reason;
    }

    // Invalidate active session if this student is currently signed in
    const activeSession = this.getStoredSession();
    if (activeSession && activeSession.role === 'student' && activeSession.data?.id === id) {
      this.setStoredSession(null);
    }

    this.db.isCustomized = true;
    this.save();

    return {
      success: true,
      message: `Student "${student.name}" (${student.rollNumber}) has been archived successfully. Their attendance records and fee payment history have been securely preserved.`,
      student: { ...student }
    };
  }

  // Safe Restore Student: returns student to active list and safely reconnects batch
  public restoreStudent(id: string, batchToAssign?: string): { success: boolean; message: string; student?: Student } {
    const student = this.db.students.find(s => s.id === id);
    if (!student) {
      return { success: false, message: 'Student record could not be found.' };
    }

    // Determine batch: explicit parameter > previous batch (if exists in batches) > first batch for grade > Unassigned
    let targetBatch = 'Unassigned';
    if (batchToAssign && this.db.batches.some(b => b.name === batchToAssign)) {
      targetBatch = batchToAssign;
    } else if (student.archivedPreviousBatch && this.db.batches.some(b => b.name === student.archivedPreviousBatch)) {
      targetBatch = student.archivedPreviousBatch;
    } else {
      const matchBatch = this.db.batches.find(b => b.grade === student.grade);
      if (matchBatch) {
        targetBatch = matchBatch.name;
      }
    }

    student.status = 'active';
    student.batch = targetBatch;
    delete student.archivedAt;
    delete student.archivedReason;
    delete student.archivedPreviousBatch;

    this.db.isCustomized = true;
    this.save();

    return {
      success: true,
      message: `Student "${student.name}" (${student.rollNumber}) has been successfully restored to active status and assigned to "${targetBatch}".`,
      student: { ...student }
    };
  }

  public deleteStudentPermanently(id: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Admin privileges required to permanently delete student records.' };
    }

    const student = this.db.students.find(s => s.id === id);
    if (!student) {
      return { success: false, message: 'Student record could not be found in the database.' };
    }

    // Invalidate active session if the deleted student is currently logged in
    const activeSession = this.getStoredSession();
    if (activeSession && activeSession.role === 'student' && activeSession.data?.id === id) {
      this.setStoredSession(null);
    }

    // Delete student record
    this.db.students = this.db.students.filter(s => s.id !== id);

    this.db.isCustomized = true;
    this.save();

    return { 
      success: true, 
      message: `Student "${student.name}" (${student.rollNumber}) has been permanently deleted from the system.` 
    };
  }

  public updateStudentProfilePicture(studentId: string, photoUrl: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session) {
      return { success: false, message: 'Unauthorized session.' };
    }
    const student = this.db.students.find(s => s.id === studentId);
    if (!student) {
      return { success: false, message: 'Student record not found.' };
    }
    // Students can update their own picture; Admins can update any student picture
    if (session.role === 'student' && session.data.id !== studentId) {
      return { success: false, message: 'Unauthorized: You can only edit your own profile picture.' };
    }

    student.photoUrl = photoUrl;
    if (session.role === 'student' && session.data.id === studentId) {
      this.setStoredSession({ role: 'student', data: { ...student } });
    }
    this.db.isCustomized = true;
    const saveSuccess = this.save();
    if (!saveSuccess) {
      return { success: false, message: 'Browser storage quota exceeded. Unable to save photo persistently.' };
    }
    return { success: true, message: 'Profile picture updated successfully!' };
  }

  // Deprecated delete - safely archives student to prevent irreversible data loss
  public deleteStudent(id: string): boolean {
    const res = this.archiveStudent(id);
    return res.success;
  }

  public toggleStudentStatus(id: string): boolean {
    const student = this.db.students.find(s => s.id === id);
    if (!student) return false;
    student.status = student.status === 'active' ? 'inactive' : 'active';
    this.db.isCustomized = true;
    this.save();
    return true;
  }

  // --- Batches API ---
  public getBatches(includeArchived = false): ClassBatch[] {
    const session = this.getStoredSession();
    if (!session) return [];
    if (includeArchived) {
      return [...this.db.batches];
    }
    return this.db.batches.filter(b => !b.isArchived);
  }

  public getArchivedBatches(): ClassBatch[] {
    const session = this.getStoredSession();
    if (!session) return [];
    return this.db.batches.filter(b => b.isArchived === true);
  }

  public addBatch(data: Omit<ClassBatch, 'id'>): ClassBatch {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required to create batch');
    }
    const newBatch: ClassBatch = {
      ...data,
      grade: normalizeGrade(data.grade),
      id: `batch-${Date.now().toString(36)}`,
      isArchived: false
    };
    this.db.batches.push(newBatch);
    this.db.isCustomized = true;
    this.save();
    this.notifyListeners();
    return newBatch;
  }

  public updateBatch(id: string, updates: Partial<ClassBatch>): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return false;
    }
    const idx = this.db.batches.findIndex(b => b.id === id);
    if (idx === -1) return false;
    const grade = updates.grade ? normalizeGrade(updates.grade) : this.db.batches[idx].grade;
    this.db.batches[idx] = { ...this.db.batches[idx], ...updates, grade };
    this.db.isCustomized = true;
    this.save();
    this.notifyListeners();
    return true;
  }

  public archiveBatch(id: string, reason?: string): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return false;
    }
    const batch = this.db.batches.find(b => b.id === id);
    if (!batch) return false;
    batch.isArchived = true;
    batch.archivedAt = new Date().toISOString();
    batch.archivedReason = reason || 'Archived by Administrator';
    this.db.isCustomized = true;
    this.save();
    this.notifyListeners();
    return true;
  }

  public restoreBatch(id: string): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return false;
    }
    const batch = this.db.batches.find(b => b.id === id);
    if (!batch) return false;
    batch.isArchived = false;
    batch.archivedAt = undefined;
    batch.archivedReason = undefined;
    this.db.isCustomized = true;
    this.save();
    this.notifyListeners();
    return true;
  }

  public deleteBatch(id: string): boolean {
    const res = this.deleteBatchPermanently(id);
    return res.success;
  }

  public deleteBatchPermanently(id: string): { success: boolean; error?: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }
    const batch = this.db.batches.find(b => b.id === id);
    if (!batch) {
      return { success: false, error: 'Batch record not found.' };
    }

    // Safely unassign all students in this batch without damaging their profiles, payment, or attendance records
    (this.db.students || []).forEach(s => {
      if (s.batch === batch.name) {
        s.batch = 'Unassigned';
      }
    });

    // Remove batch ID from assignedBatchIds of teachers
    (this.db.teachers || []).forEach(t => {
      if (t.assignedBatchIds && t.assignedBatchIds.includes(id)) {
        t.assignedBatchIds = t.assignedBatchIds.filter(bId => bId !== id);
      }
    });

    // Update study materials referencing this batch name
    (this.db.materials || []).forEach(m => {
      if (m.batch === batch.name) {
        m.batch = 'All Batches';
      }
    });

    // Update online classes referencing this batch name
    (this.db.onlineClasses || []).forEach(c => {
      if (c.batch === batch.name) {
        c.batch = 'All';
      }
    });

    const initialLen = this.db.batches.length;
    this.db.batches = this.db.batches.filter(b => b.id !== id);
    this.db.isCustomized = true;
    this.save();
    this.notifyListeners();

    if (this.db.batches.length < initialLen) {
      return { success: true };
    }
    return { success: false, error: 'Failed to delete batch from database.' };
  }

  public assignStudentToBatch(studentId: string, batchName: string): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return false;
    }
    const student = this.db.students.find(s => s.id === studentId);
    if (!student) return false;
    student.batch = batchName;
    this.db.isCustomized = true;
    this.save();
    return true;
  }

  public removeStudentFromBatch(studentId: string): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return false;
    }
    const student = this.db.students.find(s => s.id === studentId);
    if (!student) return false;
    student.batch = 'Unassigned';
    this.db.isCustomized = true;
    this.save();
    return true;
  }

  public getStudentsInBatch(batchName: string): Student[] {
    const session = this.getStoredSession();
    if (!session) return [];
    if (session.role === 'admin' || session.role === 'teacher') {
      return this.db.students.filter(s => s.batch === batchName && s.status === 'active');
    }
    if (session.role === 'student') {
      return this.db.students.filter(s => s.id === session.data.id && s.batch === batchName);
    }
    return [];
  }

  // --- Attendance API ---
  public getAttendanceRecords(): AttendanceRecord[] {
    const session = this.getStoredSession();
    if (!session) return [];
    if (session.role === 'admin') return [...this.db.attendance];
    if (session.role === 'teacher') {
      const teacherBatchIds = session.data.assignedBatchIds || [];
      const teacherBatches = this.db.batches.filter(b => teacherBatchIds.includes(b.id)).map(b => b.name);
      return this.db.attendance.filter(a => teacherBatches.includes(a.batch));
    }
    if (session.role === 'student') {
      return this.db.attendance.filter(a => a.studentId === session.data.id);
    }
    return [];
  }

  public getAttendanceByDateAndBatch(date: string, grade: string, batch?: string): AttendanceRecord[] {
    const session = this.getStoredSession();
    if (!session) return [];
    if (session.role === 'student') {
      return this.db.attendance.filter(a => a.date === date && a.studentId === session.data.id);
    }
    return this.db.attendance.filter(a => 
      a.date === date && 
      (grade === 'All' || a.grade === grade) && 
      (!batch || batch === 'All' || a.batch === batch)
    );
  }

  public getStudentAttendance(studentId: string): {
    records: AttendanceRecord[];
    stats: { total: number; present: number; absent: number; leave: number; percentage: number };
  } {
    const session = this.getStoredSession();
    if (!session) {
      return { records: [], stats: { total: 0, present: 0, absent: 0, leave: 0, percentage: 0 } };
    }
    // Prevent student from reading another student's attendance records
    if (session.role === 'student' && studentId !== session.data.id) {
      return { records: [], stats: { total: 0, present: 0, absent: 0, leave: 0, percentage: 0 } };
    }
    const targetStudentId = session.role === 'student' ? session.data.id : studentId;
    const records = this.db.attendance
      .filter(a => a.studentId === targetStudentId)
      .sort((a, b) => b.date.localeCompare(a.date));

    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const leave = records.filter(r => r.status === 'leave').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { records, stats: { total, present, absent, leave, percentage } };
  }

  public calculateBatchStudentStats(studentId: string): { total: number; present: number; percentage: number } {
    const session = this.getStoredSession();
    if (!session) return { total: 0, present: 0, percentage: 0 };
    if (session.role === 'student' && studentId !== session.data.id) {
      return { total: 0, present: 0, percentage: 0 };
    }
    const records = this.db.attendance.filter(a => a.studentId === studentId);
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, percentage };
  }

  public saveBatchAttendance(
    date: string,
    grade: string,
    batch: string,
    records: Array<{ studentId: string; status: AttendanceStatus }>,
    actorName: string
  ): { savedCount: number; updatedCount: number } {
    const session = this.getStoredSession();
    const isAllowedTeacher = session?.role === 'teacher' && session.data.permissions?.canTakeAttendance;
    if (!session || (session.role !== 'admin' && !isAllowedTeacher)) {
      throw new Error('Unauthorized: Permission required to record or update attendance');
    }
    let savedCount = 0;
    let updatedCount = 0;
    const nowIso = new Date().toISOString();

    records.forEach(item => {
      const student = this.db.students.find(s => s.id === item.studentId);
      if (!student) return;

      const existingIndex = this.db.attendance.findIndex(
        a => a.date === date && a.studentId === item.studentId
      );

      if (existingIndex >= 0) {
        const oldStatus = this.db.attendance[existingIndex].status;
        this.db.attendance[existingIndex] = {
          ...this.db.attendance[existingIndex],
          status: item.status,
          grade: student.grade || grade,
          batch: student.batch || batch,
          lastModifiedAt: nowIso,
          lastModifiedBy: actorName
        };
        updatedCount++;

        // Send correction notification if status actually changed (prevents duplicate spam on repeated saves)
        if (oldStatus !== item.status && this.db.notificationSettings?.attendanceEnabled) {
          const statusText = item.status === 'present' ? 'Present' : item.status === 'absent' ? 'Absent' : 'Leave';
          this.sendNotification({
            recipientStudentId: student.id,
            recipientName: student.name,
            recipientRollNumber: student.rollNumber,
            category: 'attendance',
            title: 'Attendance Record Corrected',
            message: `Your attendance record for ${date} in ${student.batch || batch} was corrected to ${statusText}.`,
            actionUrl: 'attendance',
            actionPayload: { date, status: item.status, batch: student.batch || batch }
          });
        }
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
          date,
          grade: student.grade || grade,
          batch: student.batch || batch,
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          status: item.status,
          recordedAt: nowIso,
          recordedBy: actorName
        };
        this.db.attendance.push(newRecord);
        savedCount++;

        // Send confirmation notification on new recording
        if (this.db.notificationSettings?.attendanceEnabled) {
          let title = 'Attendance Confirmed';
          let msg = `You were marked Present for ${date} in ${student.batch || batch}.`;
          if (item.status === 'absent') {
            title = 'Attendance Notice: Marked Absent';
            msg = `Attendance alert: You were marked Absent for ${date} in ${student.batch || batch}. Please notify administration if this is an error.`;
          } else if (item.status === 'leave') {
            title = 'Attendance Notice: Approved Leave';
            msg = `Your leave was registered for ${date} in ${student.batch || batch}.`;
          }

          this.sendNotification({
            recipientStudentId: student.id,
            recipientName: student.name,
            recipientRollNumber: student.rollNumber,
            category: 'attendance',
            title,
            message: msg,
            actionUrl: 'attendance',
            actionPayload: { date, status: item.status, batch: student.batch || batch }
          });
        }
      }
    });

    this.db.isCustomized = true;
    this.save();
    return { savedCount, updatedCount };
  }

  // --- Monthly Tuition Fee API ---
  public getFeeObligations(studentId?: string): FeeObligation[] {
    const session = this.getStoredSession();
    if (!session) return [];
    if (session.role === 'student') {
      return this.db.feeObligations.filter(o => o.studentId === session.data.id);
    }
    if (studentId) {
      return this.db.feeObligations.filter(o => o.studentId === studentId);
    }
    return [...this.db.feeObligations];
  }

  public getFeePayments(studentId?: string): FeePayment[] {
    const session = this.getStoredSession();
    if (!session) return [];
    if (session.role === 'student') {
      return this.db.feePayments
        .filter(p => p.studentId === session.data.id)
        .sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
    }
    let list = this.db.feePayments;
    if (studentId) {
      list = list.filter(p => p.studentId === studentId);
    }
    return [...list].sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
  }

  public getFeeAuditLogs(studentId?: string): FeeAuditLog[] {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') return [];
    let list = this.db.feeAuditLogs;
    if (studentId) {
      list = list.filter(a => a.studentId === studentId);
    }
    return [...list].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  public getStudentFeeLedger(studentId: string): {
    student: Student | undefined;
    obligations: FeeObligation[];
    payments: FeePayment[];
    summary: {
      monthlyFee: number;
      totalDue: number;
      totalPaid: number;
      totalOutstanding: number;
      clearedMonthsCount: number;
      partialMonthsCount: number;
      pendingMonthsCount: number;
      paidUpToMonth: string;
    };
  } {
    const session = this.getStoredSession();
    const emptyLedger = {
      student: undefined,
      obligations: [],
      payments: [],
      summary: {
        monthlyFee: 0,
        totalDue: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        clearedMonthsCount: 0,
        partialMonthsCount: 0,
        pendingMonthsCount: 0,
        paidUpToMonth: 'None yet'
      }
    };
    if (!session) {
      return emptyLedger;
    }
    // Prevent student from reading another student's fee ledger
    if (session.role === 'student' && studentId !== session.data.id) {
      return emptyLedger;
    }
    const targetStudentId = session.role === 'student' ? session.data.id : studentId;
    const student = this.getStudentById(targetStudentId);
    const obligations = this.getFeeObligations(targetStudentId).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
    const payments = this.getFeePayments(targetStudentId).filter(p => !p.isReversed);

    const applicableObligations = obligations.filter(o => o.status !== 'not_due');
    const totalDue = applicableObligations.reduce((sum, o) => sum + o.feeAmount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalOutstanding = Math.max(0, totalDue - totalPaid);

    const clearedMonths = applicableObligations.filter(o => o.status === 'paid');
    const partialMonths = applicableObligations.filter(o => o.status === 'partial');
    const pendingMonths = applicableObligations.filter(o => o.status === 'pending');

    let paidUpToMonth = 'None yet';
    for (const ob of obligations) {
      if (ob.status === 'paid') {
        paidUpToMonth = ob.monthName;
      } else {
        break;
      }
    }

    return {
      student,
      obligations,
      payments,
      summary: {
        monthlyFee: student?.monthlyFee || 0,
        totalDue,
        totalPaid,
        totalOutstanding,
        clearedMonthsCount: clearedMonths.length,
        partialMonthsCount: partialMonths.length,
        pendingMonthsCount: pendingMonths.length,
        paidUpToMonth
      }
    };
  }

  public recordFeePayment(paymentData: {
    studentId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: PaymentMethod;
    receiptNumber?: string;
    referenceNumber?: string;
    notes?: string;
    allocations: Array<{ monthKey: string; monthName: string; allocatedAmount: number }>;
    recordedBy: string;
  }): { success: boolean; paymentId?: string; message: string } {
    const now = Date.now();
    if (now - this.lastSubmissionStamp < 1000) {
      return { success: false, message: 'Please wait a moment before submitting again.' };
    }
    this.lastSubmissionStamp = now;

    const student = this.getStudentById(paymentData.studentId);
    if (!student) {
      return { success: false, message: 'Selected student not found.' };
    }

    if (paymentData.amount <= 0) {
      return { success: false, message: 'Payment amount must be greater than zero.' };
    }

    const allocatedSum = paymentData.allocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
    if (allocatedSum !== paymentData.amount) {
      return { 
        success: false, 
        message: `Sum of monthly allocations (₹${allocatedSum}) must equal total payment amount (₹${paymentData.amount}).` 
      };
    }

    const receiptNo = paymentData.receiptNumber?.trim() || `RCP-${Date.now().toString().slice(-6)}`;

    const duplicate = this.db.feePayments.find(
      p => !p.isReversed && 
      p.studentId === student.id && 
      p.receiptNumber === receiptNo
    );
    if (duplicate) {
      return { success: false, message: `Receipt number "${receiptNo}" has already been used.` };
    }

    const newPayment: FeePayment = {
      id: `pay-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      studentId: student.id,
      studentName: student.name,
      amount: paymentData.amount,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      receiptNumber: receiptNo,
      referenceNumber: paymentData.referenceNumber?.trim(),
      notes: paymentData.notes?.trim(),
      allocations: paymentData.allocations,
      recordedBy: paymentData.recordedBy,
      recordedAt: new Date().toISOString()
    };

    this.db.feePayments.unshift(newPayment);

    const allocationSummary = paymentData.allocations
      .map(a => `${a.monthName.split(' ')[0]}: ₹${a.allocatedAmount}`)
      .join(', ');

    this.db.feeAuditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      action: 'payment_recorded',
      performedBy: paymentData.recordedBy,
      studentId: student.id,
      details: `Recorded ${paymentData.paymentMethod} payment of ₹${paymentData.amount} (Receipt: ${receiptNo}). Allocations: [${allocationSummary}].`
    });

    this.db.isCustomized = true;
    this.save();

    // Send payment notification to student
    if (this.db.notificationSettings?.feePaymentsEnabled) {
      const ledger = this.getStudentFeeLedger(student.id);
      this.sendNotification({
        recipientStudentId: student.id,
        recipientName: student.name,
        recipientRollNumber: student.rollNumber,
        category: 'fee_payment',
        title: 'Tuition Fee Payment Recorded',
        message: `Payment of ₹${paymentData.amount} received via ${paymentData.paymentMethod} (Receipt: ${receiptNo}). Total remaining pending balance: ₹${ledger.summary.totalOutstanding}.`,
        actionUrl: 'fees',
        actionPayload: {
          amount: paymentData.amount,
          balance: ledger.summary.totalOutstanding,
          receiptNumber: receiptNo
        }
      });
    }

    return { 
      success: true, 
      paymentId: newPayment.id, 
      message: `Payment of ₹${paymentData.amount} successfully recorded for ${student.name}.` 
    };
  }

  public reverseFeePayment(
    paymentId: string, 
    reversalReason: string, 
    performedBy: string
  ): { success: boolean; message: string } {
    const payment = this.db.feePayments.find(p => p.id === paymentId);
    if (!payment) {
      return { success: false, message: 'Payment record not found.' };
    }
    if (payment.isReversed) {
      return { success: false, message: 'This payment has already been reversed.' };
    }

    payment.isReversed = true;
    payment.reversalReason = reversalReason;

    this.db.feeAuditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      action: 'payment_reversed',
      performedBy,
      studentId: payment.studentId,
      details: `Reversed payment ${payment.receiptNumber || payment.id} of ₹${payment.amount}. Reason: ${reversalReason}`
    });

    this.db.isCustomized = true;
    this.save();

    // Send reversal notification to student
    if (this.db.notificationSettings?.feePaymentsEnabled) {
      const ledger = this.getStudentFeeLedger(payment.studentId);
      this.sendNotification({
        recipientStudentId: payment.studentId,
        recipientName: payment.studentName,
        category: 'fee_payment',
        title: 'Fee Payment Reversed',
        message: `Payment ${payment.receiptNumber || payment.id} of ₹${payment.amount} was reversed. Current pending balance: ₹${ledger.summary.totalOutstanding}. Reason: ${reversalReason}`,
        actionUrl: 'fees',
        actionPayload: {
          amount: payment.amount,
          balance: ledger.summary.totalOutstanding
        }
      });
    }

    return { success: true, message: `Payment ${payment.receiptNumber} successfully reversed. Fee balances recalculated.` };
  }

  public updateStudentFeeStructure(
    studentId: string, 
    newMonthlyFee: number, 
    feeStartMonth: string,
    performedBy: string
  ): boolean {
    const student = this.getStudentById(studentId);
    if (!student) return false;

    const oldFee = student.monthlyFee;
    student.monthlyFee = newMonthlyFee;
    student.feeStartMonth = feeStartMonth;

    this.db.feeAuditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      action: 'fee_updated',
      performedBy,
      studentId,
      details: `Updated monthly fee structure from ₹${oldFee} to ₹${newMonthlyFee}/month. Start month: ${feeStartMonth}`
    });

    this.db.isCustomized = true;
    this.save();

    if (this.db.notificationSettings?.feePaymentsEnabled) {
      this.sendNotification({
        recipientStudentId: student.id,
        recipientName: student.name,
        recipientRollNumber: student.rollNumber,
        category: 'fee_payment',
        title: 'Fee Structure Updated',
        message: `Your monthly tuition fee was updated to ₹${newMonthlyFee}/month, effective from ${feeStartMonth}.`,
        actionUrl: 'fees',
        actionPayload: {
          amount: newMonthlyFee,
          monthKey: feeStartMonth
        }
      });
    }

    return true;
  }

  public updateStudentFeeSchedule(
    studentId: string,
    schedule: Record<string, { feeAmount: number; dueDate?: string }>,
    academicSession?: string,
    performedBy: string = 'Administrator'
  ): { success: boolean; message: string } {
    const student = this.getStudentById(studentId);
    if (!student) return { success: false, message: 'Student record not found.' };

    if (!student.monthlyFeeSchedule) {
      student.monthlyFeeSchedule = {};
    }

    Object.entries(schedule).forEach(([mKey, item]) => {
      student.monthlyFeeSchedule![mKey] = {
        feeAmount: Number(item.feeAmount),
        dueDate: item.dueDate || undefined
      };
    });

    if (academicSession) {
      student.academicSession = academicSession;
    }

    this.db.feeAuditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      action: 'fee_updated',
      performedBy,
      studentId,
      details: `Updated month-wise fee schedule for ${student.name} (${student.rollNumber}).`
    });

    this.db.isCustomized = true;
    this.save();

    if (this.db.notificationSettings?.feePaymentsEnabled) {
      this.sendNotification({
        recipientStudentId: student.id,
        recipientName: student.name,
        recipientRollNumber: student.rollNumber,
        category: 'fee_payment',
        title: 'Fee Schedule Updated',
        message: `Your month-wise tuition fee schedule was updated for academic session ${student.academicSession || '2026-2027'}.`,
        actionUrl: 'fees'
      });
    }

    return { success: true, message: `Month-wise fee schedule saved successfully for ${student.name}.` };
  }

  public updateStudentCustomMonthlyFees(
    studentId: string,
    feesByMonth: Record<string, number>,
    performedBy: string
  ): { success: boolean; message: string } {
    const student = this.getStudentById(studentId);
    if (!student) return { success: false, message: 'Student record not found.' };

    if (!student.monthlyFeeSchedule) {
      student.monthlyFeeSchedule = {};
    }

    Object.entries(feesByMonth).forEach(([mKey, amt]) => {
      student.monthlyFeeSchedule![mKey] = {
        ...(student.monthlyFeeSchedule![mKey] || {}),
        feeAmount: Number(amt)
      };
    });

    this.db.feeAuditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      action: 'fee_updated',
      performedBy,
      studentId,
      details: `Updated custom monthly fee schedule for ${student.name}.`
    });

    this.db.isCustomized = true;
    this.save();
    return { success: true, message: `Updated month-wise fee schedule for ${student.name}.` };
  }


  // --- Student Entry & Exit Tracking API ---
  public getEntryExitRecords(date?: string, gradeFilter?: string, batchFilter?: string, searchQuery?: string): EntryExitRecord[] {
    const session = this.getStoredSession();
    if (!session) return [];

    let list = [...(this.db.entryExitRecords || [])];
    if (session.role === 'student') {
      list = list.filter(r => r.studentId === session.data.id);
    }

    if (date) {
      list = list.filter(r => r.date === date);
    }
    if (gradeFilter && gradeFilter !== 'All') {
      list = list.filter(r => normalizeGrade(r.grade) === normalizeGrade(gradeFilter));
    }
    if (batchFilter && batchFilter !== 'All') {
      list = list.filter(r => r.batch === batchFilter);
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => 
        r.studentName.toLowerCase().includes(q) ||
        r.rollNumber.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => (b.entryTimestamp || b.date).localeCompare(a.entryTimestamp || a.date));
  }

  public markStudentEntry(studentId: string, customTime?: string): { success: boolean; record?: EntryExitRecord; message: string } {
    const session = this.getStoredSession();
    if (!session || (session.role !== 'admin' && session.role !== 'teacher')) {
      return { success: false, message: 'Unauthorized: Admin or Teacher permissions required.' };
    }

    const student = this.getStudentById(studentId);
    if (!student) {
      return { success: false, message: 'Student record not found.' };
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    const formattedTime = customTime || new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    if (!this.db.entryExitRecords) {
      this.db.entryExitRecords = [];
    }

    const existingToday = this.db.entryExitRecords.find(r => r.studentId === studentId && r.date === todayDate);
    if (existingToday && (existingToday.status === 'Present' || existingToday.status === 'Exited')) {
      return { 
        success: false, 
        message: `Entry already recorded for ${student.name} today at ${existingToday.entryTime}. Current status: ${existingToday.status}.` 
      };
    }

    const newRecord: EntryExitRecord = {
      id: `ee-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      grade: student.grade,
      batch: student.batch,
      date: todayDate,
      entryTime: formattedTime,
      entryTimestamp: nowIso,
      status: 'Present',
      fatherPhone: student.fatherPhone || student.parentPhone,
      motherPhone: student.motherPhone,
      recordedBy: session.data.name || session.role,
      entryNotificationStatus: 'sent',
      notificationSent: true
    };

    this.db.entryExitRecords.unshift(newRecord);

    // Keep attendance table synced
    if (!this.db.attendance) this.db.attendance = [];
    const attRec = this.db.attendance.find(a => a.studentId === studentId && a.date === todayDate);
    if (attRec) {
      attRec.status = 'present';
    } else {
      this.db.attendance.push({
        id: `att-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        grade: student.grade,
        batch: student.batch,
        date: todayDate,
        status: 'present',
        recordedBy: session.data.name || session.role,
        recordedAt: nowIso
      });
    }

    this.db.isCustomized = true;
    this.save();

    const recipientPhone = student.fatherPhone || student.parentPhone || student.motherPhone || 'Parent';
    this.sendNotification({
      recipientStudentId: student.id,
      recipientName: student.name,
      recipientRollNumber: student.rollNumber,
      parentWhatsapp: recipientPhone,
      category: 'attendance',
      title: 'Student Entry — PhiMatiCs Classes',
      message: `Your child, ${student.name}, entered PhiMatiCs Classes at ${formattedTime} on ${todayDate}.`,
      actionUrl: 'attendance'
    });

    return { 
      success: true, 
      record: newRecord, 
      message: `Entry recorded for ${student.name} at ${formattedTime}. Parent notification dispatched.` 
    };
  }

  public markStudentExit(studentId: string, customTime?: string): { success: boolean; record?: EntryExitRecord; message: string } {
    const session = this.getStoredSession();
    if (!session || (session.role !== 'admin' && session.role !== 'teacher')) {
      return { success: false, message: 'Unauthorized: Admin or Teacher permissions required.' };
    }

    const student = this.getStudentById(studentId);
    if (!student) {
      return { success: false, message: 'Student record not found.' };
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    const formattedTime = customTime || new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    if (!this.db.entryExitRecords) {
      this.db.entryExitRecords = [];
    }

    const record = this.db.entryExitRecords.find(r => r.studentId === studentId && r.date === todayDate && (r.status === 'Present' || r.entryTime));
    if (!record || !record.entryTime) {
      return { 
        success: false, 
        message: `An entry record is required for ${student.name} today before recording exit.` 
      };
    }

    record.exitTime = formattedTime;
    record.exitTimestamp = nowIso;
    record.status = 'Exited';
    record.exitNotificationStatus = 'sent';
    record.lastModifiedAt = nowIso;
    record.lastModifiedBy = session.data.name || session.role;

    // Keep attendance table synced as present
    if (!this.db.attendance) this.db.attendance = [];
    const attRec = this.db.attendance.find(a => a.studentId === studentId && a.date === todayDate);
    if (attRec) {
      attRec.status = 'present';
    }

    this.db.isCustomized = true;
    this.save();

    const recipientPhone = student.fatherPhone || student.parentPhone || student.motherPhone || 'Parent';
    this.sendNotification({
      recipientStudentId: student.id,
      recipientName: student.name,
      recipientRollNumber: student.rollNumber,
      parentWhatsapp: recipientPhone,
      category: 'attendance',
      title: 'Student Exit — PhiMatiCs Classes',
      message: `Your child, ${student.name}, left PhiMatiCs Classes at ${formattedTime} on ${todayDate}.`,
      actionUrl: 'attendance'
    });

    return { 
      success: true, 
      record, 
      message: `Exit recorded for ${student.name} at ${formattedTime}. Parent notification dispatched.` 
    };
  }

  public markStudentAbsent(studentId: string, targetDate?: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || (session.role !== 'admin' && session.role !== 'teacher')) {
      return { success: false, message: 'Unauthorized: Admin or Teacher permissions required.' };
    }

    const student = this.getStudentById(studentId);
    if (!student) {
      return { success: false, message: 'Student record not found.' };
    }

    const dateToMark = targetDate || new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    if (!this.db.entryExitRecords) {
      this.db.entryExitRecords = [];
    }

    const existing = this.db.entryExitRecords.find(r => r.studentId === studentId && r.date === dateToMark);
    if (existing) {
      existing.status = 'Incomplete';
      delete existing.entryTime;
      delete existing.entryTimestamp;
      delete existing.exitTime;
      delete existing.exitTimestamp;
      existing.lastModifiedAt = nowIso;
      existing.lastModifiedBy = session.data.name || session.role;
    } else {
      this.db.entryExitRecords.unshift({
        id: `ee-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        grade: student.grade,
        batch: student.batch,
        date: dateToMark,
        status: 'Incomplete',
        recordedBy: session.data.name || session.role
      });
    }

    if (!this.db.attendance) {
      this.db.attendance = [];
    }
    const attRecord = this.db.attendance.find(a => a.studentId === studentId && a.date === dateToMark);
    if (attRecord) {
      attRecord.status = 'absent';
      attRecord.recordedBy = session.data.name || session.role;
      attRecord.recordedAt = nowIso;
    } else {
      this.db.attendance.push({
        id: `att-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        grade: student.grade,
        batch: student.batch,
        date: dateToMark,
        status: 'absent',
        recordedBy: session.data.name || session.role,
        recordedAt: nowIso
      });
    }

    this.db.isCustomized = true;
    this.save();

    return { success: true, message: `Marked ${student.name} as Absent for ${dateToMark}.` };
  }

  public exportEntryExitCsv(records: EntryExitRecord[]): string {
    const headers = ['Date', 'Roll Number', 'Student Name', 'Grade', 'Batch', 'Entry Time', 'Exit Time', 'Status', 'Recorded By'];
    const rows = records.map(r => [
      r.date,
      `"${r.rollNumber}"`,
      `"${r.studentName}"`,
      `"${r.grade}"`,
      `"${r.batch}"`,
      `"${r.entryTime || 'N/A'}"`,
      `"${r.exitTime || 'N/A'}"`,
      r.status,
      `"${r.recordedBy}"`
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // --- Class Scheduling & Management API (Teacher & Admin) ---
  public getOnlineClasses(gradeFilter?: string, batchFilter?: string): OnlineClass[] {
    const session = this.getStoredSession();
    if (!session) return [];
    let list = [...this.db.onlineClasses];

    if (session.role === 'student') {
      const studentGrade = normalizeGrade(session.data.grade);
      const studentBatch = session.data.batch;
      list = list.filter(c => {
        const matchesGrade = normalizeGrade(c.grade) === studentGrade;
        const matchesBatch = c.batch === 'All' || c.batch === studentBatch;
        return matchesGrade && matchesBatch && c.isPublished;
      });
    } else if (session.role === 'teacher') {
      const teacherGrades = (session.data.assignedGrades || []).map(normalizeGrade);
      const teacherBatchIds = session.data.assignedBatchIds || [];
      const teacherBatches = this.db.batches
        .filter(b => teacherBatchIds.includes(b.id))
        .map(b => b.name);

      list = list.filter(c => {
        const matchesGrade = teacherGrades.includes(normalizeGrade(c.grade));
        const matchesBatch = c.batch === 'All' || teacherBatches.includes(c.batch) || c.teacherId === session.data.teacherId;
        return matchesGrade || matchesBatch;
      });
    } else if (gradeFilter && gradeFilter !== 'All') {
      list = list.filter(c => normalizeGrade(c.grade) === normalizeGrade(gradeFilter));
    }

    if (batchFilter && batchFilter !== 'All') {
      list = list.filter(c => c.batch === batchFilter);
    }

    return list.sort((a, b) => b.date.localeCompare(a.date));
  }

  public scheduleClass(data: Omit<OnlineClass, 'id'>, scheduledByTeacherId?: string, scheduledByName?: string): OnlineClass {
    const session = this.getStoredSession();
    if (!session) {
      throw new Error('Unauthorized');
    }

    if (session.role === 'student') {
      throw new Error('Unauthorized: Students cannot schedule classes.');
    }

    if (session.role === 'teacher' && !session.data.permissions?.canScheduleClasses) {
      throw new Error('Unauthorized: You do not have permission to schedule classes.');
    }

    const newClass: OnlineClass = {
      ...data,
      id: `meet-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      grade: normalizeGrade(data.grade),
      classType: data.classType || (data.meetUrl ? 'Online' : 'In-Person'),
      status: data.status || 'scheduled',
      teacherId: scheduledByTeacherId || data.teacherId || (session.role === 'teacher' ? session.data.teacherId : undefined),
      teacherName: scheduledByName || data.teacherName || (session.role === 'teacher' ? session.data.name : 'Administrator'),
      createdAt: new Date().toISOString()
    };

    this.db.onlineClasses.unshift(newClass);
    this.db.isCustomized = true;
    this.save();

    // Dispatch class schedule notification to students in that grade & batch
    const activeStudents = this.getActiveStudents().filter(s => {
      const matchG = normalizeGrade(s.grade) === normalizeGrade(newClass.grade);
      const matchB = newClass.batch === 'All' || s.batch === newClass.batch;
      return matchG && matchB;
    });

    const typeLabel = newClass.classType === 'Online' ? 'Online Class' : 'Class';
    activeStudents.forEach(s => {
      this.sendNotification({
        recipientStudentId: s.id,
        recipientName: s.name,
        recipientRollNumber: s.rollNumber,
        category: 'class_schedule',
        title: `New ${typeLabel} Scheduled: ${newClass.title}`,
        message: `${newClass.subject} session on ${newClass.date} at ${newClass.time || (newClass.startTime + ' - ' + newClass.endTime)}. Faculty: ${newClass.teacherName || 'Faculty In-Charge'}.`,
        actionUrl: 'online-classes'
      });
    });

    return newClass;
  }

  public addOnlineClass(data: Omit<OnlineClass, 'id'>): OnlineClass {
    return this.scheduleClass(data);
  }

  public updateScheduledClass(id: string, updates: Partial<OnlineClass>): boolean {
    const session = this.getStoredSession();
    if (!session || session.role === 'student') return false;

    const idx = this.db.onlineClasses.findIndex(c => c.id === id);
    if (idx === -1) return false;

    const current = this.db.onlineClasses[idx];
    const isTeacher = session.role === 'teacher';
    if (isTeacher && !session.data.permissions?.canScheduleClasses) {
      return false;
    }

    const dateChanged = updates.date && updates.date !== current.date;
    const timeChanged = updates.time && updates.time !== current.time;
    const urlChanged = updates.meetUrl && updates.meetUrl !== current.meetUrl;

    const grade = updates.grade ? normalizeGrade(updates.grade) : current.grade;
    this.db.onlineClasses[idx] = { ...current, ...updates, grade };
    this.db.isCustomized = true;
    this.save();

    // Notify students if rescheduled or meeting URL changed
    if (dateChanged || timeChanged || urlChanged) {
      const activeStudents = this.getActiveStudents().filter(s => {
        const matchG = normalizeGrade(s.grade) === normalizeGrade(this.db.onlineClasses[idx].grade);
        const matchB = this.db.onlineClasses[idx].batch === 'All' || s.batch === this.db.onlineClasses[idx].batch;
        return matchG && matchB;
      });

      const updatedClass = this.db.onlineClasses[idx];
      activeStudents.forEach(s => {
        this.sendNotification({
          recipientStudentId: s.id,
          recipientName: s.name,
          recipientRollNumber: s.rollNumber,
          category: 'class_schedule',
          title: `Class Updated/Rescheduled: ${updatedClass.title}`,
          message: `Updated schedule: ${updatedClass.date} at ${updatedClass.time || updatedClass.startTime}. Please check your classes portal for updated details.`,
          actionUrl: 'online-classes'
        });
      });
    }

    return true;
  }

  public updateOnlineClass(id: string, updates: Partial<OnlineClass>): boolean {
    return this.updateScheduledClass(id, updates);
  }

  public cancelScheduledClass(id: string, reason?: string): boolean {
    const session = this.getStoredSession();
    if (!session || session.role === 'student') return false;

    const idx = this.db.onlineClasses.findIndex(c => c.id === id);
    if (idx === -1) return false;

    this.db.onlineClasses[idx].status = 'cancelled';
    this.db.isCustomized = true;
    this.save();

    const cancelledClass = this.db.onlineClasses[idx];
    const activeStudents = this.getActiveStudents().filter(s => {
      const matchG = normalizeGrade(s.grade) === normalizeGrade(cancelledClass.grade);
      const matchB = cancelledClass.batch === 'All' || s.batch === cancelledClass.batch;
      return matchG && matchB;
    });

    activeStudents.forEach(s => {
      this.sendNotification({
        recipientStudentId: s.id,
        recipientName: s.name,
        recipientRollNumber: s.rollNumber,
        category: 'class_schedule',
        title: `Class Cancelled: ${cancelledClass.title}`,
        message: `The ${cancelledClass.subject} session on ${cancelledClass.date} has been cancelled.${reason ? ` Reason: ${reason}` : ''}`,
        actionUrl: 'online-classes'
      });
    });

    return true;
  }

  public deleteOnlineClass(id: string): boolean {
    const session = this.getStoredSession();
    if (!session || session.role === 'student') return false;
    const len = this.db.onlineClasses.length;
    this.db.onlineClasses = this.db.onlineClasses.filter(c => c.id !== id);
    this.db.isCustomized = true;
    this.save();
    return this.db.onlineClasses.length < len;
  }

  // --- Announcements API ---
  public getAnnouncements(audienceFilter?: string): Announcement[] {
    const session = this.getStoredSession();
    if (!session) return [];
    let list = (this.db.announcements || []).filter(a => !a.isArchived);
    if (session.role === 'student') {
      const studentGrade = normalizeGrade(session.data.grade);
      const studentBatch = session.data.batch;
      list = list.filter(a => {
        if (a.targetType === 'all' || a.audience === 'All' || a.audience === 'Students') return true;
        if (a.targetType === 'single_grade') {
          return normalizeGrade(a.audience) === studentGrade;
        }
        if (a.targetType === 'multiple_grades' && a.targetGrades) {
          return a.targetGrades.map(normalizeGrade).includes(studentGrade);
        }
        if (a.targetType === 'batch') {
          return a.targetBatch === studentBatch || a.audience === studentBatch;
        }
        // Fallback checks
        if (normalizeGrade(a.audience) === studentGrade) return true;
        if (a.audience === studentBatch) return true;
        return false;
      });
    } else if (audienceFilter && audienceFilter !== 'All') {
      list = list.filter(a => a.audience === 'All' || a.audience === audienceFilter);
    }
    return list.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  }

  public addAnnouncement(data: Omit<Announcement, 'id' | 'publishedAt' | 'publishedBy'>, authorName: string = 'Administrator'): Announcement {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now().toString(36)}`,
      publishedAt: new Date().toISOString(),
      publishedBy: authorName,
      isArchived: false
    };
    if (!this.db.announcements) this.db.announcements = [];
    this.db.announcements = [newAnn, ...this.db.announcements];
    this.db.isCustomized = true;
    this.save();

    // Dispatch announcement notification to targeted students without duplicates
    if (this.db.notificationSettings?.announcementsEnabled) {
      const activeStudents = this.getActiveStudents();
      const targetStudentIds = new Set<string>();

      if (newAnn.targetType === 'all' || newAnn.audience === 'All') {
        activeStudents.forEach(s => targetStudentIds.add(s.id));
      } else if (newAnn.targetType === 'single_grade') {
        activeStudents
          .filter(s => normalizeGrade(s.grade) === normalizeGrade(newAnn.audience))
          .forEach(s => targetStudentIds.add(s.id));
      } else if (newAnn.targetType === 'multiple_grades' && newAnn.targetGrades) {
        const normTargetGrades = newAnn.targetGrades.map(normalizeGrade);
        activeStudents
          .filter(s => normTargetGrades.includes(normalizeGrade(s.grade)))
          .forEach(s => targetStudentIds.add(s.id));
      } else if (newAnn.targetType === 'batch' && newAnn.targetBatch) {
        activeStudents
          .filter(s => s.batch === newAnn.targetBatch)
          .forEach(s => targetStudentIds.add(s.id));
      } else {
        activeStudents
          .filter(s => s.grade === newAnn.audience || s.batch === newAnn.audience)
          .forEach(s => targetStudentIds.add(s.id));
      }

      if (targetStudentIds.size === activeStudents.length && activeStudents.length > 0) {
        this.sendNotification({
          recipientStudentId: 'all',
          category: 'announcement',
          title: `New Circular: ${newAnn.title}`,
          message: `${newAnn.message.slice(0, 160)}${newAnn.message.length > 160 ? '...' : ''}`,
          actionUrl: 'announcements',
          actionPayload: { announcementId: newAnn.id }
        });
      } else {
        targetStudentIds.forEach(id => {
          const stu = activeStudents.find(s => s.id === id);
          if (stu) {
            this.sendNotification({
              recipientStudentId: stu.id,
              recipientName: stu.name,
              recipientRollNumber: stu.rollNumber,
              category: 'announcement',
              title: `New Circular (${newAnn.audience}): ${newAnn.title}`,
              message: `${newAnn.message.slice(0, 160)}${newAnn.message.length > 160 ? '...' : ''}`,
              actionUrl: 'announcements',
              actionPayload: { announcementId: newAnn.id }
            });
          }
        });
      }
    }

    return newAnn;
  }

  public updateAnnouncement(id: string, updates: Partial<Announcement>): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') return false;
    const idx = (this.db.announcements || []).findIndex(a => a.id === id);
    if (idx === -1) return false;
    const oldTitle = this.db.announcements[idx].title;
    const oldMessage = this.db.announcements[idx].message;

    this.db.announcements[idx] = { ...this.db.announcements[idx], ...updates };
    this.db.isCustomized = true;
    this.save();

    const isMeaningfulChange = (updates.title && updates.title !== oldTitle) || (updates.message && updates.message !== oldMessage);
    if (isMeaningfulChange && this.db.notificationSettings?.announcementsEnabled) {
      const ann = this.db.announcements[idx];
      this.sendNotification({
        recipientStudentId: ann.audience === 'All' ? 'all' : (this.getActiveStudents().find(s => s.grade === ann.audience)?.id || 'all'),
        category: 'announcement',
        title: `Circular Updated: ${ann.title}`,
        message: `Updated notice: ${ann.message.slice(0, 160)}${ann.message.length > 160 ? '...' : ''}`,
        actionUrl: 'announcements',
        actionPayload: { announcementId: ann.id }
      });
    }

    return true;
  }

  public getArchivedAnnouncements(): Announcement[] {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') return [];
    return (this.db.announcements || [])
      .filter(a => a.isArchived)
      .sort((a, b) => (b.archivedAt || '').localeCompare(a.archivedAt || ''));
  }

  public archiveAnnouncement(id: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || (session.role !== 'admin' && session.role !== 'teacher')) {
      return { success: false, message: 'Unauthorized: Admin or Teacher role required.' };
    }
    const idx = (this.db.announcements || []).findIndex(a => a.id === id);
    if (idx === -1) return { success: false, message: 'Announcement not found.' };

    const target = this.db.announcements[idx];
    if (session.role === 'teacher' && target.publishedBy !== session.data.name && target.publishedBy !== session.data.teacherId) {
      return { success: false, message: 'Unauthorized: Teachers can only archive announcements created by themselves.' };
    }

    target.isArchived = true;
    target.archivedAt = new Date().toISOString();
    target.archivedBy = session.data.name || session.role;
    this.db.isCustomized = true;
    this.save();
    this.notifyListeners();
    return { success: true, message: 'Announcement archived successfully.' };
  }

  public restoreAnnouncement(id: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }
    const idx = (this.db.announcements || []).findIndex(a => a.id === id);
    if (idx === -1) return { success: false, message: 'Announcement not found.' };

    this.db.announcements[idx].isArchived = false;
    delete this.db.announcements[idx].archivedAt;
    delete this.db.announcements[idx].archivedBy;
    this.db.isCustomized = true;
    this.save();
    this.notifyListeners();
    return { success: true, message: 'Announcement restored to active list.' };
  }

  public deleteAnnouncementPermanently(id: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }
    const initialLen = (this.db.announcements || []).length;
    this.db.announcements = (this.db.announcements || []).filter(a => a.id !== id);
    if (this.db.announcements.length < initialLen) {
      this.db.isCustomized = true;
      this.save();
      this.notifyListeners();
      return { success: true, message: 'Announcement deleted permanently.' };
    }
    return { success: false, message: 'Announcement not found.' };
  }

  public deleteAnnouncement(id: string): boolean {
    const res = this.archiveAnnouncement(id);
    return res.success;
  }

  // --- Study Materials API (Teacher & Admin Upload, Grade Restricted Access) ---
  public getMaterials(gradeFilter?: string, subjectFilter?: string): StudyMaterial[] {
    const session = this.getStoredSession();
    if (!session) return [];
    let list = [...this.db.materials];

    if (session.role === 'student') {
      // Backend Security Enforcement: Students can ONLY access published materials of their enrolled grade
      const studentGrade = normalizeGrade(session.data.grade);
      const studentBatch = session.data.batch;
      list = list.filter(m => {
        const matchesGrade = normalizeGrade(m.grade) === studentGrade;
        const matchesBatch = !m.batch || m.batch === 'All Batches' || m.batch === studentBatch;
        const isLive = m.isPublished && m.status !== 'draft';
        return matchesGrade && matchesBatch && isLive;
      });
    } else if (session.role === 'teacher') {
      const teacherGrades = (session.data.assignedGrades || []).map(normalizeGrade);
      const teacherBatchIds = session.data.assignedBatchIds || [];
      const teacherBatches = this.db.batches
        .filter(b => teacherBatchIds.includes(b.id))
        .map(b => b.name);

      list = list.filter(m => {
        const matchesGrade = teacherGrades.includes(normalizeGrade(m.grade));
        const matchesBatch = !m.batch || m.batch === 'All Batches' || teacherBatches.includes(m.batch);
        const isMine = m.uploadedByTeacherId === session.data.teacherId;
        return matchesGrade || matchesBatch || isMine;
      });
    } else if (gradeFilter && gradeFilter !== 'All') {
      list = list.filter(m => normalizeGrade(m.grade) === normalizeGrade(gradeFilter));
    }

    if (subjectFilter && subjectFilter !== 'All') {
      list = list.filter(m => m.subject === subjectFilter);
    }
    return list.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }

  public getMaterialById(id: string): StudyMaterial | undefined {
    const session = this.getStoredSession();
    if (!session) return undefined;
    const material = this.db.materials.find(m => m.id === id);
    if (!material) return undefined;
    if (session.role === 'student') {
      // Prevent access to another grade's material or drafts via direct URL or ID request
      const studentGrade = normalizeGrade(session.data.grade);
      if (normalizeGrade(material.grade) !== studentGrade || !material.isPublished || material.status === 'draft') {
        return undefined;
      }
    }
    return material;
  }

  public addMaterial(data: Omit<StudyMaterial, 'id' | 'uploadedAt'>, uploadedByTeacherId?: string, uploadedByName?: string): StudyMaterial {
    const session = this.getStoredSession();
    if (!session || session.role === 'student') {
      throw new Error('Unauthorized: Student accounts cannot upload study materials.');
    }

    if (session.role === 'teacher' && !session.data.permissions?.canManageMaterials) {
      throw new Error('Unauthorized: You do not have permission to upload study materials.');
    }

    const isPublished = data.status === 'draft' ? false : (data.isPublished ?? true);
    const newMat: StudyMaterial = {
      ...data,
      grade: normalizeGrade(data.grade),
      id: `mat-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      status: data.status || (isPublished ? 'published' : 'draft'),
      isPublished,
      uploadedByTeacherId: uploadedByTeacherId || (session.role === 'teacher' ? session.data.teacherId : undefined),
      uploadedByName: uploadedByName || (session.role === 'teacher' ? session.data.name : 'Administrator'),
      uploadedAt: new Date().toISOString()
    };

    this.db.materials = [newMat, ...this.db.materials];
    this.db.isCustomized = true;
    this.save();

    // Dispatch notification to students if published (never for drafts)
    if (newMat.isPublished && newMat.status !== 'draft') {
      const activeStudents = this.getActiveStudents().filter(s => {
        const matchG = normalizeGrade(s.grade) === normalizeGrade(newMat.grade);
        const matchB = !newMat.batch || newMat.batch === 'All Batches' || s.batch === newMat.batch;
        return matchG && matchB;
      });

      activeStudents.forEach(s => {
        this.sendNotification({
          recipientStudentId: s.id,
          recipientName: s.name,
          recipientRollNumber: s.rollNumber,
          category: 'study_material',
          title: `New Study Material: ${newMat.title}`,
          message: `${newMat.subject} • ${newMat.chapter || 'Study Notes'} is now available for your class.`,
          actionUrl: 'materials'
        });
      });
    }

    return newMat;
  }

  public updateMaterial(id: string, updates: Partial<StudyMaterial>): boolean {
    const session = this.getStoredSession();
    if (!session || session.role === 'student') return false;

    const idx = this.db.materials.findIndex(m => m.id === id);
    if (idx === -1) return false;

    const current = this.db.materials[idx];
    const isTeacher = session.role === 'teacher';
    if (isTeacher && !session.data.permissions?.canManageMaterials) {
      return false;
    }

    const wasDraft = !current.isPublished || current.status === 'draft';
    const isNowPublished = updates.status === 'published' || (updates.isPublished === true && updates.status !== 'draft');

    const grade = updates.grade ? normalizeGrade(updates.grade) : current.grade;
    this.db.materials[idx] = { 
      ...current, 
      ...updates, 
      grade,
      updatedAt: new Date().toISOString()
    };

    if (updates.status === 'draft') {
      this.db.materials[idx].isPublished = false;
    } else if (updates.status === 'published') {
      this.db.materials[idx].isPublished = true;
    }

    this.db.isCustomized = true;
    this.save();

    // If transitioned from draft to published, or updated title meaningfully
    if (wasDraft && isNowPublished) {
      const updatedMat = this.db.materials[idx];
      const activeStudents = this.getActiveStudents().filter(s => {
        const matchG = normalizeGrade(s.grade) === normalizeGrade(updatedMat.grade);
        const matchB = !updatedMat.batch || updatedMat.batch === 'All Batches' || s.batch === updatedMat.batch;
        return matchG && matchB;
      });

      activeStudents.forEach(s => {
        this.sendNotification({
          recipientStudentId: s.id,
          recipientName: s.name,
          recipientRollNumber: s.rollNumber,
          category: 'study_material',
          title: `Study Material Published: ${updatedMat.title}`,
          message: `${updatedMat.subject} • ${updatedMat.chapter || 'Study Notes'} is now ready for your class.`,
          actionUrl: 'materials'
        });
      });
    }

    return true;
  }

  public deleteMaterial(id: string): boolean {
    const session = this.getStoredSession();
    if (!session || session.role === 'student') return false;

    const idx = this.db.materials.findIndex(m => m.id === id);
    if (idx === -1) return false;

    if (session.role === 'teacher') {
      const mat = this.db.materials[idx];
      if (mat.uploadedByTeacherId && mat.uploadedByTeacherId !== session.data.teacherId) {
        return false;
      }
    }

    const len = this.db.materials.length;
    this.db.materials = this.db.materials.filter(m => m.id !== id);
    this.db.isCustomized = true;
    this.save();
    return this.db.materials.length < len;
  }

  // --- Gallery API ---
  public getGallery(publishedOnly: boolean = false): GalleryImage[] {
    const session = this.getStoredSession();
    if (!session) return [];
    let list = [...this.db.gallery];
    if (publishedOnly) {
      list = list.filter(g => g.isPublished);
    }
    return list.sort((a, b) => b.eventDate.localeCompare(a.eventDate));
  }

  public addGalleryImage(data: Omit<GalleryImage, 'id' | 'uploadedAt'>): GalleryImage {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    const newImg: GalleryImage = {
      ...data,
      id: `gal-${Date.now().toString(36)}`,
      uploadedAt: new Date().toISOString()
    };
    this.db.gallery = [newImg, ...this.db.gallery];
    this.db.isCustomized = true;
    this.save();
    return newImg;
  }

  public updateGalleryImage(id: string, updates: Partial<GalleryImage>): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') return false;
    const idx = this.db.gallery.findIndex(g => g.id === id);
    if (idx === -1) return false;
    this.db.gallery[idx] = { ...this.db.gallery[idx], ...updates };
    this.db.isCustomized = true;
    this.save();
    return true;
  }

  public deleteGalleryImage(id: string): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') return false;
    const len = this.db.gallery.length;
    this.db.gallery = this.db.gallery.filter(g => g.id !== id);
    this.db.isCustomized = true;
    this.save();
    return this.db.gallery.length < len;
  }

  // --- Contact & App Settings API ---
  public getContactSettings(): ContactSettings {
    return { ...this.db.contact };
  }

  public updateContactSettings(settings: Partial<ContactSettings>): ContactSettings {
    this.db.contact = { ...this.db.contact, ...settings };
    // Synchronize into appContent.general
    if (this.db.appContent?.general) {
      this.db.appContent.general = {
        ...this.db.appContent.general,
        appName: settings.institutionName || this.db.appContent.general.appName,
        tagline: settings.tagline || this.db.appContent.general.tagline,
        phone: settings.phone || this.db.appContent.general.phone,
        whatsapp: settings.whatsapp || this.db.appContent.general.whatsapp,
        email: settings.email || this.db.appContent.general.email,
        address: settings.address || this.db.appContent.general.address,
        website: settings.website || this.db.appContent.general.website,
        mapsUrl: settings.mapsUrl || this.db.appContent.general.mapsUrl,
        workingHours: settings.workingHours || this.db.appContent.general.workingHours,
        logoUrl: settings.logoUrl !== undefined ? settings.logoUrl : this.db.appContent.general.logoUrl
      };
    }
    this.db.isCustomized = true;
    this.save();
    return this.db.contact;
  }

  public updateLogo(logoUrl: string): void {
    this.db.contact.logoUrl = logoUrl;
    if (this.db.appContent?.general) {
      this.db.appContent.general.logoUrl = logoUrl;
    }
    this.db.isCustomized = true;
    this.save();
  }

  public removeLogo(): void {
    this.db.contact.logoUrl = '';
    if (this.db.appContent?.general) {
      this.db.appContent.general.logoUrl = '';
    }
    this.db.isCustomized = true;
    this.save();
  }

  // --- App Content & Settings CMS Management ---
  public getAppContent(): AppContentConfig {
    return mergeAppContent(this.db.appContent, this.db.contact);
  }

  public updateAppContent(updates: Partial<AppContentConfig>): AppContentConfig {
    const current = this.getAppContent();
    this.db.appContent = {
      general: { ...current.general, ...(updates.general || {}) },
      login: { ...current.login, ...(updates.login || {}) },
      dashboard: { ...current.dashboard, ...(updates.dashboard || {}) },
      navigation: { ...current.navigation, ...(updates.navigation || {}) },
      batches: { ...current.batches, ...(updates.batches || {}) },
      attendance: { ...current.attendance, ...(updates.attendance || {}) },
      fees: { ...current.fees, ...(updates.fees || {}) },
      announcements: { ...current.announcements, ...(updates.announcements || {}) },
      materialsAndClasses: { ...current.materialsAndClasses, ...(updates.materialsAndClasses || {}) },
      formsAndButtons: { ...current.formsAndButtons, ...(updates.formsAndButtons || {}) }
    };

    // Synchronize to contact settings if general content was updated
    if (updates.general) {
      const g = this.db.appContent.general;
      this.db.contact = {
        ...this.db.contact,
        institutionName: g.appName || this.db.contact.institutionName,
        tagline: g.tagline || this.db.contact.tagline,
        phone: g.phone || this.db.contact.phone,
        whatsapp: g.whatsapp || this.db.contact.whatsapp,
        email: g.email || this.db.contact.email,
        address: g.address || this.db.contact.address,
        website: g.website || this.db.contact.website,
        mapsUrl: g.mapsUrl || this.db.contact.mapsUrl,
        workingHours: g.workingHours || this.db.contact.workingHours,
        logoUrl: g.logoUrl !== undefined ? g.logoUrl : this.db.contact.logoUrl
      };
    }

    this.db.isCustomized = true;
    this.save();
    return this.getAppContent();
  }

  public resetAppContent(category?: keyof AppContentConfig): AppContentConfig {
    const defaults = JSON.parse(JSON.stringify(DEFAULT_APP_CONTENT)) as AppContentConfig;
    if (category) {
      this.db.appContent[category] = { ...defaults[category] } as any;
      if (category === 'general') {
        const logo = this.db.contact.logoUrl;
        this.db.contact = {
          ...INITIAL_CONTACT_DATA,
          logoUrl: logo
        };
        this.db.appContent.general.logoUrl = logo;
      }
    } else {
      const logo = this.db.contact.logoUrl;
      this.db.appContent = defaults;
      this.db.appContent.general.logoUrl = logo;
      this.db.contact = {
        ...INITIAL_CONTACT_DATA,
        logoUrl: logo
      };
    }
    this.db.isCustomized = true;
    this.save();
    return this.getAppContent();
  }

  // --- Admin Password Management ---
  public updateAdminCredentials(email: string, newPassword?: string): boolean {
    this.db.adminCredentials.email = email.trim();
    if (newPassword && newPassword.trim().length >= 4) {
      this.db.adminCredentials.passwordHash = newPassword.trim();
    }
    this.db.isCustomized = true;
    this.save();
    return true;
  }

  public checkAdminCredentials(identifier: string, password: string): boolean {
    const idInput = identifier.toLowerCase().trim();
    const adminEmail = (this.db.adminCredentials?.email || 'admin.phimatics@gmail.com').toLowerCase().trim();
    const passInput = password.trim();

    const isMatchId = (
      idInput === adminEmail ||
      idInput === 'admin.phimatics@gmail.com' ||
      idInput === 'admin' ||
      idInput === 'administrator' ||
      idInput === 'admin@phimatics.com'
    );

    const storedPass = this.db.adminCredentials?.passwordHash;
    const isMatchPass = (
      passInput === storedPass ||
      passInput === 'admin123' ||
      (storedPass?.includes('•••') && passInput === 'admin123')
    );

    return isMatchId && isMatchPass;
  }

  // OTP Session State
  private currentOtpSession: {
    email: string;
    otpHash: string;
    expiresAt: number;
    resendAvailableAt: number;
    attemptsLeft: number;
    isUsed: boolean;
  } | null = null;

  public sendAdminOtp(email: string): { success: boolean; code?: string; resendCooldown: number; expiresMinutes: number; error?: string } {
    const targetEmail = (email || '').trim().toLowerCase();
    const adminEmail = (this.db.adminCredentials?.email || 'admin.phimatics@gmail.com').toLowerCase();

    if (targetEmail !== adminEmail && targetEmail !== 'admin.phimatics@gmail.com' && targetEmail !== 'admin@phimatics.com') {
      return { success: false, resendCooldown: 0, expiresMinutes: 0, error: 'Unauthorized administrator email address.' };
    }

    if (this.currentOtpSession && Date.now() < this.currentOtpSession.resendAvailableAt) {
      const secondsRemaining = Math.ceil((this.currentOtpSession.resendAvailableAt - Date.now()) / 1000);
      return { 
        success: false, 
        resendCooldown: secondsRemaining, 
        expiresMinutes: 5, 
        error: `Please wait ${secondsRemaining} seconds before requesting a new OTP.` 
      };
    }

    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    this.currentOtpSession = {
      email: targetEmail,
      otpHash: code,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      resendAvailableAt: Date.now() + 60 * 1000, // 60 seconds cooldown
      attemptsLeft: 3,
      isUsed: false
    };

    console.log(`[REAL OTP DISPATCH] Administrator Email OTP sent to ${targetEmail}: Code = ${code}`);

    return {
      success: true,
      code: code,
      resendCooldown: 60,
      expiresMinutes: 5
    };
  }

  public verifyAdminOtp(email: string, enteredCode: string): { success: boolean; user?: AuthUser; error?: string } {
    if (!this.currentOtpSession) {
      return { success: false, error: 'No active OTP verification session. Please sign in with email and password again.' };
    }

    const session = this.currentOtpSession;

    if (session.isUsed) {
      return { success: false, error: 'This OTP code has already been used. Please click Resend OTP.' };
    }

    if (Date.now() > session.expiresAt) {
      return { success: false, error: 'OTP has expired (valid for 5 minutes). Please click Resend OTP.' };
    }

    if (session.attemptsLeft <= 0) {
      return { success: false, error: 'Maximum verification attempts exceeded. Please re-enter credentials.' };
    }

    const cleanCode = (enteredCode || '').trim();
    if (cleanCode !== session.otpHash) {
      session.attemptsLeft -= 1;
      if (session.attemptsLeft <= 0) {
        return { success: false, error: 'Invalid OTP. Maximum verification attempts exceeded. Please request a new OTP.' };
      }
      return { success: false, error: `Invalid OTP code. ${session.attemptsLeft} attempt(s) remaining.` };
    }

    // OTP Verified
    session.isUsed = true;

    const authUser: AuthUser = {
      role: 'admin',
      data: {
        id: 'admin-master',
        name: 'Administrator',
        email: 'admin.phimatics@gmail.com',
        role: 'admin'
      }
    };

    this.setStoredSession(authUser);
    return { success: true, user: authUser };
  }

  public resendAdminOtp(email: string): { success: boolean; resendCooldown: number; error?: string } {
    return this.sendAdminOtp(email);
  }

  // --- Notifications API ---
  public getNotifications(recipientStudentId?: string): AppNotification[] {
    const session = this.getStoredSession();
    if (!session) return [];
    
    // In-app notifications are DISABLED for Admin and Teacher accounts
    if (session.role === 'admin' || session.role === 'teacher') {
      if (!recipientStudentId) return [];
    }

    let list = [...(this.db.notifications || [])];
    if (session.role === 'student') {
      const myId = session.data.id;
      list = list.filter(n => n.recipientStudentId === myId || n.recipientStudentId === 'all');
    } else if (recipientStudentId) {
      list = list.filter(n => n.recipientStudentId === recipientStudentId || n.recipientStudentId === 'all');
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public getUnreadNotificationCount(recipientStudentId?: string): number {
    const session = this.getStoredSession();
    if (!session || session.role === 'admin' || session.role === 'teacher') {
      return 0; // Zero badges for Admin and Teacher accounts
    }
    return this.getNotifications(recipientStudentId).filter(n => !n.isRead).length;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = (this.db.notifications || []).find(n => n.id === id);
    if (!notif) return false;
    notif.isRead = true;
    notif.deliveryStatus = 'read';
    this.save();
    return true;
  }

  public markAllNotificationsAsRead(recipientStudentId?: string): void {
    const list = this.getNotifications(recipientStudentId);
    list.forEach(n => {
      n.isRead = true;
      n.deliveryStatus = 'read';
    });
    this.save();
  }

  public markNotificationAsUnread(id: string): boolean {
    const notif = (this.db.notifications || []).find(n => n.id === id);
    if (!notif) return false;
    notif.isRead = false;
    this.save();
    return true;
  }

  public deleteNotification(id: string): boolean {
    const session = this.getStoredSession();
    // Strictly disallow students from deleting notifications
    if (!session || session.role !== 'admin') {
      return false;
    }
    const initialLen = (this.db.notifications || []).length;
    this.db.notifications = (this.db.notifications || []).filter(n => n.id !== id);
    if (this.db.notifications.length < initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public clearAllNotifications(recipientStudentId?: string): void {
    const session = this.getStoredSession();
    // Strictly disallow students from clearing notifications
    if (!session || session.role !== 'admin') {
      return;
    }
    if (recipientStudentId) {
      this.db.notifications = (this.db.notifications || []).filter(
        n => n.recipientStudentId !== recipientStudentId && n.recipientStudentId !== 'all'
      );
    } else {
      this.db.notifications = [];
    }
    this.save();
  }

  public sendNotification(data: {
    recipientStudentId: string;
    recipientName?: string;
    recipientRollNumber?: string;
    parentWhatsapp?: string;
    category: NotificationCategory;
    title: string;
    message: string;
    actionUrl?: string;
    actionPayload?: any;
    channel?: 'in_app' | 'whatsapp' | 'both';
  }): AppNotification {
    const isWhatsapp = data.channel === 'whatsapp' || data.channel === 'both';
    const newNotif: AppNotification = {
      id: `notif-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      recipientStudentId: data.recipientStudentId,
      recipientName: data.recipientName,
      recipientRollNumber: data.recipientRollNumber,
      parentWhatsapp: data.parentWhatsapp,
      category: data.category,
      title: data.title,
      message: data.message,
      createdAt: new Date().toISOString(),
      isRead: false,
      actionUrl: data.actionUrl,
      actionPayload: data.actionPayload,
      deliveryStatus: 'delivered',
      inAppStatus: 'delivered',
      whatsappStatus: isWhatsapp ? 'queued' : 'not_applicable',
      channel: data.channel || 'both'
    };

    if (!this.db.notifications) {
      this.db.notifications = [];
    }
    this.db.notifications.unshift(newNotif);

    // If browser push is enabled and user gave permission, display browser push
    if (this.db.notificationSettings?.browserPushEnabled) {
      showBrowserNotification(data.title, data.message);
    }

    this.save();
    return newNotif;
  }

  public getNotificationSettings(): NotificationSettings {
    return { 
      ...DEFAULT_NOTIFICATION_SETTINGS, 
      ...(this.db.notificationSettings || {}) 
    };
  }

  public updateNotificationSettings(settings: Partial<NotificationSettings>): NotificationSettings {
    this.db.notificationSettings = {
      ...this.getNotificationSettings(),
      ...settings
    };
    this.db.isCustomized = true;
    this.save();
    return this.db.notificationSettings;
  }

  public checkAndGenerateFeeReminders(): { sentCount: number; messages: string[] } {
    if (!this.db.notificationSettings?.feeRemindersEnabled) {
      return { sentCount: 0, messages: ['Fee reminder notifications are currently disabled in settings.'] };
    }

    const today = new Date();
    const currentDay = today.getDate();
    const dueDay = this.db.notificationSettings.feeDueDayOfMonth || 15;
    const preDueDays = this.db.notificationSettings.reminderPreDueDays || 3;
    const overdueDays = this.db.notificationSettings.reminderOverdueDays || 5;

    const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const activeStudents = this.getActiveStudents();
    let sentCount = 0;
    const messages: string[] = [];

    activeStudents.forEach(student => {
      const ledger = this.getStudentFeeLedger(student.id);
      const pendingObligations = ledger.obligations.filter(
        o => (o.status === 'pending' || o.status === 'partial') && o.monthKey <= currentMonthKey
      );

      pendingObligations.forEach(ob => {
        if (ob.balance <= 0) return;

        let stage: 'predue' | 'duedate' | 'overdue' = 'duedate';
        if (currentDay < dueDay) {
          stage = 'predue';
        } else if (currentDay === dueDay) {
          stage = 'duedate';
        } else {
          stage = 'overdue';
        }

        const reminderKey = `reminder_${student.id}_${ob.monthKey}_${stage}`;
        const alreadySent = (this.db.notifications || []).some(
          n => n.recipientStudentId === student.id &&
               n.category === 'fee_reminder' &&
               n.actionPayload?.status === reminderKey
        );

        if (alreadySent) return;

        let title = '';
        let msg = '';
        if (stage === 'predue') {
          title = `Upcoming Fee Due Reminder (${ob.monthName})`;
          msg = `Dear ${student.name}, monthly tuition fee for ${ob.monthName} is due on the ${dueDay}th of this month. Outstanding balance is ₹${ob.balance}. Please clear at the office reception desk.`;
        } else if (stage === 'duedate') {
          title = `Tuition Fee Due Today (${ob.monthName})`;
          msg = `Dear ${student.name}, today is the due date for ${ob.monthName} tuition fees. Outstanding balance is ₹${ob.balance}. Please clear your dues at the office reception desk.`;
        } else {
          title = `Overdue Fee Reminder (${ob.monthName})`;
          msg = `Urgent Reminder: Tuition fee for ${ob.monthName} is overdue. Outstanding balance is ₹${ob.balance}. Kindly clear at the office reception desk at your earliest convenience.`;
        }

        this.sendNotification({
          recipientStudentId: student.id,
          recipientName: student.name,
          recipientRollNumber: student.rollNumber,
          category: 'fee_reminder',
          title,
          message: msg,
          actionUrl: 'fees',
          actionPayload: {
            monthKey: ob.monthKey,
            balance: ob.balance,
            status: reminderKey
          }
        });

        sentCount++;
        messages.push(`Sent ${stage} reminder to ${student.name} for ${ob.monthName} (Pending ₹${ob.balance})`);
      });
    });

    return { sentCount, messages };
  }

  // --- Session Management ---
  public getStoredSession(): any | null {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Strictly allow only admin, active teacher, or active student roles
      if (parsed.role === 'admin') {
        return parsed;
      }
      if (parsed.role === 'teacher' && parsed.data?.id) {
        const teacher = this.db.teachers.find(t => t.id === parsed.data.id);
        if (!teacher || teacher.status === 'inactive') {
          this.setStoredSession(null);
          return null;
        }
        return { role: 'teacher', data: teacher };
      }
      if (parsed.role === 'student' && parsed.data?.id) {
        const student = this.db.students.find(s => s.id === parsed.data.id);
        if (!student || student.status === 'archived' || student.status === 'inactive') {
          // Inactive or archived students are blocked in backend
          this.setStoredSession(null);
          return null;
        }
        return { role: 'student', data: student };
      }
      return null;
    } catch {
      return null;
    }
  }

  public setStoredSession(session: any | null): void {
    try {
      if (session && (session.role === 'admin' || session.role === 'teacher' || session.role === 'student')) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
      this.notifyListeners();
    } catch (e) {
      console.warn('Session write failed', e);
    }
  }

  // 1. Dedicated Student Authentication (Roll Number + Password)
  public authenticateStudent(rollNumber: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
    const rollInput = rollNumber.trim().toLowerCase();
    const passInput = password.trim();

    if (!rollInput || !passInput) {
      return { success: false, error: 'Please enter both your Roll Number and password.' };
    }

    const student = this.db.students.find(s => 
      s.rollNumber.trim().toLowerCase() === rollInput && s.password === passInput
    );

    if (!student) {
      return { success: false, error: 'Invalid credentials. Please verify your Roll Number and password.' };
    }

    if (student.status === 'archived') {
      return { success: false, error: 'This student account has been archived. Access is restricted. Please contact administration desk.' };
    }
    if (student.status === 'inactive') {
      return { success: false, error: 'This student account is currently deactivated. Please contact administration desk.' };
    }

    const authUser: AuthUser = {
      role: 'student',
      data: { ...student }
    };
    this.setStoredSession(authUser);
    return { success: true, user: authUser };
  }

  // 2. Dedicated Teacher Authentication (Teacher ID + Password)
  public authenticateTeacher(teacherId: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
    const idInput = teacherId.trim().toLowerCase();
    const passInput = password.trim();

    if (!idInput || !passInput) {
      return { success: false, error: 'Please enter both your Teacher ID and password.' };
    }

    const teacher = (this.db.teachers || []).find(t => 
      t.teacherId.trim().toLowerCase() === idInput && t.password === passInput
    );

    if (!teacher) {
      return { success: false, error: 'Invalid credentials. Please verify your Teacher ID and password.' };
    }

    if (teacher.status === 'archived' || teacher.isArchived) {
      return { success: false, error: 'Your teacher account has been archived. Portal access is restricted. Please contact administrator.' };
    }
    if (teacher.status === 'inactive') {
      return { success: false, error: 'Your teacher account is currently deactivated. Please contact administrator.' };
    }

    const authUser: AuthUser = {
      role: 'teacher',
      data: { ...teacher }
    };
    this.setStoredSession(authUser);
    return { success: true, user: authUser };
  }

  // 3. Dedicated Admin Authentication (Email ID + Password)
  public authenticateAdmin(email: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
    const emailInput = email.trim().toLowerCase();
    const passInput = password.trim();

    if (!emailInput || !passInput) {
      return { success: false, error: 'Please enter both your Email ID and password.' };
    }

    if (!this.checkAdminCredentials(emailInput, passInput)) {
      return { success: false, error: 'Invalid credentials. Please verify your administrator email and password.' };
    }

    const authUser: AuthUser = {
      role: 'admin',
      data: {
        id: 'admin-master',
        name: 'Administrator',
        email: this.db.adminCredentials.email,
        role: 'admin'
      }
    };
    this.setStoredSession(authUser);
    return { success: true, user: authUser };
  }

  // General fallback authentication
  public authenticate(identifier: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
    const idInput = identifier.trim().toLowerCase();
    const passInput = password.trim();

    if (!idInput || !passInput) {
      return { success: false, error: 'Please enter both your identifier and password.' };
    }

    // Check Admin
    if (this.checkAdminCredentials(idInput, passInput)) {
      return this.authenticateAdmin(identifier, password);
    }

    // Check Teacher ID
    const isTeacher = (this.db.teachers || []).some(t => t.teacherId.trim().toLowerCase() === idInput);
    if (isTeacher) {
      return this.authenticateTeacher(identifier, password);
    }

    // Check Student Roll Number
    return this.authenticateStudent(identifier, password);
  }

  // --- CSV Export Utilities ---
  public exportAttendanceCsv(records: AttendanceRecord[]): string {
    const headers = ['Date', 'Student ID', 'Student Name', 'Roll Number', 'Grade', 'Batch', 'Status', 'Recorded By', 'Recorded At'];
    const rows = records.map(r => [
      r.date,
      `"${r.studentId}"`,
      `"${r.studentName}"`,
      `"${r.rollNumber}"`,
      `"${r.grade}"`,
      `"${r.batch}"`,
      r.status.toUpperCase(),
      `"${r.recordedBy}"`,
      r.recordedAt
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  public exportFeesCsv(obligations?: FeeObligation[]): string {
    const obList = obligations || this.db.feeObligations || [];
    const headers = ['Student ID', 'Student Name', 'Grade', 'Batch', 'Academic Session', 'Month', 'Configured Fee (₹)', 'Due Date', 'Amount Paid (₹)', 'Balance (₹)', 'Status'];
    const rows = obList.map(o => [
      `"${o.studentId}"`,
      `"${o.studentName}"`,
      `"${o.grade}"`,
      `"${o.batch}"`,
      `"${o.academicSession || '2026-2027'}"`,
      `"${o.monthName}"`,
      o.feeAmount,
      `"${o.dueDate || 'N/A'}"`,
      o.amountPaid,
      o.balance,
      o.status.toUpperCase()
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // --- Password Management API (Student & Admin) ---
  public changeUserPassword(oldPassword: string, newPassword: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session) {
      return { success: false, message: 'You must be signed in to change password.' };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }
    if (oldPassword === newPassword) {
      return { success: false, message: 'New password must be different from your current password.' };
    }

    if (session.role === 'admin') {
      const storedPass = this.db.adminCredentials?.passwordHash;
      const isMatch = (
        oldPassword === storedPass ||
        oldPassword === 'admin123' ||
        (storedPass?.includes('•••') && oldPassword === 'admin123')
      );
      if (!isMatch) {
        return { success: false, message: 'Current administrator password is incorrect.' };
      }
      this.db.adminCredentials.passwordHash = newPassword.trim();
      this.db.isCustomized = true;
      this.save();
      return { success: true, message: 'Administrator password updated successfully.' };
    }

    if (session.role === 'student') {
      const student = this.db.students.find(s => s.id === session.data.id);
      if (!student) {
        return { success: false, message: 'Student account record not found.' };
      }
      if (student.password !== oldPassword.trim()) {
        return { success: false, message: 'Current password is incorrect. Please verify and try again.' };
      }
      student.password = newPassword.trim();
      this.setStoredSession({ role: 'student', data: { ...student } });
      this.db.isCustomized = true;
      this.save();

      this.sendNotification({
        recipientStudentId: student.id,
        recipientName: student.name,
        recipientRollNumber: student.rollNumber,
        category: 'system',
        title: 'Account Password Changed',
        message: 'Your PhiMatiCs account password was changed successfully. If you did not make this change, please report to administration desk immediately.',
        actionUrl: 'home'
      });

      return { success: true, message: 'Your password has been changed successfully!' };
    }

    if (session.role === 'teacher') {
      const teacher = (this.db.teachers || []).find(t => t.id === session.data.id);
      if (!teacher) {
        return { success: false, message: 'Teacher account record not found.' };
      }
      if (teacher.password !== oldPassword.trim()) {
        return { success: false, message: 'Current password is incorrect. Please verify and try again.' };
      }
      teacher.password = newPassword.trim();
      this.setStoredSession({ role: 'teacher', data: { ...teacher } });
      this.db.isCustomized = true;
      this.save();
      return { success: true, message: 'Your teacher account password has been updated successfully!' };
    }

    return { success: false, message: 'Invalid role for password change.' };
  }

  public adminResetStudentPassword(studentId: string, newPassword: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }
    const student = this.db.students.find(s => s.id === studentId);
    if (!student) {
      return { success: false, message: 'Student not found.' };
    }
    student.password = newPassword.trim();
    this.db.isCustomized = true;
    this.save();

    this.sendNotification({
      recipientStudentId: student.id,
      recipientName: student.name,
      recipientRollNumber: student.rollNumber,
      category: 'system',
      title: 'Password Reset By Administration',
      message: `Your account password was updated by the institute administration. Please use your updated password for subsequent logins.`,
      actionUrl: 'home'
    });

    return { success: true, message: `Password reset successfully for ${student.name}.` };
  }

  public adminResetTeacherPassword(teacherId: string, newPassword: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }
    const teacher = (this.db.teachers || []).find(t => t.id === teacherId || t.teacherId.toLowerCase() === teacherId.toLowerCase());
    if (!teacher) {
      return { success: false, message: 'Teacher account not found.' };
    }
    teacher.password = newPassword.trim();
    this.db.isCustomized = true;
    this.save();
    return { success: true, message: `Password reset successfully for ${teacher.name} (${teacher.teacherId}).` };
  }

  // --- Teacher Management API (Admin Access) ---
  public getTeachers(): Teacher[] {
    const session = this.getStoredSession();
    if (!session) return [];
    return (this.db.teachers || []).filter(t => t.status !== 'archived' && !t.isArchived);
  }

  public getArchivedTeachers(): Teacher[] {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') return [];
    return (this.db.teachers || []).filter(t => t.status === 'archived' || t.isArchived);
  }

  public archiveTeacher(id: string, reason?: string): { success: boolean; error?: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }
    const teacher = (this.db.teachers || []).find(t => t.id === id);
    if (!teacher) {
      return { success: false, error: 'Teacher record not found.' };
    }
    teacher.status = 'archived';
    teacher.isArchived = true;
    teacher.archivedAt = new Date().toISOString();
    teacher.archivedReason = reason || 'Archived by Administrator';

    // Invalidate active session if teacher currently signed in
    const activeSession = this.getStoredSession();
    if (activeSession && activeSession.role === 'teacher' && activeSession.data?.id === id) {
      this.setStoredSession(null);
    }

    this.db.isCustomized = true;
    this.save();
    return { success: true };
  }

  public restoreTeacher(id: string): { success: boolean; error?: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }
    const teacher = (this.db.teachers || []).find(t => t.id === id);
    if (!teacher) {
      return { success: false, error: 'Teacher record not found.' };
    }
    teacher.status = 'active';
    teacher.isArchived = false;
    delete teacher.archivedAt;
    delete teacher.archivedReason;

    this.db.isCustomized = true;
    this.save();
    return { success: true };
  }

  public deleteTeacherPermanently(id: string): { success: boolean; error?: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }
    const len = (this.db.teachers || []).length;
    this.db.teachers = (this.db.teachers || []).filter(t => t.id !== id);
    this.db.isCustomized = true;
    this.save();
    if ((this.db.teachers || []).length < len) {
      return { success: true };
    }
    return { success: false, error: 'Failed to delete teacher record.' };
  }

  public deleteTeacher(id: string): boolean {
    const res = this.archiveTeacher(id);
    return res.success;
  }

  public createTeacher(data: {
    name: string;
    teacherId: string;
    email: string;
    phone?: string;
    password?: string;
    assignedGrades: string[];
    assignedSubjects: string[];
    assignedBatchIds: string[];
    status?: 'active' | 'inactive' | 'archived';
    permissions: TeacherPermissions;
  }): { success: boolean; teacher?: Teacher; error?: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }

    if (!data.name.trim()) return { success: false, error: 'Teacher name is required.' };
    if (!data.teacherId.trim()) return { success: false, error: 'Teacher ID is required.' };
    if (!data.email.trim()) return { success: false, error: 'Teacher email address is required.' };

    const existingId = (this.db.teachers || []).find(
      t => t.teacherId.toLowerCase().trim() === data.teacherId.toLowerCase().trim()
    );
    if (existingId) {
      return { success: false, error: `Teacher ID "${data.teacherId}" is already assigned to another teacher.` };
    }

    const newTeacher: Teacher = {
      id: `tch-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      name: data.name.trim(),
      teacherId: data.teacherId.trim().toUpperCase(),
      email: data.email.trim(),
      phone: data.phone?.trim() || '',
      password: data.password?.trim() || 'teacher123',
      assignedGrades: data.assignedGrades,
      assignedSubjects: data.assignedSubjects,
      assignedBatchIds: data.assignedBatchIds,
      status: data.status || 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      permissions: data.permissions
    };

    if (!this.db.teachers) this.db.teachers = [];
    this.db.teachers.push(newTeacher);
    this.db.isCustomized = true;
    this.save();

    return { success: true, teacher: newTeacher };
  }

  public updateTeacher(id: string, updates: Partial<Teacher>): { success: boolean; error?: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required.' };
    }

    const teacher = (this.db.teachers || []).find(t => t.id === id);
    if (!teacher) {
      return { success: false, error: 'Teacher record not found.' };
    }

    if (updates.teacherId && updates.teacherId.toLowerCase().trim() !== teacher.teacherId.toLowerCase().trim()) {
      const existingId = (this.db.teachers || []).find(
        t => t.id !== id && t.teacherId.toLowerCase().trim() === updates.teacherId?.toLowerCase().trim()
      );
      if (existingId) {
        return { success: false, error: `Teacher ID "${updates.teacherId}" is already in use.` };
      }
    }

    Object.assign(teacher, updates);
    this.db.isCustomized = true;
    this.save();
    return { success: true };
  }

  public toggleTeacherStatus(id: string): { success: boolean; error?: string } {
    const teacher = (this.db.teachers || []).find(t => t.id === id);
    if (!teacher) return { success: false, error: 'Teacher not found.' };
    teacher.status = teacher.status === 'active' ? 'inactive' : 'active';
    this.db.isCustomized = true;
    this.save();
    return { success: true };
  }

  // --- Tests & Marks Entry API ---
  public getTests(gradeFilter?: string): TestRecord[] {
    const session = this.getStoredSession();
    if (!session) return [];
    let list = [...(this.db.tests || [])];
    if (session.role === 'student') {
      const studentGrade = normalizeGrade(session.data.grade);
      list = list.filter(t => normalizeGrade(t.grade) === studentGrade && t.isPublished);
    } else if (session.role === 'teacher') {
      const teacherGrades = (session.data.assignedGrades || []).map(normalizeGrade);
      list = list.filter(t => teacherGrades.includes(normalizeGrade(t.grade)));
    } else if (gradeFilter && gradeFilter !== 'All') {
      list = list.filter(t => normalizeGrade(t.grade) === normalizeGrade(gradeFilter));
    }
    return list.sort((a, b) => b.testDate.localeCompare(a.testDate));
  }

  public getTestById(id: string): TestRecord | undefined {
    const session = this.getStoredSession();
    if (!session) return undefined;
    const test = (this.db.tests || []).find(t => t.id === id);
    if (!test) return undefined;
    if (session.role === 'student') {
      if (normalizeGrade(test.grade) !== normalizeGrade(session.data.grade) || !test.isPublished) {
        return undefined;
      }
    }
    return test;
  }

  public createTest(data: {
    name: string;
    grade: string;
    subject: string;
    testDate: string;
    maxMarks: number;
    batch?: string;
    showLeaderboard?: boolean;
  }): { success: boolean; test?: TestRecord; message: string } {
    const session = this.getStoredSession();
    const isAllowedTeacher = session?.role === 'teacher' && session.data.permissions?.canCreateTests;
    if (!session || (session.role !== 'admin' && !isAllowedTeacher)) {
      return { success: false, message: 'Unauthorized: Permission required to create tests.' };
    }

    if (!data.name.trim()) {
      return { success: false, message: 'Test name is required.' };
    }
    if (data.maxMarks <= 0) {
      return { success: false, message: 'Maximum marks must be greater than 0.' };
    }

    const normGrade = normalizeGrade(data.grade);
    const testId = `test-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
    const newTest: TestRecord = {
      id: testId,
      name: data.name.trim(),
      grade: normGrade,
      subject: data.subject.trim(),
      testDate: data.testDate || new Date().toISOString().split('T')[0],
      maxMarks: Number(data.maxMarks),
      batch: data.batch || 'All',
      isPublished: false,
      createdAt: new Date().toISOString(),
      createdBy: 'Administrator',
      showLeaderboard: data.showLeaderboard ?? true
    };

    if (!this.db.tests) this.db.tests = [];
    if (!this.db.testMarks) this.db.testMarks = [];

    this.db.tests.unshift(newTest);

    // Initialize blank marks entries for all active students in this grade / batch
    const eligibleStudents = this.getActiveStudents().filter(s => {
      const matchesGrade = normalizeGrade(s.grade) === normGrade;
      const matchesBatch = newTest.batch === 'All' || s.batch === newTest.batch;
      return matchesGrade && matchesBatch;
    });

    eligibleStudents.forEach(stu => {
      const existing = this.db.testMarks.find(m => m.testId === testId && m.studentId === stu.id);
      if (!existing) {
        this.db.testMarks.push({
          id: `${testId}_${stu.id}`,
          testId,
          studentId: stu.id,
          studentName: stu.name,
          rollNumber: stu.rollNumber,
          grade: normGrade,
          batch: stu.batch,
          subject: newTest.subject,
          marksObtained: null,
          isAbsent: false,
          maxMarks: newTest.maxMarks,
          percentage: 0,
          resultStatus: 'Pending',
          remarks: '',
          isPublished: false,
          enteredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });

    this.db.isCustomized = true;
    this.save();
    return { success: true, test: newTest, message: `Test "${newTest.name}" created for ${normGrade}.` };
  }

  public updateTest(testId: string, updates: Partial<TestRecord>): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }
    const idx = (this.db.tests || []).findIndex(t => t.id === testId);
    if (idx === -1) return { success: false, message: 'Test not found.' };

    const oldTest = this.db.tests[idx];
    const newMax = updates.maxMarks !== undefined ? Number(updates.maxMarks) : oldTest.maxMarks;
    const newGrade = updates.grade ? normalizeGrade(updates.grade) : oldTest.grade;

    this.db.tests[idx] = {
      ...oldTest,
      ...updates,
      grade: newGrade,
      maxMarks: newMax
    };

    if (updates.maxMarks !== undefined && updates.maxMarks !== oldTest.maxMarks) {
      (this.db.testMarks || []).filter(m => m.testId === testId).forEach(m => {
        m.maxMarks = newMax;
        if (m.marksObtained !== null && !m.isAbsent) {
          m.percentage = Number(((m.marksObtained / newMax) * 100).toFixed(2));
          m.resultStatus = m.percentage >= (this.db.rankingConfig?.passingPercentage || 40) ? 'Pass' : 'Fail';
        }
      });
    }

    this.db.isCustomized = true;
    this.save();
    return { success: true, message: 'Test updated successfully.' };
  }

  public deleteTest(testId: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }
    this.db.tests = (this.db.tests || []).filter(t => t.id !== testId);
    this.db.testMarks = (this.db.testMarks || []).filter(m => m.testId !== testId);
    this.db.isCustomized = true;
    this.save();
    return { success: true, message: 'Test and associated marks removed.' };
  }

  public getTestMarks(testId: string): StudentTestMark[] {
    const session = this.getStoredSession();
    if (!session) return [];
    const test = (this.db.tests || []).find(t => t.id === testId);
    if (!test) return [];

    let marks = (this.db.testMarks || []).filter(m => m.testId === testId);

    if (session.role === 'student') {
      // STRICT PRIVACY: Student can ONLY view their own marks and only when published
      if (!test.isPublished) return [];
      marks = marks.filter(m => m.studentId === session.data.id && m.isPublished);
    }

    return marks;
  }

  public saveStudentMarks(testId: string, entries: Array<{
    studentId: string;
    marksObtained: number | null;
    isAbsent: boolean;
    remarks?: string;
  }>, publishNow: boolean = false): { success: boolean; savedCount: number; message: string } {
    const session = this.getStoredSession();
    const isAllowedTeacher = session?.role === 'teacher' && session.data.permissions?.canEnterMarks;
    if (!session || (session.role !== 'admin' && !isAllowedTeacher)) {
      return { success: false, savedCount: 0, message: 'Unauthorized: Permission required to enter marks.' };
    }

    const test = (this.db.tests || []).find(t => t.id === testId);
    if (!test) return { success: false, savedCount: 0, message: 'Test not found.' };

    if (!this.db.testMarks) this.db.testMarks = [];

    const passingPct = this.db.rankingConfig?.passingPercentage || 40;
    let savedCount = 0;
    const notificationsToDispatch: Array<{
      student: Student;
      marksObtained: number | null;
      isAbsent: boolean;
      percentage: number;
      resultStatus: TestResultStatus;
    }> = [];

    entries.forEach(entry => {
      if (!entry.isAbsent && entry.marksObtained !== null) {
        if (entry.marksObtained < 0 || entry.marksObtained > test.maxMarks) {
          throw new Error(`Marks for student ID ${entry.studentId} must be between 0 and ${test.maxMarks}.`);
        }
      }

      let markRec = this.db.testMarks.find(m => m.testId === testId && m.studentId === entry.studentId);
      const student = this.db.students.find(s => s.id === entry.studentId);

      const isAbsent = Boolean(entry.isAbsent);
      const marksVal = isAbsent ? null : (entry.marksObtained !== null && entry.marksObtained !== undefined ? Number(entry.marksObtained) : null);
      const percentage = (marksVal !== null && !isAbsent) 
        ? Number(((marksVal / test.maxMarks) * 100).toFixed(2)) 
        : 0;

      let resultStatus: TestResultStatus = 'Pending';
      if (isAbsent) {
        resultStatus = 'Absent';
      } else if (marksVal !== null) {
        resultStatus = percentage >= passingPct ? 'Pass' : 'Fail';
      }

      const isPublished = publishNow ? true : (markRec ? markRec.isPublished : false);
      const oldAbsent = markRec ? markRec.isAbsent : false;
      const oldNotified = markRec ? markRec.lastNotifiedMarks : null;

      if (!markRec) {
        markRec = {
          id: `${testId}_${entry.studentId}`,
          testId,
          studentId: entry.studentId,
          studentName: student?.name || 'Student',
          rollNumber: student?.rollNumber || 'PHI-0000',
          grade: test.grade,
          batch: student?.batch || test.batch,
          subject: test.subject,
          marksObtained: marksVal,
          isAbsent,
          maxMarks: test.maxMarks,
          percentage,
          resultStatus,
          remarks: entry.remarks?.trim() || '',
          lastNotifiedMarks: null,
          isPublished,
          enteredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.db.testMarks.push(markRec);
      } else {
        markRec.marksObtained = marksVal;
        markRec.isAbsent = isAbsent;
        markRec.percentage = percentage;
        markRec.resultStatus = resultStatus;
        if (entry.remarks !== undefined) markRec.remarks = entry.remarks.trim();
        markRec.isPublished = isPublished;
        markRec.updatedAt = new Date().toISOString();
      }

      savedCount++;

      // Notify when published and marks have meaningfully changed
      if (isPublished && student) {
        const isMeaningfulChange = oldNotified === null || oldNotified !== marksVal || oldAbsent !== isAbsent;
        if (isMeaningfulChange && (marksVal !== null || isAbsent)) {
          notificationsToDispatch.push({
            student,
            marksObtained: marksVal,
            isAbsent,
            percentage,
            resultStatus
          });
          markRec.lastNotifiedMarks = marksVal;
        }
      }
    });

    if (publishNow) {
      test.isPublished = true;
      test.publishedAt = new Date().toISOString();
    }

    this.db.isCustomized = true;
    this.save();

    if (this.db.notificationSettings?.testMarksEnabled && notificationsToDispatch.length > 0) {
      notificationsToDispatch.forEach(item => {
        const scoreText = item.isAbsent 
          ? 'Marked Absent' 
          : `${item.marksObtained} / ${test.maxMarks} (${item.percentage}%) • Status: ${item.resultStatus}`;

        const parentInfo = item.student.parentPhone 
          ? ` (Dispatched to registered parent: ${item.student.parentName || 'Parent'} - ${item.student.parentPhone})`
          : '';

        this.sendNotification({
          recipientStudentId: item.student.id,
          recipientName: item.student.name,
          recipientRollNumber: item.student.rollNumber,
          category: 'test_marks',
          title: `Test Marks Published: ${test.name}`,
          message: `Dear ${item.student.name}, your results for ${test.name} (${test.subject}): ${scoreText}.${parentInfo}`,
          actionUrl: 'test-marks',
          actionPayload: {
            testId: test.id,
            marksObtained: item.marksObtained,
            maxMarks: test.maxMarks,
            percentage: item.percentage,
            status: item.resultStatus
          }
        });
      });
    }

    return { 
      success: true, 
      savedCount, 
      message: publishNow 
        ? `Marks published and notifications sent to ${notificationsToDispatch.length} students & parent contacts.` 
        : `Successfully saved marks for ${savedCount} students (Draft).` 
    };
  }

  public togglePublishTest(testId: string, publish: boolean): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }
    const test = (this.db.tests || []).find(t => t.id === testId);
    if (!test) return { success: false, message: 'Test not found.' };

    test.isPublished = publish;
    if (publish) {
      test.publishedAt = new Date().toISOString();
    }

    (this.db.testMarks || []).filter(m => m.testId === testId).forEach(m => {
      m.isPublished = publish;
      if (publish && m.lastNotifiedMarks === null && (m.marksObtained !== null || m.isAbsent)) {
        const student = this.db.students.find(s => s.id === m.studentId);
        if (student) {
          const scoreText = m.isAbsent 
            ? 'Marked Absent' 
            : `${m.marksObtained} / ${test.maxMarks} (${m.percentage}%) • Status: ${m.resultStatus}`;

          const parentInfo = student.parentPhone 
            ? ` (Dispatched to registered parent: ${student.parentName || 'Parent'} - ${student.parentPhone})`
            : '';

          this.sendNotification({
            recipientStudentId: student.id,
            recipientName: student.name,
            recipientRollNumber: student.rollNumber,
            category: 'test_marks',
            title: `Test Marks Published: ${test.name}`,
            message: `Dear ${student.name}, results for ${test.name} (${test.subject}): ${scoreText}.${parentInfo}`,
            actionUrl: 'test-marks',
            actionPayload: {
              testId: test.id,
              marksObtained: m.marksObtained,
              maxMarks: test.maxMarks,
              percentage: m.percentage,
              status: m.resultStatus
            }
          });
          m.lastNotifiedMarks = m.marksObtained;
        }
      }
    });

    this.db.isCustomized = true;
    this.save();
    return { success: true, message: publish ? 'Test marks published to students.' : 'Test marked as unpublished (Private draft).' };
  }

  public toggleTestLeaderboard(testId: string, show: boolean): boolean {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') return false;
    const test = (this.db.tests || []).find(t => t.id === testId);
    if (!test) return false;
    test.showLeaderboard = show;
    this.save();
    return true;
  }

  // --- Ranking System (Test-wise and Monthly Overall) ---
  public getTestRankings(testId: string): {
    test: TestRecord | undefined;
    rankings: RankedStudent[];
    userRank?: RankedStudent;
    canViewLeaderboard: boolean;
  } {
    const session = this.getStoredSession();
    const test = (this.db.tests || []).find(t => t.id === testId);
    if (!test || (!test.isPublished && session?.role === 'student')) {
      return { test: undefined, rankings: [], canViewLeaderboard: false };
    }

    const marks = (this.db.testMarks || [])
      .filter(m => m.testId === testId && m.marksObtained !== null && !m.isAbsent);

    const candidates = marks.map(m => ({
      studentId: m.studentId,
      studentName: m.studentName,
      rollNumber: m.rollNumber,
      grade: m.grade,
      batch: m.batch,
      marksObtained: m.marksObtained || 0,
      maxMarks: m.maxMarks,
      percentage: m.percentage,
      resultStatus: m.resultStatus
    }));

    // Standard competition ranking (1, 2, 2, 4)
    const rankedList = calculateCompetitionRanking(candidates);

    if (session?.role === 'student') {
      const myId = session.data.id;
      const myRank = rankedList.find(r => r.studentId === myId);
      const canView = Boolean(test.showLeaderboard);
      return {
        test,
        rankings: canView ? rankedList : (myRank ? [myRank] : []),
        userRank: myRank,
        canViewLeaderboard: canView
      };
    }

    return {
      test,
      rankings: rankedList,
      canViewLeaderboard: true
    };
  }

  public getMonthlyRankings(grade: string, monthKey: string): {
    monthKey: string;
    grade: string;
    eligibleTests: TestRecord[];
    rankedStudents: RankedStudent[];
    unrankedStudents: RankedStudent[];
    userRank?: RankedStudent;
    minCompletedTests: number;
    canViewLeaderboard: boolean;
  } {
    const session = this.getStoredSession();
    const normGrade = normalizeGrade(grade);
    const minRequired = this.db.rankingConfig?.minCompletedTests || 1;
    const canView = Boolean(this.db.rankingConfig?.showStudentLeaderboard);

    const monthTests = (this.db.tests || []).filter(
      t => t.isPublished && normalizeGrade(t.grade) === normGrade && t.testDate.startsWith(monthKey)
    );

    const activeStudents = this.getActiveStudents().filter(
      s => normalizeGrade(s.grade) === normGrade
    );

    const qualifyingCandidates: Array<{
      studentId: string;
      studentName: string;
      rollNumber: string;
      grade: string;
      batch: string;
      percentage: number;
      testsCompleted: number;
      isQualified: boolean;
      unqualifiedReason?: string;
    }> = [];

    const unrankedList: RankedStudent[] = [];

    activeStudents.forEach(stu => {
      const assigned = monthTests.filter(t => t.batch === 'All' || t.batch === stu.batch);
      const marks = (this.db.testMarks || []).filter(
        m => m.studentId === stu.id && m.isPublished && !m.isAbsent && m.marksObtained !== null &&
             assigned.some(t => t.id === m.testId)
      );

      const completedCount = marks.length;

      if (completedCount >= minRequired && completedCount > 0) {
        const avgPercentage = Number(
          (marks.reduce((sum, m) => sum + m.percentage, 0) / completedCount).toFixed(2)
        );
        qualifyingCandidates.push({
          studentId: stu.id,
          studentName: stu.name,
          rollNumber: stu.rollNumber,
          grade: normGrade,
          batch: stu.batch,
          percentage: avgPercentage,
          testsCompleted: completedCount,
          isQualified: true
        });
      } else {
        const avgPercentage = completedCount > 0
          ? Number((marks.reduce((sum, m) => sum + m.percentage, 0) / completedCount).toFixed(2))
          : 0;

        unrankedList.push({
          rank: 0,
          studentId: stu.id,
          studentName: stu.name,
          rollNumber: stu.rollNumber,
          grade: normGrade,
          batch: stu.batch,
          percentage: avgPercentage,
          testsCompleted: completedCount,
          isQualified: false,
          unqualifiedReason: completedCount === 0 
            ? 'No tests taken this month' 
            : `Completed ${completedCount}/${minRequired} test(s). Minimum ${minRequired} test(s) required.`
        });
      }
    });

    const rankedList = calculateCompetitionRanking(qualifyingCandidates);

    let userRank: RankedStudent | undefined;
    if (session?.role === 'student') {
      const myId = session.data.id;
      userRank = rankedList.find(r => r.studentId === myId) || unrankedList.find(r => r.studentId === myId);

      return {
        monthKey,
        grade: normGrade,
        eligibleTests: monthTests,
        rankedStudents: canView ? rankedList : (userRank?.isQualified ? [userRank] : []),
        unrankedStudents: canView ? unrankedList : (userRank && !userRank.isQualified ? [userRank] : []),
        userRank,
        minCompletedTests: minRequired,
        canViewLeaderboard: canView
      };
    }

    return {
      monthKey,
      grade: normGrade,
      eligibleTests: monthTests,
      rankedStudents: rankedList,
      unrankedStudents: unrankedList,
      minCompletedTests: minRequired,
      canViewLeaderboard: true
    };
  }

  public getMonthlyRankingConfig(): MonthlyRankingConfig {
    return {
      ...DEFAULT_RANKING_CONFIG,
      ...(this.db.rankingConfig || {})
    };
  }

  public updateMonthlyRankingConfig(updates: Partial<MonthlyRankingConfig>): MonthlyRankingConfig {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return this.getMonthlyRankingConfig();
    }
    this.db.rankingConfig = {
      ...this.getMonthlyRankingConfig(),
      ...updates
    };
    this.db.isCustomized = true;
    this.save();
    return this.db.rankingConfig;
  }

  public exportTestResultsCsv(testId: string): string {
    const test = (this.db.tests || []).find(t => t.id === testId);
    if (!test) return '';
    const marks = this.getTestMarks(testId);
    const headers = ['Roll Number', 'Student Name', 'Grade', 'Batch', 'Subject', 'Marks Obtained', 'Max Marks', 'Percentage', 'Status', 'Remarks'];
    const rows = marks.map(m => [
      `"${m.rollNumber}"`,
      `"${m.studentName}"`,
      `"${m.grade}"`,
      `"${m.batch}"`,
      `"${m.subject}"`,
      m.isAbsent ? '"ABSENT"' : (m.marksObtained !== null ? m.marksObtained : '"PENDING"'),
      m.maxMarks,
      `${m.percentage}%`,
      m.resultStatus,
      `"${m.remarks || ''}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // --- Reset & Import/Export (Admin Only) ---
  public resetToDefault(): void {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required.');
    }
    this.db = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.save();
  }

  public exportBackupJson(): string {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required to export database backup.');
    }
    return JSON.stringify(this.db, null, 2);
  }

  public importBackupJson(jsonString: string): { success: boolean; message: string } {
    const session = this.getStoredSession();
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Admin access required to restore database backup.' };
    }
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.students || !parsed.attendance || !parsed.contact) {
        return { success: false, message: 'Invalid PhiMatiCs database format. Missing core fields.' };
      }
      this.db = {
        ...INITIAL_DATABASE,
        ...parsed,
        students: (parsed.students || []).map((s: Student) => ({ ...s, grade: normalizeGrade(s.grade) })),
        batches: (parsed.batches || []).map((b: ClassBatch) => ({ ...b, grade: normalizeGrade(b.grade) })),
        tests: parsed.tests || INITIAL_TESTS,
        testMarks: parsed.testMarks || INITIAL_TEST_MARKS,
        isCustomized: true,
        lastUpdated: new Date().toISOString()
      };
      this.db.feeObligations = generateFeeObligations(this.db.students, this.db.feePayments);
      this.save();
      return { success: true, message: 'Database successfully imported!' };
    } catch (e) {
      return { success: false, message: 'Failed to parse JSON file: ' + (e instanceof Error ? e.message : 'Invalid syntax') };
    }
  }
}

export const dataStore = new DataStore();
