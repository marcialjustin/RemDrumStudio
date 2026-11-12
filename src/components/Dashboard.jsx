import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import Modal from './Modal.jsx';

export default function Dashboard({ data, onRefresh }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [overviewStats, setOverviewStats] = useState(
    data?.stats || {
      todayLessons: 3,
      upcomingLessons: 3,
      myStudents: 3,
      pendingConfirmation: 3
    }
  );

  const todaysSchedule = data?.todaysSchedule || [
    {
      id: 'ts-1',
      date: 'October 24, 2026',
      time: '2:00 - 3:00 PM',
      lesson: 'Drum Lesson',
      student: 'Zaira Gongon',
      status: 'Confirmed',
      paymentStatus: 'Paid'
    },
    {
      id: 'ts-2',
      date: 'October 24, 2026',
      time: '2:00 - 3:00 PM',
      lesson: 'Drum Lesson',
      student: 'Patricia Arquileta',
      status: 'Confirmed',
      paymentStatus: 'Paid'
    }
  ];

  const upcomingLessons = data?.upcomingLessons || [
    {
      id: 'ul-1',
      date: 'October 24, 2026',
      time: '2:00 - 3:00 PM',
      lesson: 'Drum Lesson',
      student: 'Zaira Gongon',
      status: 'Pending',
      paymentStatus: 'Unpaid'
    },
    {
      id: 'ul-2',
      date: 'October 24, 2026',
      time: '2:00 - 3:00 PM',
      lesson: 'Drum Lesson',
      student: 'Patricia Arquileta',
      status: 'Confirmed',
      paymentStatus: 'Paid'
    }
  ];

  const handleUpdateStats = (field, delta) => {
    setOverviewStats(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta)
    }));
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header bar */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#172347] tracking-tight">
            Welcome Back, Coach Rem!
          </h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Here's your teaching schedule and studio activity.
          </p>
        </div>
        <button 
          className="relative p-2 text-slate-500 hover:text-slate-800 transition"
          title="Studio Notifications"
          onClick={() => alert('Notifications: You have 1 pending reschedule request from Patricia Arquileta.')}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>

      {/* TODAY'S OVERVIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#64748b] tracking-wider uppercase">
            Today's Overview
          </h2>
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="rem-btn-action text-xs"
          >
            Manage Details
          </button>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-[#deecfc] border border-[#cbe0f8] rounded-xl p-4 transition hover:shadow-xs">
            <p className="text-[10px] font-bold text-[#5a6c85] uppercase tracking-wider">
              Today's Lessons
            </p>
            <p className="text-2xl font-bold text-[#172347] mt-1.5">
              {overviewStats.todayLessons}
            </p>
          </div>

          <div className="bg-[#deecfc] border border-[#cbe0f8] rounded-xl p-4 transition hover:shadow-xs">
            <p className="text-[10px] font-bold text-[#5a6c85] uppercase tracking-wider">
              Upcoming Lessons
            </p>
            <p className="text-2xl font-bold text-[#172347] mt-1.5">
              {overviewStats.upcomingLessons}
            </p>
          </div>

          <div className="bg-[#deecfc] border border-[#cbe0f8] rounded-xl p-4 transition hover:shadow-xs">
            <p className="text-[10px] font-bold text-[#5a6c85] uppercase tracking-wider">
              My Students
            </p>
            <p className="text-2xl font-bold text-[#172347] mt-1.5">
              {overviewStats.myStudents}
            </p>
          </div>

          <div className="bg-[#deecfc] border border-[#cbe0f8] rounded-xl p-4 transition hover:shadow-xs">
            <p className="text-[10px] font-bold text-[#5a6c85] uppercase tracking-wider">
              Pending Confirmation
            </p>
            <p className="text-2xl font-bold text-[#172347] mt-1.5">
              {overviewStats.pendingConfirmation}
            </p>
          </div>
        </div>
      </div>

      {/* Main Schedule Container */}
      <div className="bg-white border border-[#dce6f2] rounded-xl p-5 md:p-6 shadow-xs space-y-6">
        {/* CURRENT DAY - Today's Schedule */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
              Current Day
            </p>
            <h3 className="text-base font-bold text-[#172347]">
              Today's Schedule
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {todaysSchedule.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8fbfe] rounded-lg px-2 -mx-2 transition"
              >
                <div className="w-44 shrink-0">
                  <p className="text-xs font-bold text-[#172347]">{item.date}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-[#172347]">{item.lesson}</p>
                  <p className="text-xs text-slate-600">{item.student}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rem-pill-blue">{item.status}</span>
                  <span className="rem-pill-blue">{item.paymentStatus}</span>
                  <button
                    onClick={() => setSelectedLesson(item)}
                    className="rem-btn-action ml-2"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMING NEXT - Upcoming Lesson */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div>
            <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
              Coming Next
            </p>
            <h3 className="text-base font-bold text-[#172347]">
              Upcoming Lesson
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingLessons.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8fbfe] rounded-lg px-2 -mx-2 transition"
              >
                <div className="w-44 shrink-0">
                  <p className="text-xs font-bold text-[#172347]">{item.date}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-[#172347]">{item.lesson}</p>
                  <p className="text-xs text-slate-600">{item.student}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={item.status === 'Pending' ? 'rem-pill-unpaid' : 'rem-pill-blue'}>
                    {item.status}
                  </span>
                  <span className={item.paymentStatus === 'Unpaid' ? 'rem-pill-unpaid' : 'rem-pill-blue'}>
                    {item.paymentStatus}
                  </span>
                  <button
                    onClick={() => setSelectedLesson(item)}
                    className="rem-btn-action ml-2"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson Details Modal */}
      <Modal
        isOpen={!!selectedLesson}
        title="Lesson Information"
        onClose={() => setSelectedLesson(null)}
      >
        {selectedLesson && (
          <div className="space-y-4">
            <div className="bg-[#f0f6fd] p-4 rounded-lg border border-[#cbe0f8]">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[#172347] text-base">{selectedLesson.lesson}</h4>
                  <p className="text-sm text-slate-600 font-medium mt-0.5">{selectedLesson.student}</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="rem-pill-blue">{selectedLesson.status}</span>
                  <span className="rem-pill-blue">{selectedLesson.paymentStatus}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Date</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedLesson.date}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Time Slot</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedLesson.time}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Tutor Assigned</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">Pedro Penduco (Coach Rem)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Lesson Fee</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">₱ 500 / hr</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLesson(null)}
                className="rem-btn-dark"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Manage Details Modal */}
      <Modal
        isOpen={isManageModalOpen}
        title="Manage Today's Overview"
        onClose={() => setIsManageModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Adjust active studio counters or configure daily overview metrics for Tutor Workspace.
          </p>

          <div className="space-y-3">
            {[
              { label: "Today's Lessons", key: 'todayLessons' },
              { label: 'Upcoming Lessons', key: 'upcomingLessons' },
              { label: 'My Students', key: 'myStudents' },
              { label: 'Pending Confirmation', key: 'pendingConfirmation' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateStats(item.key, -1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-[#172347]">
                    {overviewStats[item.key]}
                  </span>
                  <button
                    onClick={() => handleUpdateStats(item.key, 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsManageModalOpen(false)}
              className="rem-btn-dark"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
