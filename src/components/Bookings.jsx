import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';
import Modal from './Modal.jsx';

export default function Bookings({ data, onRefresh }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [suggestTimeInput, setSuggestTimeInput] = useState('Nov 3, 2:00 - 3:00 PM');
  const [notificationMsg, setNotificationMsg] = useState('');

  const [bookings, setBookings] = useState(
    data?.bookings || [
      {
        id: 'bk-1',
        date: 'October 24, 2026',
        time: '7:00 - 8:00 AM',
        student: 'Patricia Arquileta',
        lesson: 'Drum Lesson',
        paymentStatus: 'Paid',
        category: 'in-progress',
        status: 'In Progress',
      },
      {
        id: 'bk-2',
        date: 'November 25, 2026',
        time: '7:00 - 8:00 AM',
        student: 'Patricia Arquileta',
        lesson: 'Drum Lesson',
        paymentStatus: 'Unpaid',
        category: 'in-progress',
        status: 'In Progress',
      },
      {
        id: 'bk-3',
        date: 'October 24, 2026',
        time: '7:00 - 8:00 AM',
        student: 'Patricia Arquileta',
        lesson: 'Drum Lesson',
        paymentStatus: 'Paid',
        category: 'completed',
        status: 'Completed',
      },
      {
        id: 'bk-4',
        date: 'November 25, 2026',
        time: '7:00 - 8:00 AM',
        student: 'Patricia Arquileta',
        lesson: 'Drum Lesson',
        paymentStatus: 'Paid',
        category: 'completed',
        status: 'Completed',
      },
      {
        id: 'bk-5',
        date: 'October 24, 2026',
        time: '7:00 - 8:00 AM',
        student: 'Patricia Arquileta',
        lesson: 'Drum Lesson',
        wants: 'Nov 2, 10:00 - 11:00 PM',
        paymentStatus: 'Paid',
        category: 'rescheduled',
        status: 'Pending Reschedule',
      },
    ]
  );

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'rescheduled', label: 'Rescheduled' },
  ];

  // Categorized bookings
  const inProgressList = bookings.filter((b) => b.category === 'in-progress');
  const completedList = bookings.filter((b) => b.category === 'completed');
  const rescheduledList = bookings.filter((b) => b.category === 'rescheduled');

  // Handle Mark as Completed
  const handleMarkCompleted = async (id) => {
    try {
      await fetch(`/api/bookings/${id}/complete`, { method: 'POST' });
    } catch (e) {}

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, category: 'completed', status: 'Completed' } : b))
    );
    setNotificationMsg('Session marked as completed!');
    setTimeout(() => setNotificationMsg(''), 3500);
  };

  // Handle Accept Reschedule
  const handleAcceptReschedule = async (id) => {
    try {
      await fetch(`/api/bookings/${id}/reschedule-accept`, { method: 'POST' });
    } catch (e) {}

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            date: 'November 02, 2026',
            time: '10:00 - 11:00 PM',
            category: 'in-progress',
            status: 'Reschedule Confirmed',
            wants: null,
          };
        }
        return b;
      })
    );
    setNotificationMsg('Reschedule request accepted! Session updated to Nov 2, 10:00 - 11:00 PM.');
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  // Handle Suggest Another Time
  const handleSuggestSubmit = async () => {
    if (!rescheduleModal) return;
    try {
      await fetch(`/api/bookings/${rescheduleModal.id}/reschedule-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestedTime: suggestTimeInput }),
      });
    } catch (e) {}

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === rescheduleModal.id) {
          return {
            ...b,
            wants: `${suggestTimeInput} (Offer sent to student)`,
          };
        }
        return b;
      })
    );
    setRescheduleModal(null);
    setNotificationMsg(`Proposed counter-schedule (${suggestTimeInput}) sent to student!`);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header bar */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#172347] tracking-tight">
            Bookings
          </h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Every lessons that students book with you, grouped by what you need to do.
          </p>
        </div>
        <button 
          className="relative p-2 text-slate-500 hover:text-slate-800 transition"
          title="Notifications"
          onClick={() => alert('Bookings Alert: You have 1 rescheduling request pending decision.')}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>

      {notificationMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {notificationMsg}
        </div>
      )}

      {/* Filter Tabs matching Figure 11 */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={isActive ? 'booking-tab booking-tab-active' : 'booking-tab booking-tab-inactive'}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bookings Card Container matching Figure 11 */}
      <div className="bg-white border border-[#dce6f2] rounded-xl p-5 md:p-6 shadow-xs space-y-6">
        {/* SECTION: IN PROGRESS */}
        {(activeTab === 'all' || activeTab === 'in-progress') && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              In Progress
            </h3>

            <div className="space-y-2">
              {inProgressList.length > 0 ? (
                inProgressList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#fbfdff] border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#b8cff7] transition"
                  >
                    <div className="w-48 shrink-0">
                      <p className="text-xs font-bold text-[#172347]">{item.date}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#172347]">{item.student}</p>
                      <p className="text-xs text-slate-500">{item.lesson}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={item.paymentStatus === 'Unpaid' ? 'rem-pill-unpaid' : 'rem-pill-blue'}>
                        {item.paymentStatus}
                      </span>
                      {item.id === 'bk-1' ? (
                        <button
                          onClick={() => handleMarkCompleted(item.id)}
                          className="rem-btn-action"
                        >
                          Mark as Completed
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedBooking(item)}
                          className="rem-btn-action"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No in-progress lessons.</p>
              )}
            </div>
          </div>
        )}

        {/* SECTION: COMPLETED */}
        {(activeTab === 'all' || activeTab === 'completed') && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              Completed
            </h3>

            <div className="space-y-2">
              {completedList.length > 0 ? (
                completedList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#fbfdff] border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#b8cff7] transition"
                  >
                    <div className="w-48 shrink-0">
                      <p className="text-xs font-bold text-[#172347]">{item.date}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#172347]">{item.student}</p>
                      <p className="text-xs text-slate-500">{item.lesson}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rem-pill-blue">{item.paymentStatus}</span>
                      <button
                        onClick={() => setSelectedBooking(item)}
                        className="rem-btn-action"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No completed lessons yet.</p>
              )}
            </div>
          </div>
        )}

        {/* SECTION: RESCHEDULED REQUESTS */}
        {(activeTab === 'all' || activeTab === 'rescheduled') && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              Rescheduled Requests
            </h3>

            <div className="space-y-2">
              {rescheduledList.length > 0 ? (
                rescheduledList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#fbfdff] border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#b8cff7] transition"
                  >
                    <div className="w-48 shrink-0">
                      <p className="text-xs font-bold text-[#172347]">{item.date}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#172347]">{item.student}</p>
                      <p className="text-xs text-slate-500">{item.lesson}</p>
                      {item.wants && (
                        <div className="mt-1">
                          <span className="text-xs font-medium text-slate-600 mr-1.5">Wants:</span>
                          <span className="text-xs font-bold text-[#dc2626]">
                            {item.wants}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rem-pill-blue">{item.paymentStatus}</span>
                      <button
                        onClick={() => setRescheduleModal(item)}
                        className="rem-btn-action"
                      >
                        Suggest another time
                      </button>
                      <button
                        onClick={() => handleAcceptReschedule(item.id)}
                        className="rem-btn-action bg-[#f8fafc] font-semibold text-[#172347]"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No active reschedule requests.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking View Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        title="Booking Overview"
        onClose={() => setSelectedBooking(null)}
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="bg-[#f0f6fd] p-4 rounded-lg border border-[#cbe0f8]">
              <h4 className="font-bold text-[#172347] text-base">{selectedBooking.lesson}</h4>
              <p className="text-sm text-slate-600 font-medium">{selectedBooking.student}</p>
              <div className="mt-2 flex gap-1.5">
                <span className="rem-pill-blue">{selectedBooking.status}</span>
                <span className="rem-pill-blue">{selectedBooking.paymentStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Session Date</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedBooking.date}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Time</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedBooking.time}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Payment Status</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedBooking.paymentStatus}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Studio Fee</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">₱ 500</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rem-btn-dark"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Suggest Another Time Modal */}
      <Modal
        isOpen={!!rescheduleModal}
        title="Suggest Another Lesson Slot"
        onClose={() => setRescheduleModal(null)}
      >
        {rescheduleModal && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Student <strong className="text-slate-800">{rescheduleModal.student}</strong> requested to move their session to 
              <span className="font-semibold text-red-600 ml-1">{rescheduleModal.wants}</span>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Proposed Replacement Time
              </label>
              <input
                type="text"
                value={suggestTimeInput}
                onChange={(e) => setSuggestTimeInput(e.target.value)}
                placeholder="e.g. Nov 3, 2:00 - 3:00 PM"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#273468]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                The student will be prompted to confirm this slot in their Student Dashboard.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setRescheduleModal(null)}
                className="rem-btn-action"
              >
                Cancel
              </button>
              <button
                onClick={handleSuggestSubmit}
                className="rem-btn-dark"
              >
                Send Proposal to Student
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
