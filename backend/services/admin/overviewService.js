// Numbers for the admin Overview page.
// Real now: parents, students, coaches and invites. The rest (lessons, band bookings, payments, ratings)
// need tables that don't exist yet, so each section below returns zeros. When you build that feature,
// replace the one small function and the Overview fills in with no other change.
const userModel = require('../../models/shared/userModel');
const coachService = require('./coachService');
const bandService = require('./bandBookingService');

const daysLeft = iso => Math.max(1, Math.ceil((new Date(iso) - Date.now()) / 86400000));

// ---- not built yet: replace each with a real query later ----
const lessonStats = async () => ({ today: 0, week: 0, completedThisWeek: 0 });   // needs a lessons table
const bandRequestCount = async pending => pending.length;                         // real: pending band requests
const paymentStats = async () => ({ total: 0, solo: 0, band: 0, changeFromLastMonth: 0 }); // needs a payments table
const ratingStats = async () => ({ average: null, count: 0 });                   // needs a ratings table
const bookingCounts = async (coaches, bandApproved) => ({                       // coach lessons need a lessons table; band is real
  coaches: coaches.map(c => ({ id: c.id, name: c.name, count: 0 })),
  band: bandApproved
});

const attentionItems = coaches => {
  const items = [];
  coaches.forEach(c => {
    if (c.status === 'invited') {
      items.push({ id: `invited-${c.id}`, title: `Waiting for ${c.name} to set a password`,
        detail: `Invite sent · expires in ${daysLeft(c.inviteExpiresAt)} days`, actions: [{ label: 'Review', to: '/admin/coaches' }] });
    } else if (c.status === 'expired') {
      items.push({ id: `expired-${c.id}`, title: `${c.name}’s invite expired`,
        detail: 'They can’t log in yet', actions: [{ label: 'Send new invite', to: '/admin/coaches', primary: true }] });
    }
  });
  return items;
};

const bandAttention = pending => pending.slice(0, 3).map(b => ({
  id: `band-${b.id}`,
  title: `Band booking request · ${b.requester}`,
  detail: `For ${b.forName} · ${b.date} ${b.start}–${b.end} · ${b.availability.free ? 'all band members free' : b.availability.noBand ? 'no band members set up' : 'time conflict'}`,
  actions: [{ label: 'Review', to: '/admin/band-bookings', primary: b.availability.free }]
}));

exports.get = async () => {
  const [byRole, coaches, lessons, pending, bandApproved, payments, ratings] = await Promise.all([
    userModel.countByRole(), coachService.list(), lessonStats(), bandService.pendingForOverview(), bandService.approvedThisMonth(), paymentStats(), ratingStats()
  ]);
  const active = coaches.filter(c => c.status === 'active');
  return {
    people: { parents: byRole.parent || 0, students: byRole.student || 0 },
    lessons,
    bandRequests: await bandRequestCount(pending),
    attention: [...bandAttention(pending), ...attentionItems(coaches)],
    bookingsPerCoach: await bookingCounts(active, bandApproved),
    payments,
    ratings
  };
};