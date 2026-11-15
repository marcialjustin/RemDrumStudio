// Business logic for band bookings.
// A band booking needs ALL band members (active coaches with the Band switch on) to be free.
// Today "free" means: no other approved band booking at that time. When the lessons/schedules page exists,
// add each member's lessons inside members() below and everything else keeps working.
const userModel = require('../../models/shared/userModel');
const coachModel = require('../../models/admin/coachModel');
const bandModel = require('../../models/admin/bandBookingModel');

const FIRST_HOUR = 9;      // studio opens
const LAST_START = 16;     // last lesson starts at 16:00 (ends 17:00)
const httpError = (status, message) => Object.assign(new Error(message), { status });
const pad = n => String(n).padStart(2, '0');
const hourOf = start => Number(start.slice(0, 2));
const range = (date, start) => ({ startsAt: `${date} ${start}:00`, endsAt: `${date} ${pad(hourOf(start) + 1)}:00:00` });
const nice = (date, start) => {
  const d = new Date(`${date}T12:00:00`).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${d} · ${start}–${pad(hourOf(start) + 1)}:00`;
};

const shape = (r, availability) => ({
  id: r.id, requester: r.requester, requesterRole: r.requester_role, forName: r.for_name,
  date: r.date, start: r.start_time, end: r.end_time, status: r.status, note: r.note,
  declineReason: r.decline_reason, suggestion: r.suggestion, decidedOn: r.decided_on,
  completed: r.status === 'approved' && !!r.past, ...(availability ? { availability } : {})
});

async function freeSlots(date, excludeId = 0, skipStart = null) {
  const taken = await bandModel.takenHours(date, excludeId);
  const out = [];
  for (let h = FIRST_HOUR; h <= LAST_START; h++) {
    const start = `${pad(h)}:00`;
    if (!taken.includes(h) && start !== skipStart) out.push(start);
  }
  return out;
}

exports.availability = async ({ date, start, excludeId = 0 }) => {
  const band = await coachModel.listBand();
  const { startsAt, endsAt } = range(date, start);
  const overlap = await bandModel.findOverlapping(startsAt, endsAt, excludeId);
  const busy = overlap.length > 0;
  const members = band.map(m => ({ id: m.id, name: m.name, free: !busy, reason: busy ? 'Another band booking is at this time' : null }));
  const free = band.length > 0 && !busy;
  return { free, noBand: band.length === 0, members, suggestions: free ? [] : (await freeSlots(date, excludeId, start)).slice(0, 3) };
};

exports.list = async tab => {
  const statuses = { pending: ['pending'], approved: ['approved'], declined: ['declined', 'cancelled'] }[tab] || ['pending'];
  const rows = await bandModel.list(statuses, tab === 'declined' ? 'DESC' : 'ASC');
  const c = await bandModel.counts();
  const bookings = await Promise.all(rows.map(async r =>
    shape(r, r.status === 'pending' ? await exports.availability({ date: r.date, start: r.start_time, excludeId: r.id }) : null)));
  return { counts: { pending: c.pending || 0, approved: c.approved || 0, declined: (c.declined || 0) + (c.cancelled || 0) }, bookings };
};

exports.people = () => userModel.listByRoles(['parent', 'student']);

exports.create = async ({ requestedBy, forName, date, start, note, approve }) => {
  const requester = (await userModel.listByRoles(['parent', 'student'])).find(p => p.id === requestedBy);
  if (!requester) throw httpError(400, 'Choose a parent or student for “Requested by”.');
  const today = new Date().toLocaleDateString('en-CA');
  if (date < today) throw httpError(400, 'Choose a date that is today or later.');
  const { startsAt, endsAt } = range(date, start);
  if (approve) {
    const a = await exports.availability({ date, start });
    if (a.noBand) throw httpError(400, 'Turn on the Band switch for coaches first (Coaches page).');
    if (!a.free) throw httpError(409, 'That time is already taken by another band booking.');
  }
  const id = await bandModel.create({ requestedBy, forName: forName.trim(), startsAt, endsAt, note, status: approve ? 'approved' : 'pending' });
  return { booking: shape(await bandModel.findById(id)) };
};

async function mustFind(id, statuses) {
  const row = await bandModel.findById(id);
  if (!row) throw httpError(404, 'Request not found.');
  if (statuses && !statuses.includes(row.status)) throw httpError(400, `This request is already ${row.status}.`);
  return row;
}

exports.approve = async id => {
  const row = await mustFind(id, ['pending']);
  const a = await exports.availability({ date: row.date, start: row.start_time, excludeId: id });
  if (a.noBand) throw httpError(400, 'Turn on the Band switch for coaches first (Coaches page).');
  if (!a.free) throw httpError(409, 'That time is no longer free: another band booking is there.');
  await bandModel.setStatus(id, 'approved');
  return { booking: shape(await bandModel.findById(id)) };
};

exports.decline = async (id, reason) => {
  await mustFind(id, ['pending']);
  await bandModel.setStatus(id, 'declined', reason ? reason.trim() : null);
  return { booking: shape(await bandModel.findById(id)) };
};

exports.reopen = async id => {
  await mustFind(id, ['declined', 'cancelled']);
  await bandModel.setStatus(id, 'pending');
  return { booking: shape(await bandModel.findById(id)) };
};

exports.cancel = async id => {
  const row = await mustFind(id, ['approved']);
  if (row.past) throw httpError(400, 'This lesson already took place.');
  await bandModel.setStatus(id, 'cancelled');
  return { booking: shape(await bandModel.findById(id)) };
};

exports.suggest = async (id, start) => {
  const row = await mustFind(id, ['pending']);
  const a = await exports.availability({ date: row.date, start });
  if (!a.free) throw httpError(409, 'That time is not free for the whole band.');
  await bandModel.setSuggestion(id, nice(row.date, start));
  return { booking: shape(await bandModel.findById(id)) };
};

exports.pendingForOverview = async () => (await exports.list('pending')).bookings;
exports.approvedThisMonth = () => bandModel.approvedThisMonth();
exports.FIRST_HOUR = FIRST_HOUR;
exports.LAST_START = LAST_START;