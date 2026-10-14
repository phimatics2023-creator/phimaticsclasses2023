import { AppContentConfig } from '../types';

export const DEFAULT_APP_CONTENT: AppContentConfig = {
  general: {
    appName: 'PhiMatiCs Classes',
    tagline: 'The Learning App · Grades 1–12',
    welcomeMessage: 'Learn. Practise. Improve. Achieve.',
    phone: '+91 6361069450',
    whatsapp: '+916361069450',
    email: 'phimatics2023@gmail.com',
    address: 'Plot 42, Academic Arcade, Near City Library, Main Road',
    website: 'https://phimatics.org',
    mapsUrl: 'https://maps.google.com/?q=PhiMatiCs+Classes',
    workingHours: 'Mon - Sat: 06:30 AM – 08:30 PM (Sunday: 08:00 AM – 01:00 PM)',
    footerText: '© 2026 PhiMatiCs Classes. All rights reserved. Empowering young minds through conceptual clarity.',
    logoUrl: ''
  },
  login: {
    heading: 'Portal Sign In',
    description: 'Access student attendance records, test marks, fee status, and study materials',
    studentTabLabel: 'Student',
    studentInstruction: 'Sign in using your Roll Number and Password',
    adminTabLabel: 'Administrator',
    adminInstruction: 'Administrative access for faculty and institute staff',
    idFieldLabel: 'Roll Number or Email Address',
    passwordFieldLabel: 'Account Password',
    submitButton: 'Sign In to Portal',
    helpText: 'Need account assistance? Contact academic helpline at +91 6361069450 or phimatics2023@gmail.com'
  },
  dashboard: {
    heroHeading: 'Concept-First Learning in Mathematics & Science',
    heroSubtitle: 'Tuition classes for Grades 1 to 12 in Mathematics & Science with concept-first teaching and periodic assessments.',
    adminWelcome: 'Administrator Dashboard',
    adminSubtitle: 'Manage class batches, student attendance logs, monthly tuition fee collections, test marks, and study resources across Grades 1 to 12.',
    studentWelcomePrefix: 'Welcome back',
    statsStudentsLabel: 'Enrolled Students',
    statsBatchesLabel: 'Active Batches',
    statsMaterialsLabel: 'Study Resources',
    statsFeesLabel: 'Tuition Collected',
    announcementsSectionTitle: 'Recent Announcements',
    quickActionsTitle: 'Quick Navigation & Services'
  },
  navigation: {
    brandName: 'PhiMatiCs Classes',
    brandTagline: 'The Learning App',
    navHome: 'Home',
    navBatches: 'Batches',
    navAttendance: 'Attendance',
    navFees: 'Monthly Fees',
    navAnnouncements: 'Announcements',
    navMaterials: 'Study Materials',
    navOnlineClasses: 'Online Classes',
    navGallery: 'Gallery',
    navContact: 'Contact',
    navAppSettings: 'App Content & Settings',
    navManageStudents: 'Manage Students',
    signInButton: 'Sign In',
    signOutButton: 'Sign Out'
  },
  batches: {
    pageTitle: 'Batches',
    pageSubtitle: 'Academic class batches across Grades 1 to 12, schedules, and student enrollment.',
    studentSubtitle: 'Details and timings for your assigned class batch at PhiMatiCs Classes.',
    addBatchButton: '+ Add Batch',
    createModalTitle: 'Create New Batch',
    editModalTitle: 'Edit Batch',
    fieldBatchName: 'Batch Name',
    fieldGrade: 'Grade',
    fieldSubjects: 'Subjects',
    fieldTimings: 'Batch Timings',
    fieldDays: 'Days of the Week',
    fieldTeacher: 'Teacher Name (optional)',
    fieldDescription: 'Description (optional)',
    assignStudentsButton: 'Assign Students',
    emptyStateMessage: 'No batches found matching the selected grade or search filter.'
  },
  attendance: {
    pageTitle: 'Attendance Management',
    pageSubtitle: 'Daily student attendance tracking and records by date and grade',
    instructions: 'Select a date and grade to view or mark attendance. Click save to record daily entries.',
    statusPresent: 'Present',
    statusAbsent: 'Absent',
    statusLeave: 'Leave',
    markAllPresentButton: 'Mark All Present',
    saveAttendanceButton: 'Save Attendance Records'
  },
  fees: {
    pageTitle: 'Monthly Tuition Fees',
    pageSubtitle: 'Comprehensive fee tracking, student balances, payment recording, and digital receipts',
    paymentInstructions: 'Tuition fees can be cleared via UPI, Cash, or Direct Bank Transfer at the office reception desk. Official receipts are issued on the portal.',
    recordPaymentButton: 'Record Payment',
    statusPaid: 'Paid',
    statusPartial: 'Partial',
    statusPending: 'Pending',
    statusNotDue: 'Upcoming / Not Due',
    reminderTemplate: 'Dear Parent/Student, this is a reminder regarding tuition fees for {month}. Pending balance is ₹{balance}. Please clear at your earliest convenience. Thank you, PhiMatiCs Classes.',
    downloadReceiptButton: 'Download Receipt'
  },
  announcements: {
    pageTitle: 'Announcements & Notices',
    pageSubtitle: 'Official circulars, exam notifications, holiday schedules, and academic updates',
    newAnnouncementButton: 'New Announcement',
    defaultAudienceLabel: 'Target Audience',
    pinNoticeLabel: 'Pin announcement to top',
    defaultTemplate: 'Important notice regarding upcoming classes, test dates, or administrative schedules.'
  },
  materialsAndClasses: {
    materialsTitle: 'Study Materials & Notes',
    materialsSubtitle: 'Curated chapter notes, worksheets, solved exemplar sets, and practice papers',
    uploadMaterialButton: 'Upload Material',
    classesTitle: 'Live Online Classes',
    classesSubtitle: 'Scheduled interactive live lectures, problem discussions, and extra sessions via Google Meet',
    scheduleClassButton: 'Schedule Online Class',
    joinClassButton: 'Join Google Meet',
    galleryTitle: 'Life at PhiMatiCs Classes',
    gallerySubtitle: 'Moments of learning, science experiments, celebrations, and academic achievements',
    addPhotoButton: 'Add Gallery Photo'
  },
  formsAndButtons: {
    saveChangesButton: 'Save Changes',
    cancelButton: 'Cancel',
    deleteButton: 'Delete',
    editButton: 'Edit',
    closeButton: 'Close',
    searchPlaceholder: 'Search records, names, or topics...',
    filterAllGrades: 'All Grades (1-12)',
    confirmDeletePrompt: 'Are you sure you want to delete this record? This action cannot be undone.',
    successSavedMessage: 'Changes saved successfully.'
  }
};

