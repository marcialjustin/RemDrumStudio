import React, { useState, useMemo } from 'react';
import { Bell, Search, ChevronDown, Mail, Phone, Calendar, UserCheck } from 'lucide-react';
import Modal from './Modal.jsx';

export default function MyStudents({ data, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All Students');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const initialStudents = data?.students || [
    {
      id: 'st-1',
      initials: 'JM',
      name: 'Justin Marcial',
      email: 'justinmarcial@gmail.com',
      nextLessonDate: 'November 01, 2026',
      nextLessonTime: '2:00 - 3:00 PM',
      status: 'Active',
      paymentStatus: 'Unpaid',
      phone: '+63 912 345 6789',
      guardian: 'Maria Marcial',
      instrument: 'Drum Kit (Rock & Jazz Fundamentals)',
      progress: 'Grade 2 - Groove & Rudiments',
      attendedSessions: 14,
    },
    {
      id: 'st-2',
      initials: 'PA',
      name: 'Patricia Arquileta',
      email: 'patriciaarquileta@gmail.com',
      nextLessonDate: 'October 24, 2026',
      nextLessonTime: '2:00 - 3:00 PM',
      status: 'Completed',
      paymentStatus: 'Paid',
      phone: '+63 923 456 7890',
      guardian: 'Ronald Arquileta',
      instrument: 'Drum Kit (Advanced Snare & Fills)',
      progress: 'Grade 4 - Fast Syncopation',
      attendedSessions: 22,
    },
    {
      id: 'st-3',
      initials: 'DV',
      name: 'Darryl Villanueva',
      email: 'darrylvillanueva@gmail.com',
      nextLessonDate: 'October 01, 2026',
      nextLessonTime: '2:00 - 3:00 PM',
      status: 'Completed',
      paymentStatus: 'Paid',
      phone: '+63 934 567 8901',
      guardian: 'Elena Villanueva',
      instrument: 'Drum Kit (Double Bass & Timing)',
      progress: 'Grade 3 - Double Kick Technique',
      attendedSessions: 19,
    },
  ];

  const filteredStudents = useMemo(() => {
    return initialStudents.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter =
        filterRole === 'All Students' ||
        student.status.toLowerCase() === filterRole.toLowerCase();
      return matchSearch && matchFilter;
    });
  }, [searchTerm, filterRole, initialStudents]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header bar */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#172347] tracking-tight">
            My Students
          </h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Only students assigned to your lessons are shown.
          </p>
        </div>
        <button 
          className="relative p-2 text-slate-500 hover:text-slate-800 transition"
          title="Notifications"
          onClick={() => alert('Student Alert: 3 students actively enrolled in Coach Rem drum programs.')}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>

      {/* Filter and Search Bar matching Figure 10 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input with Search Icon */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full bg-white border border-[#cbdbe9] rounded-lg pl-3 pr-8 py-2 text-xs text-[#172347] placeholder-slate-400 focus:outline-hidden focus:border-[#273468]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Dropdown Select matching Figure 10 */}
        <div className="relative w-full sm:w-auto">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            aria-label="Filter students by status"
            className="appearance-none bg-white border border-[#cbdbe9] rounded-lg pl-4 pr-10 py-2 text-xs font-medium text-[#334155] focus:outline-hidden focus:border-[#273468] cursor-pointer w-full sm:w-44"
          >
            <option value="All Students">All Students</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Student List Table Box matching Figure 10 */}
      <div className="bg-white border border-[#d2e3f5] rounded-xl overflow-hidden shadow-xs">
        {/* Blue Header Row matching Figure 10 */}
        <div className="students-table-header px-6 py-3.5 grid grid-cols-12 items-center">
          <div className="col-span-5">STUDENT</div>
          <div className="col-span-4">NEXT LESSON</div>
          <div className="col-span-3 text-left">STATUS</div>
        </div>

        {/* Students Table Rows */}
        <div className="divide-y divide-slate-100">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((st) => (
              <div
                key={st.id}
                className="px-6 py-4 grid grid-cols-12 items-center hover:bg-[#f8fbfe] transition"
              >
                {/* Student Avatar and Info */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e2d5c] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {st.initials}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-[#172347] leading-tight truncate">
                      {st.name}
                    </p>
                    <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">
                      {st.email}
                    </p>
                  </div>
                </div>

                {/* Next Lesson Schedule */}
                <div className="col-span-4">
                  <p className="text-xs font-bold text-[#172347] leading-tight">
                    {st.nextLessonDate}
                  </p>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">
                    {st.nextLessonTime}
                  </p>
                </div>

                {/* Status Badges & View Students Button */}
                <div className="col-span-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="rem-pill-blue">{st.status}</span>
                    <span className={st.paymentStatus === 'Unpaid' ? 'rem-pill-unpaid' : 'rem-pill-blue'}>
                      {st.paymentStatus}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(st)}
                    className="rem-btn-action shrink-0"
                  >
                    View Students
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No students found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Student Profile Detail Modal */}
      <Modal
        isOpen={!!selectedStudent}
        title="Student Details & Lesson Record"
        onClose={() => setSelectedStudent(null)}
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-[#f0f6fd] p-4 rounded-xl border border-[#cbe0f8]">
              <div className="w-12 h-12 rounded-full bg-[#1e2d5c] text-white font-bold text-sm flex items-center justify-center shadow-md">
                {selectedStudent.initials}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#172347] text-base">{selectedStudent.name}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedStudent.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {selectedStudent.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Guardian Contact</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedStudent.guardian || 'Parent/Guardian'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Total Attended</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedStudent.attendedSessions} Sessions</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Current Program</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedStudent.instrument}</span>
                <p className="text-xs text-slate-500 mt-1">{selectedStudent.progress}</p>
              </div>
            </div>

            <div className="p-3 bg-[#eef5fc] rounded-lg border border-[#d2e3f5] flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-semibold uppercase">Upcoming Scheduled Session</span>
                <span className="font-bold text-[#172347]">{selectedStudent.nextLessonDate} at {selectedStudent.nextLessonTime}</span>
              </div>
              <div className="flex gap-1.5">
                <span className="rem-pill-blue">{selectedStudent.status}</span>
                <span className={selectedStudent.paymentStatus === 'Unpaid' ? 'rem-pill-unpaid' : 'rem-pill-blue'}>
                  {selectedStudent.paymentStatus}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="rem-btn-dark"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
