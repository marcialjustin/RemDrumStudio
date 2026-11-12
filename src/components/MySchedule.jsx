import React, { useState } from 'react';
import { Bell, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import Modal from './Modal.jsx';

export default function MySchedule({ data, onRefresh }) {
  const [dateInput, setDateInput] = useState('2026-10-28');
  const [startInput, setStartInput] = useState('9:00 AM');
  const [endInput, setEndInput] = useState('10:00 AM');
  const [editingSlot, setEditingSlot] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');

  // Weekly columns matching Figure 9
  const [weeklyColumns, setWeeklyColumns] = useState(
    data?.weeklyColumns || {
      MON: [
        { id: 'mon-1', time: '2:00 PM', status: 'BOOKED' },
        { id: 'mon-2', time: '3:00 PM', status: 'BOOKED' },
      ],
      TUE: [
        { id: 'tue-1', time: '9:00 AM', status: 'AVAILABLE' },
      ],
      WED: [
        { id: 'wed-1', time: '7:00 AM', status: 'BOOKED' },
        { id: 'wed-2', time: '11:00 AM', status: 'AVAILABLE' },
      ],
      THU: [
        { id: 'thu-1', time: '7:00 AM', status: 'BOOKED' },
      ],
      FRI: [
        { id: 'fri-1', time: '2:00 PM', status: 'BOOKED' },
      ],
      SAT: [],
      SUN: [
        { id: 'sun-1', time: '11:00 AM', status: 'AVAILABLE' },
      ],
    }
  );

  const [weeklyLessonSlots, setWeeklyLessonSlots] = useState(
    data?.weeklyLessonSlots || [
      {
        id: 'wls-1',
        date: 'October 24, 2026',
        time: '2:00 - 3:00 PM',
        tutor: 'Rem Diaz',
        lesson: 'Drum Lesson',
        status: 'Booked',
      },
      {
        id: 'wls-2',
        date: 'October 26, 2026',
        time: '2:00 - 3:00 PM',
        tutor: 'Rem Diaz',
        lesson: 'Drum Lesson',
        status: 'Booked',
      },
    ]
  );

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!dateInput || !startInput || !endInput) {
      setAlertMsg('Please specify date, start time, and end time.');
      return;
    }

    // Call backend API
    try {
      const response = await fetch('/api/schedules/create-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateInput, start: startInput, end: endInput }),
      });
      if (response.ok) {
        const resData = await response.json();
        // Add to weekly view
        let dayName = 'TUE';
        try {
          const d = new Date(dateInput);
          const daysMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          dayName = daysMap[d.getDay()] || 'TUE';
        } catch (err) {}

        setWeeklyColumns(prev => ({
          ...prev,
          [dayName]: [...(prev[dayName] || []), { id: `slot-${Date.now()}`, time: startInput, status: 'AVAILABLE' }]
        }));

        setWeeklyLessonSlots(prev => [
          {
            id: `wls-${Date.now()}`,
            date: dateInput,
            time: `${startInput} - ${endInput}`,
            tutor: 'Rem Diaz',
            lesson: 'Drum Lesson',
            status: 'Available',
          },
          ...prev,
        ]);

        setAlertMsg('New available slot added to your teaching schedule!');
        setTimeout(() => setAlertMsg(''), 4000);
      }
    } catch (err) {
      // Fallback local update
      setWeeklyColumns(prev => ({
        ...prev,
        TUE: [...(prev.TUE || []), { id: `slot-${Date.now()}`, time: startInput, status: 'AVAILABLE' }]
      }));
      setAlertMsg('Slot created locally!');
      setTimeout(() => setAlertMsg(''), 3000);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setWeeklyLessonSlots(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveEdit = () => {
    if (!editingSlot) return;
    setWeeklyLessonSlots(prev =>
      prev.map(s => (s.id === editingSlot.id ? editingSlot : s))
    );
    setEditingSlot(null);
    setAlertMsg('Schedule slot updated!');
    setTimeout(() => setAlertMsg(''), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header bar */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#172347] tracking-tight">
            My Schedule
          </h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Manage your booked lessons and available teaching time.
          </p>
        </div>
        <button 
          className="relative p-2 text-slate-500 hover:text-slate-800 transition"
          title="Notifications"
          onClick={() => alert('Schedule Alert: All Monday and Thursday 7:00 AM slots are fully booked.')}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>

      {alertMsg && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs font-medium animate-in fade-in">
          {alertMsg}
        </div>
      )}

      {/* Top Creation Form matching Figure 9 */}
      <div className="bg-white border border-[#dce6f2] rounded-xl p-4 shadow-xs">
        <form onSubmit={handleCreateSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-bold text-[#5a6c85] uppercase tracking-wider mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                placeholder="YYYY-MM-DD or October 28, 2026"
                className="w-full bg-[#f8fbfe] border border-[#cbdbe9] rounded-lg px-3 py-2 text-xs text-[#172347] focus:outline-hidden focus:border-[#273468] pr-8"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5a6c85] uppercase tracking-wider mb-1">
              Start
            </label>
            <div className="relative">
              <input
                type="text"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                placeholder="2:00 PM"
                className="w-full bg-[#f8fbfe] border border-[#cbdbe9] rounded-lg px-3 py-2 text-xs text-[#172347] focus:outline-hidden focus:border-[#273468] pr-8"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5a6c85] uppercase tracking-wider mb-1">
              End
            </label>
            <div className="relative">
              <input
                type="text"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                placeholder="3:00 PM"
                className="w-full bg-[#f8fbfe] border border-[#cbdbe9] rounded-lg px-3 py-2 text-xs text-[#172347] focus:outline-hidden focus:border-[#273468] pr-8"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full rem-btn-dark py-2 text-xs font-semibold tracking-wide"
            >
              Create Available Slot
            </button>
          </div>
        </form>
      </div>

      {/* Weekly Schedule View Box matching Figure 9 */}
      <div className="bg-[#eff5fc] border border-[#d2e3f5] rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex flex-col">
              {/* Day Column Header */}
              <div className="bg-[#dbe8fa] py-2 text-center rounded-t-lg border-b border-[#c8dbf2]">
                <span className="text-xs font-bold text-[#1f2d57] tracking-wider">
                  {day}
                </span>
              </div>

              {/* Day Column Body */}
              <div className="bg-[#e4effb] rounded-b-lg p-2 min-h-[190px] flex flex-col gap-2">
                {weeklyColumns[day] && weeklyColumns[day].length > 0 ? (
                  weeklyColumns[day].map((slot) => {
                    const isBooked = slot.status === 'BOOKED';
                    return (
                      <div
                        key={slot.id}
                        className={isBooked ? 'slot-tile-booked' : 'slot-tile-available'}
                      >
                        <p className="text-xs font-bold leading-tight">{slot.time}</p>
                        <p className="text-[10px] font-bold tracking-tight uppercase mt-0.5">
                          {slot.status}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center py-12">
                    <span className="text-xs text-[#7c8ca3] italic">
                      Unavailable
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Lesson Slot Section matching Figure 9 */}
      <div className="bg-white border border-[#dce6f2] rounded-xl p-5 md:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#172347]">
            Weekly Lesson Slot
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {weeklyLessonSlots.map((item) => (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8fbfe] rounded-lg px-2 -mx-2 transition"
            >
              <div className="w-48 shrink-0">
                <p className="text-xs font-bold text-[#172347]">{item.date}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-[#172347]">{item.tutor}</p>
                <p className="text-xs text-slate-500">{item.lesson}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rem-pill-blue">{item.status}</span>
                <button
                  onClick={() => setEditingSlot({ ...item })}
                  className="rem-btn-action ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSlot(item.id)}
                  className="rem-btn-action text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Slot Modal */}
      <Modal
        isOpen={!!editingSlot}
        title="Edit Weekly Lesson Slot"
        onClose={() => setEditingSlot(null)}
      >
        {editingSlot && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
              <input
                type="text"
                value={editingSlot.date}
                onChange={(e) => setEditingSlot({ ...editingSlot, date: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Time Range</label>
              <input
                type="text"
                value={editingSlot.time}
                onChange={(e) => setEditingSlot({ ...editingSlot, time: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
              <select
                value={editingSlot.status}
                onChange={(e) => setEditingSlot({ ...editingSlot, status: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value="Booked">Booked</option>
                <option value="Available">Available</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditingSlot(null)}
                className="rem-btn-action"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="rem-btn-dark"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
