import React from 'react';
import {
  LayoutGrid,
  CalendarDays,
  BookOpen,
  CalendarCheck,
  CreditCard,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'schedule', label: 'My Schedule', icon: CalendarDays },
    { id: 'students', label: 'My Students', icon: BookOpen },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-[#1f295b] text-white flex flex-col justify-between shrink-0 h-full min-h-full p-4 select-none shadow-xl">
      <div>
        {/* Brand Logo & Drum Kit Illustration */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Drum set SVG Illustration matching RemDrumStudio identity */}
            <svg viewBox="0 0 48 48" className="w-10 h-10 drop-shadow" fill="none">
              {/* Hi-hat cymbal top */}
              <ellipse cx="14" cy="12" rx="10" ry="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
              <line x1="14" y1="14" x2="14" y2="38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              {/* Crash cymbal right */}
              <ellipse cx="36" cy="14" rx="10" ry="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
              <line x1="36" y1="16" x2="36" y2="38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              {/* Bass Drum Center */}
              <circle cx="25" cy="27" r="13" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
              <circle cx="25" cy="27" r="9.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="25" cy="27" r="3" fill="#ef4444" opacity="0.8" />
              {/* Snare drum left */}
              <rect x="8" y="24" width="11" height="8" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />
              <ellipse cx="13.5" cy="24" rx="5.5" ry="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              {/* Drumsticks crossed */}
              <line x1="12" y1="20" x2="28" y2="34" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="28" y1="20" x2="12" y2="34" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="text-lg font-black tracking-tight flex items-baseline">
              <span className="text-white tracking-normal font-extrabold">Rem</span>
              <span className="text-[#ef4444] font-black italic">Drum</span>
              <span className="text-[#facc15] font-black">Studio</span>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="px-3 mb-2">
          <p className="text-[11px] font-bold tracking-wider text-[#8fa0c0] uppercase">
            Tutor's Workspace
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#2b376d] text-white shadow-xs'
                    : 'text-[#9cb0cf] hover:text-white hover:bg-[#253163]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8598b9]'}`} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#facc15]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tutor Profile at Bottom */}
      <div className="pt-4 border-t border-[#2e3b75]/60 mt-auto">
        <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-[#18214b]/60 border border-[#2b376d]/50 hover:bg-[#18214b] transition cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#27356c] border border-[#3d4d8c] flex items-center justify-center font-bold text-xs text-white shadow-inner">
              PP
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Pedro Penduco</p>
              <p className="text-[11px] text-[#8fa0c0] leading-tight">Tutor</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8fa0c0]" />
        </div>
      </div>
    </aside>
  );
}
