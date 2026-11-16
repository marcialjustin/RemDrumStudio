// Request validation
const EMAIL = /^\S+@\S+\.\S+$/;
const text = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
const bad = (res, message) => res.status(400).json({ success: false, message });

exports.validateContact = (req, res, next) => {
  const { name, email, message } = req.body || {};
  if (!text(name, 100) || !EMAIL.test(String(email || '').trim()) || !text(message, 2000)) {
    return bad(res, 'Please provide a valid name, email, and message.');
  }
  next();
};

// Only students and parents can sign up publicly. Coaches/admins are created by the admin.
exports.validateSignup = (req, res, next) => {
  const { role, firstName, lastName, email, password } = req.body || {};
  if (!['student', 'parent'].includes(role)) return bad(res, 'Please choose Student or Parent.');
  if (!text(firstName, 50) || !text(lastName, 50)) return bad(res, 'Please enter your first and last name.');
  if (!EMAIL.test(String(email || '').trim()) || String(email).length > 150) return bad(res, 'Please enter a valid email.');
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) return bad(res, 'Password must be 8 to 72 characters.');
  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
    return bad(res, 'Please enter your email and password.');
  }
  next();
};

const INSTRUMENTS = ['Drums', 'Piano', 'Voice', 'Guitar', 'Bass'];

exports.validateCoach = (req, res, next) => {
  const { fullName, email, instruments, inBand } = req.body || {};
  if (!text(fullName, 100)) return bad(res, 'Please enter the coach’s full name.');
  if (!EMAIL.test(String(email || '').trim()) || String(email).length > 150) return bad(res, 'Please enter a valid email.');
  if (!Array.isArray(instruments) || !instruments.length || !instruments.every(i => INSTRUMENTS.includes(i))) {
    return bad(res, 'Choose at least one instrument.');
  }
  req.body.instruments = [...new Set(instruments)];
  req.body.inBand = inBand !== false;
  next();
};

exports.validateCoachUpdate = (req, res, next) => {
  const { inBand, isActive } = req.body || {};
  const ok = v => v === undefined || typeof v === 'boolean';
  if (!ok(inBand) || !ok(isActive) || (inBand === undefined && isActive === undefined)) return bad(res, 'Nothing valid to update.');
  next();
};

exports.validateNewPassword = (req, res, next) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) return bad(res, 'Password must be 8 to 72 characters.');
  next();
};

// ----- Band bookings -----
const validDate = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(`${d}T12:00:00`));
const validStart = t => typeof t === 'string' && /^\d{2}:00$/.test(t) && Number(t.slice(0, 2)) >= 9 && Number(t.slice(0, 2)) <= 16;

exports.validateBandBooking = (req, res, next) => {
  const { requestedBy, forName, date, start, note } = req.body || {};
  if (!Number.isInteger(requestedBy)) return bad(res, 'Choose who is requesting.');
  if (!text(forName, 100)) return bad(res, 'Enter who the lesson is for.');
  if (!validDate(date)) return bad(res, 'Choose a valid date.');
  if (!validStart(start)) return bad(res, 'Choose a start time between 09:00 and 16:00.');
  if (note !== undefined && note !== null && (typeof note !== 'string' || note.length > 500)) return bad(res, 'The note is too long (500 characters at most).');
  req.body.approve = req.body.approve === true;
  next();
};

exports.validateAvailabilityQuery = (req, res, next) => {
  if (!validDate(req.query.date) || !validStart(req.query.start)) return bad(res, 'Choose a valid date and start time.');
  next();
};

exports.validateReason = (req, res, next) => {
  const { reason } = req.body || {};
  if (reason !== undefined && reason !== null && (typeof reason !== 'string' || reason.length > 500)) return bad(res, 'The reason is too long (500 characters at most).');
  next();
};

exports.validateSlot = (req, res, next) => {
  if (!validStart((req.body || {}).start)) return bad(res, 'Choose a start time between 09:00 and 16:00.');
  next();
};