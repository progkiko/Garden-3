import React, { useState } from 'react';
import { Send, User, Phone, MapPin, Check, Paperclip, Camera, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'client' | 'gardener';
  senderName: string;
  text: string;
  timestamp: string;
  imageUrl?: string;
}

interface ChatThread {
  id: string;
  gardenerName: string;
  role: string;
  phone: string;
  avatarIcon: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export const MessagesView: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'thread-1',
      gardenerName: 'Callum Brooks',
      role: 'Senior Groundsman & Topiary Lead',
      phone: '+44 7700 900881',
      avatarIcon: 'CB',
      lastMessage: 'Good morning Eleanor. We are en route with the roller mower and should arrive by 08:30.',
      lastTime: '08:15',
      unreadCount: 1,
      messages: [
        {
          id: 'm1',
          sender: 'gardener',
          senderName: 'Callum Brooks',
          text: 'Good morning Eleanor. We are preparing the equipment at Depot 3 for your autumn maintenance visit today.',
          timestamp: '07:45',
        },
        {
          id: 'm2',
          sender: 'client',
          senderName: 'Eleanor Vance',
          text: 'Thank you Callum. Side gate combination is 4821. Please mind our golden retriever Barnaby.',
          timestamp: '08:02',
        },
        {
          id: 'm3',
          sender: 'gardener',
          senderName: 'Callum Brooks',
          text: 'Good morning Eleanor. We are en route with the roller mower and should arrive by 08:30.',
          timestamp: '08:15',
        },
      ],
    },
    {
      id: 'thread-2',
      gardenerName: 'Toby Miller',
      role: 'Irrigation & Turf Specialist',
      phone: '+44 7700 900449',
      avatarIcon: 'TM',
      lastMessage: 'The new rain sensors have arrived. I can install them during Thursday afternoon.',
      lastTime: 'Yesterday',
      unreadCount: 0,
      messages: [
        {
          id: 'm4',
          sender: 'client',
          senderName: 'Eleanor Vance',
          text: 'Hi Toby, did the replacement subsurface drip nozzles arrive for the hydrangea border?',
          timestamp: 'Yesterday 14:10',
        },
        {
          id: 'm5',
          sender: 'gardener',
          senderName: 'Toby Miller',
          text: 'The new rain sensors have arrived. I can install them during Thursday afternoon.',
          timestamp: 'Yesterday 15:30',
        },
      ],
    },
    {
      id: 'thread-3',
      gardenerName: 'Pastures Operations Desk',
      role: 'Central Depot Dispatch',
      phone: '+44 7700 900990',
      avatarIcon: 'HQ',
      lastMessage: 'Invoice INV-2026-0924 has been verified against job sheet.',
      lastTime: '04 Oct',
      unreadCount: 0,
      messages: [
        {
          id: 'm6',
          sender: 'gardener',
          senderName: 'Pastures Operations Desk',
          text: 'Invoice INV-2026-0924 has been verified against job sheet.',
          timestamp: '04 Oct 16:00',
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [inputText, setInputText] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      senderName: 'You',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedThreads = threads.map((t) => {
      if (t.id === activeThread.id) {
        return {
          ...t,
          lastMessage: newMsg.text,
          lastTime: newMsg.timestamp,
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    setInputText('');

    // Simulate groundsman response after 1.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'gardener',
        senderName: activeThread.gardenerName,
        text: 'Received loud and clear Eleanor. I will make sure the crew handles this precisely.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? {
                ...t,
                lastMessage: replyMsg.text,
                lastTime: replyMsg.timestamp,
                messages: [...t.messages, replyMsg],
              }
            : t
        )
      );
    }, 1500);
  };

  const handleQuickSend = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Grounds Crew & Arborist Messages
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Direct communication channel with your assigned field crew, arborist leads, and central depot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs min-h-[600px]">
        {/* Left: Chat List (4 cols) */}
        <div className="lg:col-span-4 border-r border-stone-200 flex flex-col">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50">
            <div className="text-xs font-bold text-stone-900">Conversations ({threads.length})</div>
          </div>

          <div className="divide-y divide-stone-100 flex-1 overflow-y-auto">
            {threads.map((thread) => {
              const isSelected = thread.id === activeThread.id;
              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-4 text-left transition-colors cursor-pointer flex items-start gap-3 ${
                    isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-700' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {thread.avatarIcon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-stone-900 truncate">
                        {thread.gardenerName}
                      </div>
                      <span className="text-[10px] text-stone-400">{thread.lastTime}</span>
                    </div>

                    <div className="text-[11px] text-stone-500 truncate">{thread.role}</div>

                    <p className="text-xs text-stone-600 truncate mt-1">
                      {thread.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Room (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {/* Chat Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center">
                {activeThread.avatarIcon}
              </div>
              <div>
                <div className="font-bold text-xs text-stone-900">{activeThread.gardenerName}</div>
                <div className="text-[11px] text-stone-500">{activeThread.role} · On Shift</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeThread.phone}`}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-md transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-800" />
                <span>Call Crew</span>
              </a>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[420px] bg-stone-50/20">
            {activeThread.messages.map((m) => {
              const isMe = m.sender === 'client';
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-emerald-800 text-white rounded-br-none shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {m.senderName} · {m.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick reply suggestions */}
          <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/40 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-stone-400 shrink-0">Quick prompts:</span>
            {[
              'Side gate is unlocked',
              'Please mow at 35mm height',
              'Leave clippings in compost bay',
              'Can you check the hydrangea soil?',
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuickSend(q)}
                className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-full text-stone-700 whitespace-nowrap cursor-pointer transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-200 flex items-center gap-2 bg-white">
            <button
              type="button"
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
              title="Attach garden photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeThread.gardenerName}...`}
              className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
