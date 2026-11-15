const db = require('../../config/db');

const SELECT = `SELECT b.id, b.requested_by, TRIM(CONCAT(u.first_name, ' ', u.last_name)) AS requester, u.role AS requester_role,
  b.for_name, DATE_FORMAT(b.starts_at, '%Y-%m-%d') AS date, DATE_FORMAT(b.starts_at, '%H:%i') AS start_time,
  DATE_FORMAT(b.ends_at, '%H:%i') AS end_time, b.status, b.note, b.decline_reason, b.suggestion,
  DATE_FORMAT(b.decided_at, '%Y-%m-%d') AS decided_on, (b.ends_at < NOW()) AS past
  FROM band_bookings b JOIN users u ON u.id = b.requested_by`;

exports.list = async (statuses, order = 'ASC') => {
  const marks = statuses.map(() => '?').join(',');
  const dir = order === 'DESC' ? 'DESC' : 'ASC';
  return (await db.execute(`${SELECT} WHERE b.status IN (${marks}) ORDER BY b.starts_at ${dir}`, statuses))[0];
};

exports.findById = async id => (await db.execute(`${SELECT} WHERE b.id = ? LIMIT 1`, [id]))[0][0] || null;

exports.counts = async () => {
  const [rows] = await db.execute('SELECT status, COUNT(*) AS total FROM band_bookings GROUP BY status');
  return Object.fromEntries(rows.map(r => [r.status, Number(r.total)]));
};

exports.create = async ({ requestedBy, forName, startsAt, endsAt, note, status }) => {
  const [r] = await db.execute(
    'INSERT INTO band_bookings (requested_by, for_name, starts_at, ends_at, note, status, decided_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [requestedBy, forName, startsAt, endsAt, note || null, status, status === 'approved' ? new Date() : null]
  );
  return r.insertId;
};

exports.setStatus = async (id, status, declineReason = null) => {
  const decided = status === 'pending' ? null : new Date();
  await db.execute('UPDATE band_bookings SET status = ?, decline_reason = ?, decided_at = ? WHERE id = ?', [status, declineReason, decided, id]);
};

exports.setSuggestion = async (id, text) => {
  await db.execute('UPDATE band_bookings SET suggestion = ? WHERE id = ?', [text, id]);
};

// Approved bookings that overlap a time range (they block the whole band)
exports.findOverlapping = async (startsAt, endsAt, excludeId = 0) =>
  (await db.execute("SELECT id FROM band_bookings WHERE status = 'approved' AND starts_at < ? AND ends_at > ? AND id <> ?", [endsAt, startsAt, excludeId]))[0];

// Hours already taken by approved bookings on a date, e.g. [14, 15]
exports.takenHours = async (date, excludeId = 0) =>
  (await db.execute("SELECT HOUR(starts_at) AS h FROM band_bookings WHERE status = 'approved' AND DATE(starts_at) = ? AND id <> ?", [date, excludeId]))[0].map(r => Number(r.h));

exports.approvedThisMonth = async () => {
  const [rows] = await db.execute("SELECT COUNT(*) AS total FROM band_bookings WHERE status = 'approved' AND YEAR(starts_at) = YEAR(NOW()) AND MONTH(starts_at) = MONTH(NOW())");
  return Number(rows[0].total);
};