import React, { useState } from 'react';
import { X, Bell, Calendar, Droplet, Receipt, MessageSquare, Check, Sparkles } from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'updates' | 'reminders' | 'messages';
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionText?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'updates' | 'reminders' | 'messages'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      category: 'reminders',
      title: 'Grounds Crew Scheduled for Tomorrow',
      description: 'Callum Brooks arriving for precision lawn mowing and hornbeam trimming at 08:30.',
      time: '15m ago',
      read: false,
      actionText: 'View Booking',
    },
    {
      id: 'n2',
      category: 'reminders',
      title: 'Annabelle Hydrangea Moisture Alert',
      description: 'Topsoil moisture has reached 22% in Zone B. Recommend deep root drench.',
      time: '2h ago',
      read: false,
      actionText: 'Open Garden Map',
    },
    {
      id: 'n3',
      category: 'messages',
      title: 'New Message from Callum Brooks',
      description: '"Good morning Eleanor. We are en route with the roller mower..."',
      time: '3h ago',
      read: true,
      actionText: 'Open Chat',
    },
    {
      id: 'n4',
      category: 'updates',
      title: 'Tax Invoice INV-2026-0924 Issued',
      description: 'Invoice for completed seasonal border weeding is ready for settlement.',
      time: '1d ago',
      read: true,
      actionText: 'Pay Invoice',
    },
    {
      id: 'n5',
      category: 'updates',
      title: 'Autumn Mulching Advisory',
      description: 'RHS Frost alert: Apply 3 inches of organic compost to tender perennial beds before late October.',
      time: '2d ago',
      read: true,
    },
  ]);

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (activeCategory === 'all') return true;
    return n.category === activeCategory;
  });

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleAction = (item: NotificationItem) => {
    if (item.category === 'messages' && onNavigateTab) {
      onNavigateTab('messages');
    } else if (item.category === 'reminders' && onNavigateTab) {
      onNavigateTab('gardens');
    } else if (item.category === 'updates' && onNavigateTab) {
      onNavigateTab('payments');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[85vh] overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-800" />
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Activity & Notifications
            </h2>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-stone-500 hover:text-emerald-800 cursor-pointer"
          >
            Mark all read
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-semibold my-4">
          {(['all', 'reminders', 'updates', 'messages'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer capitalize text-center ${
                activeCategory === cat ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1 text-xs">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-colors flex items-start gap-3 ${
                  item.read ? 'bg-white border-stone-200' : 'bg-emerald-50/50 border-emerald-300/80 shadow-xs'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  {item.category === 'reminders' && <Calendar className="w-4 h-4 text-emerald-800" />}
                  {item.category === 'messages' && <MessageSquare className="w-4 h-4 text-emerald-800" />}
                  {item.category === 'updates' && <Sparkles className="w-4 h-4 text-emerald-800" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{item.title}</span>
                    <span className="text-[10px] text-stone-400">{item.time}</span>
                  </div>
                  <p className="text-stone-600 mt-1 leading-relaxed">{item.description}</p>
                  {item.actionText && (
                    <button
                      onClick={() => handleAction(item)}
                      className="mt-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                    >
                      {item.actionText} →
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-stone-400">No notifications in this category.</div>
          )}
        </div>
      </div>
    </div>
  );
};