export interface ContentCategoryMeta {
  key: keyof AppContentConfig;
  title: string;
  description: string;
  badge: string;
}

export const CONTENT_CATEGORIES: ContentCategoryMeta[] = [
  {
    key: 'general',
    title: 'General Settings',
    description: 'Institution name, app branding, logo, contact details, address, website and footer',
    badge: 'Core Identity'
  },
  {
    key: 'login',
    title: 'Login Page',
    description: 'Headings, role descriptions, form instructions, field labels, and help text',
    badge: 'Authentication'
  },
  {
    key: 'dashboard',
    title: 'Dashboard',
    description: 'Hero headlines, subtitles, welcome messages, quick stats metrics, and section headers',
    badge: 'Home Screen'
  },
  {
    key: 'navigation',
    title: 'Navigation',
    description: 'Top header links, mobile menu titles, brand banner, and button text',
    badge: 'Menus & Bars'
  },
  {
    key: 'batches',
    title: 'Batches',
    description: 'Headings, subtitle descriptions, modal titles, form field labels, and buttons',
    badge: 'Class Batches'
  },
  {
    key: 'attendance',
    title: 'Attendance',
    description: 'Page title, helper instructions, status badge labels (Present, Absent, Leave), and action buttons',
    badge: 'Daily Logs'
  },
  {
    key: 'fees',
    title: 'Fees',
    description: 'Fee collection headings, payment instructions, status labels, and reminder templates',
    badge: 'Accounts'
  },
  {
    key: 'announcements',
    title: 'Announcements',
    description: 'Circular headings, subtitle descriptions, button labels, and default message templates',
    badge: 'Circulars'
  },
  {
    key: 'materialsAndClasses',
    title: 'Materials, Classes & Gallery',
    description: 'Study materials, live Google Meet classes, and photo gallery titles, subtitles, and buttons',
    badge: 'Learning Media'
  },
  {
    key: 'formsAndButtons',
    title: 'Forms & Buttons',
    description: 'Universal button labels, search placeholders, filter labels, confirmation prompts, and messages',
    badge: 'Global UI'
  }
];

export interface FieldDefinition {
  key: string;
  label: string;
  description?: string;
  type: 'text' | 'textarea' | 'logo';
  placeholder?: string;
}

