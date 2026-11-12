import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import MySchedule from './components/MySchedule.jsx';
import MyStudents from './components/MyStudents.jsx';
import Bookings from './components/Bookings.jsx';
import Payments from './components/Payments.jsx';
import { Menu, X, Layers } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendData, setBackendData] = useState({
    dashboard: null,
    schedules: null,
    students: null,
    bookings: null,
    payments: null,
  });

  // Fetch initial data from Express backend API
  const fetchAllData = async () => {
    try {
      const [dashRes, schedRes, studRes, bookRes, payRes] = await Promise.allSettled([
        fetch('/api/dashboard'),
        fetch('/api/schedules'),
        fetch('/api/students'),
        fetch('/api/bookings'),
        fetch('/api/payments'),
      ]);

      const newObj = { ...backendData };
      if (dashRes.status === 'fulfilled' && dashRes.value.ok) {
        newObj.dashboard = await dashRes.value.json();
      }
      if (schedRes.status === 'fulfilled' && schedRes.value.ok) {
        newObj.schedules = await schedRes.value.json();
      }
      if (studRes.status === 'fulfilled' && studRes.value.ok) {
        newObj.students = await studRes.value.json();
      }
      if (bookRes.status === 'fulfilled' && bookRes.value.ok) {
        newObj.bookings = await bookRes.value.json();
      }
      if (payRes.status === 'fulfilled' && payRes.value.ok) {
        newObj.payments = await payRes.value.json();
      }
      setBackendData(newObj);
    } catch (err) {
      console.log('Running in client fallback mode:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const figureTabs = [
    { id: 'dashboard', label: 'Dashboard', desc: "Tutor's Dashboard" },
    { id: 'schedule', label: 'My Schedule', desc: "Tutor's Compilation of Schedules" },
    { id: 'students', label: 'My Students', desc: "Tutor's List of Students" },
    { id: 'bookings', label: 'Bookings', desc: "Tutor's Booking Lesson" },
    { id: 'payments', label: 'Payment', desc: "Tutor's Record of Payment" },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f3f6fa] flex font-sans">
      {/* Desktop Sidebar: stretches all the way to the bottom */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Slide-over Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 bg-[#1f295b] h-full shadow-2xl">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Right Column: Top Bar and Main Workspace Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Switcher Bar (without the word figure) */}
        <header className="bg-[#18214b] text-white border-b border-[#2b376d] px-4 py-2 shrink-0 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#facc15]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                RemDrumStudio Workspace:
              </span>
            </div>
          </div>

          {/* Quick switcher tabs without the word figure */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {figureTabs.map((fig) => {
              const isActive = activeTab === fig.id;
              return (
                <button
                  key={fig.id}
                  onClick={() => {
                    setActiveTab(fig.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#ef4444] text-white shadow-xs'
                      : 'bg-[#253267] text-slate-300 hover:text-white hover:bg-[#2d3c7a]'
                  }`}
                >
                  {fig.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f3f6fa]">
          {activeTab === 'dashboard' && (
            <Dashboard data={backendData.dashboard} onRefresh={fetchAllData} />
          )}
          {activeTab === 'schedule' && (
            <MySchedule data={backendData.schedules} onRefresh={fetchAllData} />
          )}
          {activeTab === 'students' && (
            <MyStudents data={backendData.students} onRefresh={fetchAllData} />
          )}
          {activeTab === 'bookings' && (
            <Bookings data={backendData.bookings} onRefresh={fetchAllData} />
          )}
          {activeTab === 'payments' && (
            <Payments data={backendData.payments} onRefresh={fetchAllData} />
          )}
        </main>
      </div>
    </div>
  );
}
