import { AppNotification, NotificationSettings } from '../types';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  inAppEnabled: true,
  whatsappEnabled: true,
  attendanceEnabled: true,
  announcementsEnabled: true,
  feePaymentsEnabled: true,
  feeRemindersEnabled: true,
  testMarksEnabled: true,
  feeDueDayOfMonth: 15,
  reminderPreDueDays: 3,
  reminderOverdueDays: 5,
  browserPushEnabled: false,
  whatsappTemplateStatus: 'approved'
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipientStudentId: 'stu-101', // Aarav Sharma
    recipientName: 'Aarav Sharma',
    recipientRollNumber: 'PHI-1001',
    parentWhatsapp: '+919876543210',
    category: 'attendance',
    title: 'Attendance Confirmed',
    message: 'Aarav Sharma was marked Present for 12 Oct 2026 in Batch 10 - Morning (07:00 AM – 08:30 AM).',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: 'attendance',
    actionPayload: {
      date: '2026-10-12',
      status: 'present',
      batch: 'Batch 10 - Morning'
    },
    deliveryStatus: 'delivered',
    inAppStatus: 'delivered',
    whatsappStatus: 'delivered',
    channel: 'both'
  },
  {
    id: 'notif-2',
    recipientStudentId: 'stu-101',
    recipientName: 'Aarav Sharma',
    recipientRollNumber: 'PHI-1001',
    parentWhatsapp: '+919876543210',
    category: 'fee_payment',
    title: 'Tuition Fee Payment Recorded',
    message: 'Payment of ₹1500 for October 2026 was successfully recorded via UPI for Aarav Sharma. Balance: ₹0. Receipt: RCP-2026-101.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionUrl: 'fees',
    actionPayload: {
      monthKey: '2026-10',
      amount: 1500,
      balance: 0,
      receiptNumber: 'RCP-2026-101'
    },
    deliveryStatus: 'delivered',
    inAppStatus: 'read',
    whatsappStatus: 'delivered',
    channel: 'both'
  },
  {
    id: 'notif-3',
    recipientStudentId: 'all',
    category: 'announcement',
    title: 'New Circular Published',
    message: 'Monthly Tuition Fee Reminder for October 2026: Please clear October dues by the 15th of this month.',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: 'announcements',
    actionPayload: {
      announcementId: 'ann-1'
    },
    deliveryStatus: 'delivered',
    inAppStatus: 'delivered',
    whatsappStatus: 'sent',
    channel: 'both'
  },
  {
    id: 'notif-4',
    recipientStudentId: 'stu-102', // Diya Patel
    recipientName: 'Diya Patel',
    recipientRollNumber: 'PHI-1002',
    parentWhatsapp: '+919876543211',
    category: 'fee_reminder',
    title: 'Tuition Fee Reminder (October 2026)',
    message: 'Tuition fee for Diya Patel for October 2026 is pending (₹1500). Due date: 15 Oct 2026. Please clear at the reception desk.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: 'fees',
    actionPayload: {
      monthKey: '2026-10',
      amount: 1500,
      balance: 1500
    },
    deliveryStatus: 'delivered',
    inAppStatus: 'delivered',
    whatsappStatus: 'queued',
    channel: 'both'
  }
];

export async function requestBrowserPushPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.warn('Error requesting notification permission:', e);
    return 'denied';
  }
}

export function showBrowserNotification(title: string, body: string, icon: string = '/phimatics-logo.svg') {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon
      });
    } catch (e) {
      console.warn('Failed to display browser notification:', e);
    }
  }
}
