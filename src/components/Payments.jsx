import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export default function Payments({ data, onRefresh }) {
  const [summary, setSummary] = useState(
    data?.summary || {
      collected: 1000,
      stillUnpaid: 500,
      lessonFee: 500,
    }
  );

  const [records, setRecords] = useState(
    data?.records || [
      {
        id: 'pay-1',
        student: 'Patricia Arquileta',
        lesson: 'Drum Lesson',
        date: 'October 24, 2026',
        amount: 500,
        status: 'Unpaid',
      },
      {
        id: 'pay-2',
        student: 'Justin Marcial',
        lesson: 'Drum Lesson',
        date: 'October 24, 2026',
        amount: 500,
        status: 'Paid',
      },
      {
        id: 'pay-3',
        student: 'Darryl Villanueva',
        lesson: 'Drum Lesson',
        date: 'October 24, 2026',
        amount: 500,
        status: 'Paid',
      },
    ]
  );

  const [confirmingId, setConfirmingId] = useState(null);

  const handleMarkAsPaid = async (id) => {
    try {
      await fetch(`/api/payments/${id}/mark-paid`, { method: 'POST' });
    } catch (e) {}

    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Paid' } : r))
    );
    setSummary((prev) => ({
      ...prev,
      collected: prev.collected + 500,
      stillUnpaid: Math.max(0, prev.stillUnpaid - 500),
    }));
    setConfirmingId(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header bar */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#172347] tracking-tight">
            Payments
          </h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            View lesson payments records and status. Payment changes are managed by studio administration.
          </p>
        </div>
        <button 
          className="relative p-2 text-slate-500 hover:text-slate-800 transition"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>

      {/* 3 Metric Cards matching Figure 12 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#deecfc] border border-[#cbe0f8] rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-[#5a6c85] uppercase tracking-wider">
            Collected
          </p>
          <p className="text-2xl font-bold text-[#172347] mt-1.5">
            ₱ {summary.collected}
          </p>
        </div>

        <div className="bg-[#deecfc] border border-[#cbe0f8] rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-[#5a6c85] uppercase tracking-wider">
            Still Unpaid
          </p>
          <p className="text-2xl font-bold text-[#172347] mt-1.5">
            ₱ {summary.stillUnpaid}
          </p>
        </div>

        <div className="bg-[#deecfc] border border-[#cbe0f8] rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-[#5a6c85] uppercase tracking-wider">
            Lesson Fee
          </p>
          <p className="text-2xl font-bold text-[#172347] mt-1.5">
            ₱ {summary.lessonFee}
          </p>
        </div>
      </div>

      {/* Payment Records Table matching Figure 12 */}
      <div className="bg-white border border-[#d2e3f5] rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-12 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          <div className="col-span-4">STUDENT</div>
          <div className="col-span-4">LESSON</div>
          <div className="col-span-2">AMOUNT</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>

        <div className="divide-y divide-slate-100">
          {records.map((rec) => (
            <React.Fragment key={rec.id}>
              <div className="px-6 py-4 grid grid-cols-12 items-center hover:bg-[#f8fbfe] transition">
                <div className="col-span-4 font-bold text-xs text-[#172347]">
                  {rec.student}
                </div>
                <div className="col-span-4">
                  <p className="text-xs font-bold text-[#172347]">{rec.lesson}</p>
                  <p className="text-[11px] text-slate-500">{rec.date}</p>
                </div>
                <div className="col-span-2 text-xs font-bold text-slate-800">
                  ₱ {rec.amount}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className={rec.status === 'Paid' ? 'rem-pill-green' : 'rem-pill-unpaid'}>
                    {rec.status}
                  </span>
                  {rec.status === 'Unpaid' && !confirmingId && (
                    <button
                      onClick={() => setConfirmingId(rec.id)}
                      className="rem-btn-action ml-1 shrink-0"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>

              {/* Confirmation bar matching Figure 12 */}
              {confirmingId === rec.id && (
                <div className="bg-[#f0f6fd] border-y border-[#cbe0f8] px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                  <div className="text-xs text-[#172347]">
                    <span className="font-semibold">Received ₱500 cash from {rec.student}?</span>
                    <span className="text-slate-500 ml-1.5">The student will be notified.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="rem-btn-action text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleMarkAsPaid(rec.id)}
                      className="rem-btn-action bg-[#273468] text-white hover:bg-[#1c2752] text-xs font-medium"
                    >
                      Yes, Mark as Paid
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