export const CATEGORY_FIELD_DEFINITIONS: Record<keyof AppContentConfig, FieldDefinition[]> = {
  general: [
    { key: 'appName', label: 'App / Institution Name', description: 'Primary name shown across the header, portal, and reports', type: 'text' },
    { key: 'tagline', label: 'Tagline / Subtitle', description: 'Displayed beside the logo (e.g. The Learning App)', type: 'text' },
    { key: 'welcomeMessage', label: 'Welcome / Mission Banner', description: 'Institutional motto and grade coverage banner', type: 'text' },
    { key: 'phone', label: 'Contact Phone Number', description: 'Official office phone for student queries', type: 'text' },
    { key: 'whatsapp', label: 'WhatsApp Number', description: 'Number used for direct WhatsApp chat links', type: 'text' },
    { key: 'email', label: 'Official Email Address', description: 'Support and contact email', type: 'text' },
    { key: 'address', label: 'Physical Center Address', description: 'Complete coaching center address', type: 'textarea' },
    { key: 'website', label: 'Website Link', description: 'Official institution website URL', type: 'text' },
    { key: 'mapsUrl', label: 'Google Maps Link', description: 'Direct location map link for navigation', type: 'text' },
    { key: 'workingHours', label: 'Office Working Hours', description: 'Operational days and visiting hours', type: 'text' },
    { key: 'footerText', label: 'Footer Notice & Copyright', description: 'Displayed at the base of the app', type: 'textarea' }
  ],
  login: [
    { key: 'heading', label: 'Login Modal Heading', description: 'Main title on the sign in dialog', type: 'text' },
    { key: 'description', label: 'Login Subtitle / Description', description: 'Brief guidance on what users access upon signing in', type: 'text' },
    { key: 'studentTabLabel', label: 'Student Tab Label', description: 'Tab label for student authentication', type: 'text' },
    { key: 'studentInstruction', label: 'Student Login Instruction', description: 'Guidance shown above credentials input', type: 'textarea' },
    { key: 'adminTabLabel', label: 'Admin Tab Label', description: 'Tab label for administrator sign in', type: 'text' },
    { key: 'adminInstruction', label: 'Admin Login Instruction', description: 'Guidance shown for administrative login', type: 'textarea' },
    { key: 'idFieldLabel', label: 'Identifier Field Label', description: 'Label for email/roll number input', type: 'text' },
    { key: 'passwordFieldLabel', label: 'Password Field Label', description: 'Label for password input', type: 'text' },
    { key: 'submitButton', label: 'Submit Button Label', description: 'Text on the sign in submit button', type: 'text' },
    { key: 'helpText', label: 'Help / Support Notice', description: 'Support contact message at bottom of modal', type: 'textarea' }
  ],
  dashboard: [
    { key: 'heroHeading', label: 'Hero Headline', description: 'Primary headline on the top dashboard card', type: 'text' },
    { key: 'heroSubtitle', label: 'Hero Subtitle Description', description: 'Introductory summary under the headline', type: 'textarea' },
    { key: 'adminWelcome', label: 'Admin Dashboard Title', description: 'Headline shown when admin is logged in', type: 'text' },
    { key: 'adminSubtitle', label: 'Admin Dashboard Subtitle', description: 'Brief summary for faculty and administrator', type: 'textarea' },
    { key: 'studentWelcomePrefix', label: 'Student Welcome Prefix', description: 'e.g. Welcome back, {Student Name}!', type: 'text' },
    { key: 'statsStudentsLabel', label: 'Students Metric Label', description: 'Label for total student count', type: 'text' },
    { key: 'statsBatchesLabel', label: 'Batches Metric Label', description: 'Label for total active batches count', type: 'text' },
    { key: 'statsMaterialsLabel', label: 'Study Resources Metric Label', description: 'Label for uploaded materials count', type: 'text' },
    { key: 'statsFeesLabel', label: 'Tuition Metric Label', description: 'Label for fee collections metric', type: 'text' },
    { key: 'announcementsSectionTitle', label: 'Announcements Section Title', description: 'Heading for recent circulars feed', type: 'text' },
    { key: 'quickActionsTitle', label: 'Quick Navigation Heading', description: 'Heading for app services quick launch cards', type: 'text' }
  ],
  navigation: [
    { key: 'brandName', label: 'Navbar Brand Heading', description: 'Primary brand name beside the logo in the header', type: 'text' },
    { key: 'brandTagline', label: 'Navbar Brand Subheading', description: 'Subtitle beside the brand name in the header', type: 'text' },
    { key: 'navHome', label: 'Home Nav Label', description: 'Menu label for Home view', type: 'text' },
    { key: 'navBatches', label: 'Batches Nav Label', description: 'Menu label for Batches view', type: 'text' },
    { key: 'navAttendance', label: 'Attendance Nav Label', description: 'Menu label for Attendance view', type: 'text' },
    { key: 'navFees', label: 'Fees Nav Label', description: 'Menu label for Monthly Fees view', type: 'text' },
    { key: 'navAnnouncements', label: 'Announcements Nav Label', description: 'Menu label for Announcements view', type: 'text' },
    { key: 'navMaterials', label: 'Study Materials Nav Label', description: 'Menu label for Study Materials view', type: 'text' },
    { key: 'navOnlineClasses', label: 'Online Classes Nav Label', description: 'Menu label for Online Classes view', type: 'text' },
    { key: 'navGallery', label: 'Gallery Nav Label', description: 'Menu label for Gallery view', type: 'text' },
    { key: 'navContact', label: 'Contact Nav Label', description: 'Menu label for Contact view', type: 'text' },
    { key: 'navAppSettings', label: 'App Content & Settings Nav Label', description: 'Menu label for Admin Content & Settings', type: 'text' },
    { key: 'navManageStudents', label: 'Manage Students Nav Label', description: 'Menu label for Admin Student roster', type: 'text' },
    { key: 'signInButton', label: 'Sign In Button Text', description: 'Navbar button when logged out', type: 'text' },
    { key: 'signOutButton', label: 'Sign Out Button Text', description: 'Navbar button when logged in', type: 'text' }
  ],
  batches: [
    { key: 'pageTitle', label: 'Batches Page Title', description: 'Main heading on the batches screen', type: 'text' },
    { key: 'pageSubtitle', label: 'Admin Page Subtitle', description: 'Description explaining batches overview for admin', type: 'textarea' },
    { key: 'studentSubtitle', label: 'Student Page Subtitle', description: 'Description explaining assigned batch for student', type: 'textarea' },
    { key: 'addBatchButton', label: 'Add Batch Button Label', description: 'Button text to launch new batch creation form', type: 'text' },
    { key: 'createModalTitle', label: 'Create Batch Modal Heading', description: 'Title on the Add Batch dialog', type: 'text' },
    { key: 'editModalTitle', label: 'Edit Batch Modal Heading', description: 'Title on the Edit Batch dialog', type: 'text' },
    { key: 'fieldBatchName', label: 'Batch Name Field Label', description: 'Label for batch name input', type: 'text' },
    { key: 'fieldGrade', label: 'Grade Field Label', description: 'Label for grade dropdown', type: 'text' },
    { key: 'fieldSubjects', label: 'Subjects Field Label', description: 'Label for subjects input', type: 'text' },
    { key: 'fieldTimings', label: 'Batch Timings Field Label', description: 'Label for timings input', type: 'text' },
    { key: 'fieldDays', label: 'Days Field Label', description: 'Label for weekly schedule days input', type: 'text' },
    { key: 'fieldTeacher', label: 'Teacher Field Label', description: 'Label for teacher in-charge input', type: 'text' },
    { key: 'fieldDescription', label: 'Description Field Label', description: 'Label for batch description notes', type: 'text' },
    { key: 'assignStudentsButton', label: 'Assign Students Button Label', description: 'Button text on batch card to manage students', type: 'text' },
    { key: 'emptyStateMessage', label: 'Empty State Message', description: 'Notice displayed when no batches match filters', type: 'textarea' }
  ],
  attendance: [
    { key: 'pageTitle', label: 'Attendance Page Title', description: 'Main heading on attendance screen', type: 'text' },
    { key: 'pageSubtitle', label: 'Attendance Page Subtitle', description: 'Brief description under attendance title', type: 'textarea' },
    { key: 'instructions', label: 'Attendance Helper Instructions', description: 'Instructions box explaining date/grade selection', type: 'textarea' },
    { key: 'statusPresent', label: 'Present Status Label', description: 'Label for Present attendance badge', type: 'text' },
    { key: 'statusAbsent', label: 'Absent Status Label', description: 'Label for Absent attendance badge', type: 'text' },
    { key: 'statusLeave', label: 'Leave Status Label', description: 'Label for Leave attendance badge', type: 'text' },
    { key: 'markAllPresentButton', label: 'Mark All Present Button', description: 'Quick action button to mark all students present', type: 'text' },
    { key: 'saveAttendanceButton', label: 'Save Attendance Button', description: 'Button to commit attendance records', type: 'text' }
  ],
  fees: [
    { key: 'pageTitle', label: 'Fees Page Title', description: 'Main heading on monthly fees screen', type: 'text' },
    { key: 'pageSubtitle', label: 'Fees Page Subtitle', description: 'Description of fee records and receipts ledger', type: 'textarea' },
    { key: 'paymentInstructions', label: 'Payment Instructions Box', description: 'Official notice on acceptable payment modes', type: 'textarea' },
    { key: 'recordPaymentButton', label: 'Record Payment Button', description: 'Button to open payment recording modal', type: 'text' },
    { key: 'statusPaid', label: 'Paid Status Label', description: 'Label for Paid fee obligation status', type: 'text' },
    { key: 'statusPartial', label: 'Partial Status Label', description: 'Label for Partial fee obligation status', type: 'text' },
    { key: 'statusPending', label: 'Pending Status Label', description: 'Label for Pending / Overdue fee status', type: 'text' },
    { key: 'statusNotDue', label: 'Not Due Status Label', description: 'Label for future academic month status', type: 'text' },
    { key: 'reminderTemplate', label: 'Fee Reminder Template', description: 'Template with {month} and {balance} placeholders for WhatsApp/SMS', type: 'textarea' },
    { key: 'downloadReceiptButton', label: 'Download Receipt Button', description: 'Button label on receipt generation', type: 'text' }
  ],
  announcements: [
    { key: 'pageTitle', label: 'Announcements Page Title', description: 'Main heading on circulars & notices screen', type: 'text' },
    { key: 'pageSubtitle', label: 'Announcements Page Subtitle', description: 'Description of official announcements and updates', type: 'textarea' },
    { key: 'newAnnouncementButton', label: 'New Notice Button', description: 'Button to draft and publish an announcement', type: 'text' },
    { key: 'defaultAudienceLabel', label: 'Audience Field Label', description: 'Target audience dropdown label', type: 'text' },
    { key: 'pinNoticeLabel', label: 'Pin Notice Checkbox Label', description: 'Label for pin to top toggle', type: 'text' },
    { key: 'defaultTemplate', label: 'Default Circular Template', description: 'Preset draft message when creating a circular', type: 'textarea' }
  ],
  materialsAndClasses: [
    { key: 'materialsTitle', label: 'Study Materials Page Title', description: 'Heading on study materials screen', type: 'text' },
    { key: 'materialsSubtitle', label: 'Study Materials Subtitle', description: 'Description of curated notes and papers', type: 'textarea' },
    { key: 'uploadMaterialButton', label: 'Upload Material Button', description: 'Button to add a PDF or video resource', type: 'text' },
    { key: 'classesTitle', label: 'Online Classes Page Title', description: 'Heading on live classes screen', type: 'text' },
    { key: 'classesSubtitle', label: 'Online Classes Subtitle', description: 'Description of scheduled Google Meet lectures', type: 'textarea' },
    { key: 'scheduleClassButton', label: 'Schedule Class Button', description: 'Button to schedule a new live class', type: 'text' },
    { key: 'joinClassButton', label: 'Join Meet Button Label', description: 'Action button on live class card', type: 'text' },
    { key: 'galleryTitle', label: 'Gallery Page Title', description: 'Heading on photo gallery screen', type: 'text' },
    { key: 'gallerySubtitle', label: 'Gallery Subtitle', description: 'Description of student moments and events', type: 'textarea' },
    { key: 'addPhotoButton', label: 'Add Photo Button', description: 'Button to upload an event photo', type: 'text' }
  ],
  formsAndButtons: [
    { key: 'saveChangesButton', label: 'Save Changes Button', description: 'Universal commit button label', type: 'text' },
    { key: 'cancelButton', label: 'Cancel Button', description: 'Universal dismiss button label', type: 'text' },
    { key: 'deleteButton', label: 'Delete Button', description: 'Universal removal button label', type: 'text' },
    { key: 'editButton', label: 'Edit Button', description: 'Universal edit button label', type: 'text' },
    { key: 'closeButton', label: 'Close Button', description: 'Universal modal close button label', type: 'text' },
    { key: 'searchPlaceholder', label: 'Search Input Placeholder', description: 'Universal search box placeholder hint', type: 'text' },
    { key: 'filterAllGrades', label: 'All Grades Option Label', description: 'Filter dropdown option for all classes', type: 'text' },
    { key: 'confirmDeletePrompt', label: 'Confirm Deletion Message', description: 'Confirmation prompt displayed before deleting records', type: 'textarea' },
    { key: 'successSavedMessage', label: 'Success Saved Toast Message', description: 'Notification displayed upon successful save', type: 'text' }
  ]
};
