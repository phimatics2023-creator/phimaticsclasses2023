import React, { useState } from 'react';
import { AuthUser, AppNotification, NotificationCategory } from '../types';
import { dataStore } from '../services/storage';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  CalendarCheck2, 
  CreditCard, 
  Clock, 
  Volume2, 
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  EyeOff,
  Award
} from 'lucide-react';
import { requestBrowserPushPermission } from '../services/notifications';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onNavigateToTab: (tab: string, payload?: any) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigateToTab
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState<boolean>(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isStudent = currentUser?.role === 'student';
  const isAdmin = currentUser?.role === 'admin';
  const studentId = isStudent ? currentUser.data.id : undefined;

  // Retrieve notifications (filtered by studentId if student)
  const notifications = dataStore.getNotifications(studentId);
  const unreadCount = dataStore.getUnreadNotificationCount(studentId);

  // Apply filters
  const displayedNotifications = notifications.filter(n => {
    if (filterUnreadOnly && n.isRead) return false;
    if (filterCategory !== 'all' && n.category !== filterCategory) return false;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    dataStore.markNotificationAsRead(id);
  };

  const handleMarkAsUnread = (id: string) => {
    dataStore.markNotificationAsUnread(id);
  };

  const handleMarkAllAsRead = () => {
    dataStore.markAllNotificationsAsRead(studentId);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    dataStore.deleteNotification(id);
  };

  const handleClearAll = () => {
    if (!isAdmin) return;
    if (window.confirm('Clear all notifications in this list?')) {
      dataStore.clearAllNotifications(studentId);
    }
  };

  const handleEnableBrowserPush = async () => {
    const perm = await requestBrowserPushPermission();
    if (perm === 'granted') {
      dataStore.updateNotificationSettings({ browserPushEnabled: true });
      setPushStatusMessage('Browser notifications enabled! You will receive instant desktop alerts.');
    } else if (perm === 'denied') {
      setPushStatusMessage('Permission denied in browser. Please enable notifications in your browser site settings.');
    } else {
      setPushStatusMessage('Notification permission dismissed.');
    }
    setTimeout(() => setPushStatusMessage(null), 4000);
  };

  const handleActionClick = (n: AppNotification) => {
    handleMarkAsRead(n.id);
    onClose();
    if (n.actionUrl) {
      onNavigateToTab(n.actionUrl, n.actionPayload);
    }
  };

  const formatRelativeTime = (isoStr: string) => {
    try {
      const diffMs = Date.now() - new Date(isoStr).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHour < 24) return `${diffHour}h ago`;
      if (diffDay < 7) return `${diffDay}d ago`;
      return new Date(isoStr).toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'attendance':
        return <CalendarCheck2 className="w-4 h-4 text-emerald-600" />;
      case 'announcement':
        return <Bell className="w-4 h-4 text-amber-500" />;
      case 'fee_payment':
        return <CreditCard className="w-4 h-4 text-indigo-600" />;
      case 'fee_reminder':
        return <Clock className="w-4 h-4 text-rose-500" />;
      case 'test_marks':
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  const getCategoryBadgeClass = (category: NotificationCategory) => {
    switch (category) {
      case 'attendance':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'announcement':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'fee_payment':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'fee_reminder':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'test_marks':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">Notification Centre</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isStudent 
                  ? `Personal alerts for ${currentUser.data.name} (${currentUser.data.rollNumber})` 
                  : 'System notification log and dispatches'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Control Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterCategory === 'all' 
                  ? 'bg-slate-900 text-white shadow-2xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilterCategory('attendance')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterCategory === 'attendance' 
                  ? 'bg-emerald-700 text-white shadow-2xs' 
                  : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setFilterCategory('fee_payment')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterCategory === 'fee_payment' 
                  ? 'bg-indigo-700 text-white shadow-2xs' 
                  : 'bg-white text-indigo-800 hover:bg-indigo-50 border border-slate-200'
              }`}
            >
              Fee Payments
            </button>
            <button
              onClick={() => setFilterCategory('fee_reminder')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterCategory === 'fee_reminder' 
                  ? 'bg-rose-700 text-white shadow-2xs' 
                  : 'bg-white text-rose-800 hover:bg-rose-50 border border-slate-200'
              }`}
            >
              Fee Reminders
            </button>
            <button
              onClick={() => setFilterCategory('announcement')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterCategory === 'announcement' 
                  ? 'bg-amber-600 text-white shadow-2xs' 
                  : 'bg-white text-amber-800 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              Circulars
            </button>
            <button
              onClick={() => setFilterCategory('test_marks')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterCategory === 'test_marks' 
                  ? 'bg-amber-700 text-white shadow-2xs' 
                  : 'bg-white text-amber-800 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              Test Marks
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterUnreadOnly}
                onChange={e => setFilterUnreadOnly(e.target.checked)}
                className="rounded-sm text-sky-600"
              />
              <span>Unread only</span>
            </label>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Browser Push Permission Banner */}
        {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
          <div className="px-4 py-2.5 bg-sky-50 border-b border-sky-100 flex items-center justify-between gap-3 text-xs text-sky-900">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Enable desktop & mobile push alerts for instant attendance and fee updates.</span>
            </div>
            <button
              onClick={handleEnableBrowserPush}
              className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              Enable Push
            </button>
          </div>
        )}

        {pushStatusMessage && (
          <div className="p-3 bg-slate-100 text-slate-800 text-xs border-b border-slate-200 text-center font-medium">
            {pushStatusMessage}
          </div>
        )}

        {/* Notification List Body */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1">
          {displayedNotifications.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">No Notifications</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {filterUnreadOnly
                  ? 'You have caught up with all notifications! No unread messages.'
                  : 'You have no alerts in this category yet.'}
              </p>
            </div>
          ) : (
            displayedNotifications.map(n => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                  n.isRead 
                    ? 'bg-white border-slate-200 opacity-90' 
                    : 'bg-sky-50/50 border-sky-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getCategoryBadgeClass(n.category)}`}>
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-xs sm:text-sm font-bold text-slate-900 ${!n.isRead ? 'font-extrabold' : ''}`}>
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(n.category)}`}>
                        {n.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="text-[11px] text-slate-400 pt-0.5 flex items-center gap-2">
                      <span>{formatRelativeTime(n.createdAt)}</span>
                      {isAdmin && n.recipientName && (
                        <span>• Target: <strong>{n.recipientName}</strong> ({n.recipientRollNumber || n.recipientStudentId})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0 pt-2 sm:pt-0">
                  {n.actionUrl && (
                    <button
                      onClick={() => handleActionClick(n)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}

                  {n.isRead ? (
                    <button
                      onClick={() => handleMarkAsUnread(n.id)}
                      title="Mark as unread"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      title="Mark as read"
                      className="p-1.5 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}

                  {/* Strictly authorized admin only: delete action */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      title="Delete notification (Admin only)"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong>{displayedNotifications.length}</strong> of <strong>{notifications.length}</strong> notifications
          </div>

          <div className="flex items-center gap-2">
            {/* Strictly authorized admin only: Clear List action */}
            {isAdmin && notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Clear List
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
