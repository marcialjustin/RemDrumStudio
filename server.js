import express from 'express';

const app = express();
app.use(express.json());

// In-Memory Database matching RemDrumStudio Technical Design Document
let tutorProfile = {
  id: 'tutor-1',
  name: 'Pedro Penduco',
  coachName: 'Coach Rem',
  role: 'Tutor',
  email: 'pedropenduco@tutor.remdrum.com',
  avatar: 'PP'
};

let overviewStats = {
  todayLessons: 3,
  upcomingLessons: 3,
  myStudents: 3,
  pendingConfirmation: 3
};

let todaysSchedule = [
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

let upcomingLessons = [
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

// Figure 9: Weekly Compilation of Schedules
let weeklyColumns = {
  MON: [
    { id: 'mon-1', time: '2:00 PM', status: 'BOOKED' },
    { id: 'mon-2', time: '3:00 PM', status: 'BOOKED' }
  ],
  TUE: [
    { id: 'tue-1', time: '9:00 AM', status: 'AVAILABLE' }
  ],
  WED: [
    { id: 'wed-1', time: '7:00 AM', status: 'BOOKED' },
    { id: 'wed-2', time: '11:00 AM', status: 'AVAILABLE' }
  ],
  THU: [
    { id: 'thu-1', time: '7:00 AM', status: 'BOOKED' }
  ],
  FRI: [
    { id: 'fri-1', time: '2:00 PM', status: 'BOOKED' }
  ],
  SAT: [],
  SUN: [
    { id: 'sun-1', time: '11:00 AM', status: 'AVAILABLE' }
  ]
};

let weeklyLessonSlots = [
  {
    id: 'wls-1',
    date: 'October 24, 2026',
    time: '2:00 - 3:00 PM',
    tutor: 'Rem Diaz',
    lesson: 'Drum Lesson',
    status: 'Booked'
  },
  {
    id: 'wls-2',
    date: 'October 26, 2026',
    time: '2:00 - 3:00 PM',
    tutor: 'Rem Diaz',
    lesson: 'Drum Lesson',
    status: 'Booked'
  }
];

// Figure 10: Tutor's List of Students
let studentsList = [
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
    lessonsCompleted: 12
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
    lessonsCompleted: 18
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
    lessonsCompleted: 15
  }
];

// Figure 11: Tutor's Booking Lesson
let bookingsList = [
  {
    id: 'bk-1',
    date: 'October 24, 2026',
    time: '7:00 - 8:00 AM',
    student: 'Patricia Arquileta',
    lesson: 'Drum Lesson',
    paymentStatus: 'Paid',
    category: 'in-progress',
    status: 'In Progress'
  },
  {
    id: 'bk-2',
    date: 'November 25, 2026',
    time: '7:00 - 8:00 AM',
    student: 'Patricia Arquileta',
    lesson: 'Drum Lesson',
    paymentStatus: 'Unpaid',
    category: 'in-progress',
    status: 'In Progress'
  },
  {
    id: 'bk-3',
    date: 'October 24, 2026',
    time: '7:00 - 8:00 AM',
    student: 'Patricia Arquileta',
    lesson: 'Drum Lesson',
    paymentStatus: 'Paid',
    category: 'completed',
    status: 'Completed'
  },
  {
    id: 'bk-4',
    date: 'November 25, 2026',
    time: '7:00 - 8:00 AM',
    student: 'Patricia Arquileta',
    lesson: 'Drum Lesson',
    paymentStatus: 'Paid',
    category: 'completed',
    status: 'Completed'
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
    status: 'Pending Reschedule'
  }
];

// Figure 12: Payments Data
let paymentsSummary = {
  collected: 1000,
  stillUnpaid: 500,
  lessonFee: 500
};

let paymentRecords = [
  {
    id: 'pay-1',
    student: 'Patricia Arquileta',
    lesson: 'Drum Lesson',
    date: 'October 24, 2026',
    amount: 500,
    status: 'Unpaid'
  },
  {
    id: 'pay-2',
    student: 'Justin Marcial',
    lesson: 'Drum Lesson',
    date: 'October 24, 2026',
    amount: 500,
    status: 'Paid'
  },
  {
    id: 'pay-3',
    student: 'Darryl Villanueva',
    lesson: 'Drum Lesson',
    date: 'October 24, 2026',
    amount: 500,
    status: 'Paid'
  }
];

// API Endpoints

// 1. Dashboard Overview (Figure 8)
app.get('/api/dashboard', (req, res) => {
  res.json({
    tutor: tutorProfile,
    stats: overviewStats,
    todaysSchedule,
    upcomingLessons
  });
});

// 2. Schedules (Figure 9)
app.get('/api/schedules', (req, res) => {
  res.json({
    weeklyColumns,
    weeklyLessonSlots
  });
});

app.post('/api/schedules/create-slot', (req, res) => {
  const { date, start, end } = req.body;
  if (!date || !start || !end) {
    return res.status(400).json({ error: 'Please provide Date, Start, and End times.' });
  }

  // Determine weekday from date if valid date, or default to TUE / WED
  let day = 'TUE';
  try {
    const d = new Date(date);
    if (!isNaN(d.getDay())) {
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      day = days[d.getDay()];
    }
  } catch (e) {
    day = 'TUE';
  }

  const newSlot = {
    id: `slot-${Date.now()}`,
    time: start,
    status: 'AVAILABLE'
  };

  if (!weeklyColumns[day]) weeklyColumns[day] = [];
  weeklyColumns[day].push(newSlot);

  const newWeeklySlot = {
    id: `wls-${Date.now()}`,
    date: date || 'October 28, 2026',
    time: `${start} - ${end}`,
    tutor: 'Rem Diaz',
    lesson: 'Drum Lesson',
    status: 'Available'
  };
  weeklyLessonSlots.unshift(newWeeklySlot);

  res.status(201).json({
    message: 'Available slot created successfully!',
    slot: newSlot,
    weeklySlot: newWeeklySlot
  });
});

app.put('/api/schedules/:id', (req, res) => {
  const { id } = req.params;
  const { date, time, lesson, status } = req.body;
  const slot = weeklyLessonSlots.find(s => s.id === id);
  if (slot) {
    if (date) slot.date = date;
    if (time) slot.time = time;
    if (lesson) slot.lesson = lesson;
    if (status) slot.status = status;
    return res.json({ message: 'Slot updated successfully', slot });
  }
  res.status(404).json({ error: 'Slot not found' });
});

app.delete('/api/schedules/:id', (req, res) => {
  const { id } = req.params;
  weeklyLessonSlots = weeklyLessonSlots.filter(s => s.id !== id);
  res.json({ message: 'Slot deleted successfully', id });
});

// 3. Students (Figure 10)
app.get('/api/students', (req, res) => {
  const { search, filter } = req.query;
  let results = [...studentsList];

  if (search) {
    const term = search.toLowerCase();
    results = results.filter(
      st => st.name.toLowerCase().includes(term) || st.email.toLowerCase().includes(term)
    );
  }

  if (filter && filter !== 'All Students') {
    results = results.filter(st => st.status.toLowerCase() === filter.toLowerCase());
  }

  res.json(results);
});

// 4. Bookings (Figure 11)
app.get('/api/bookings', (req, res) => {
  const { filter } = req.query;
  if (!filter || filter === 'all') {
    return res.json(bookingsList);
  }
  const filtered = bookingsList.filter(b => b.category === filter);
  res.json(filtered);
});

app.post('/api/bookings/:id/complete', (req, res) => {
  const { id } = req.params;
  const booking = bookingsList.find(b => b.id === id);
  if (booking) {
    booking.category = 'completed';
    booking.status = 'Completed';
    return res.json({ message: 'Booking marked as completed!', booking });
  }
  res.status(404).json({ error: 'Booking not found' });
});

app.post('/api/bookings/:id/reschedule-accept', (req, res) => {
  const { id } = req.params;
  const booking = bookingsList.find(b => b.id === id);
  if (booking) {
    booking.category = 'in-progress';
    booking.status = 'Rescheduled Confirmed';
    if (booking.wants) {
      booking.date = 'November 02, 2026';
      booking.time = '10:00 - 11:00 PM';
    }
    return res.json({ message: 'Reschedule request accepted!', booking });
  }
  res.status(404).json({ error: 'Booking not found' });
});

app.post('/api/bookings/:id/reschedule-suggest', (req, res) => {
  const { id } = req.params;
  const { suggestedTime } = req.body;
  const booking = bookingsList.find(b => b.id === id);
  if (booking) {
    booking.wants = suggestedTime || 'Nov 3, 2:00 - 3:00 PM (Tutor Counter-Offer)';
    return res.json({ message: 'Suggested another time to the student!', booking });
  }
  res.status(404).json({ error: 'Booking not found' });
});

// 5. Payments (Figure 12)
app.get('/api/payments', (req, res) => {
  res.json({
    summary: paymentsSummary,
    records: paymentRecords
  });
});

app.post('/api/payments/:id/mark-paid', (req, res) => {
  const { id } = req.params;
  const payment = paymentRecords.find(p => p.id === id);
  if (payment) {
    if (payment.status === 'Paid') {
      return res.status(400).json({ error: 'Session is already paid.' });
    }
    payment.status = 'Paid';
    paymentsSummary.collected += payment.amount;
    paymentsSummary.stillUnpaid = Math.max(0, paymentsSummary.stillUnpaid - payment.amount);
    return res.json({ message: 'Payment recorded as paid successfully!', payment });
  }
  res.status(404).json({ error: 'Payment record not found' });
});

// Default root status
app.get('/api/status', (req, res) => {
  res.json({ status: 'RemDrumStudio backend running smoothly' });
});

export default app;
