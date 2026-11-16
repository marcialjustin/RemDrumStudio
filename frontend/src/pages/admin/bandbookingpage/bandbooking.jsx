import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../services/api.js';
import './bandbooking.css';

const REASONS = ['A band member is booked', 'Studio is closed', 'Outside lesson hours'];
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const hourEnd = s => `${String(Number(s.slice(0, 2)) + 1).padStart(2, '0')}:00`;
const fmtDate = d => new Date(`${d}T12:00:00`).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const first = n => n.split(' ')[0];
const today = () => new Date().toLocaleDateString('en-CA');

function Pill({ kind, children }) { return <span className={`bb__pill bb__pill--${kind}`}>{children}</span>; }
function Two({ a, b }) { return <div><b>{a}</b><small>{b}</small></div>; }

function MemberChips({ members }) {
  return (
    <div className="bb__members">
      {members.map(m => <span key={m.id} className={`bb__member ${m.free ? 'ok' : 'busy'}`}>{m.free ? '✓' : '!'} {m.name}</span>)}
    </div>
  );
}

/* ---------------- Add a request ---------------- */
function AddRequest({ onDone, onBack }) {
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({ requestedBy: '', forName: '', date: '', start: '14:00', note: '' });
  const [check, setCheck] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => { api.get('/admin/band-bookings/people').then(r => setPeople(r.people)).catch(e => setError(e.message)); }, []);

  useEffect(() => {
    setCheck(null);
    if (!form.date) return;
    api.get(`/admin/band-bookings/check?date=${form.date}&start=${form.start}`).then(setCheck).catch(() => setCheck(null));
  }, [form.date, form.start]);

  const pickRequester = e => {
    const p = people.find(x => String(x.id) === e.target.value);
    setForm(f => ({ ...f, requestedBy: e.target.value, forName: f.forName || (p?.role === 'student' ? p.name : '') }));
  };

  const save = async approve => {
    setError('');
    if (!form.requestedBy) return setError('Choose who is requesting.');
    if (!form.forName.trim()) return setError('Enter who the lesson is for.');
    if (!form.date) return setError('Choose a date.');
    setBusy(true);
    try {
      await api.post('/admin/band-bookings', { requestedBy: Number(form.requestedBy), forName: form.forName, date: form.date, start: form.start, note: form.note || undefined, approve });
      onDone(approve ? 'Request saved and approved.' : 'Request saved as pending.');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="bb">
      <div className="bb__head">
        <div><h1>Add a band booking</h1><p className="bb__sub">Enter a request that came in by message or in person.</p></div>
        <button className="bb__btn" onClick={onBack}>← Back to requests</button>
      </div>
      <section className="bb__card bb__form">
        <h2>Add a band booking request</h2>
        <div className="bb__grid2">
          <label>Requested by
            <select value={form.requestedBy} onChange={pickRequester}>
              <option value="">Choose a parent or student</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.name} · {p.role === 'parent' ? 'Parent' : 'Student'}</option>)}
            </select>
          </label>
          <label>Who is the lesson for<input value={form.forName} onChange={set('forName')} /></label>
          <label>Date<input type="date" min={today()} value={form.date} onChange={set('date')} /></label>
          <label>Start time
            <select value={form.start} onChange={set('start')}>{HOURS.map(h => <option key={h} value={h}>{h}–{hourEnd(h)} (60 minutes)</option>)}</select>
          </label>
        </div>
        <label className="bb__wide">Note (optional)<input value={form.note} onChange={set('note')} placeholder="Anything the band should know" /></label>

        {form.date && !check && <p className="bb__muted">Checking the band…</p>}
        {check && (
          <div className={`bb__check ${check.free ? 'ok' : 'busy'}`} role="status">
            <b>
              {check.noBand ? 'No band members yet. Turn on the Band switch for coaches first.'
                : check.free ? `All ${check.members.length} band members are free on ${fmtDate(form.date)}, ${form.start}–${hourEnd(form.start)}`
                : `The band is not free on ${fmtDate(form.date)}, ${form.start}–${hourEnd(form.start)}`}
            </b>
            {!check.noBand && <MemberChips members={check.members} />}
            {!check.free && check.suggestions.length > 0 && (
              <div className="bb__chips">Free that day:{check.suggestions.map(s => <button type="button" key={s} onClick={() => setForm(f => ({ ...f, start: s }))}>{s}–{hourEnd(s)}</button>)}</div>
            )}
          </div>
        )}
        {error && <p className="bb__alert" role="alert">{error}</p>}
        <div className="bb__acts bb__acts--left">
          <button className="bb__btn bb__btn--p" disabled={busy} onClick={() => save(false)}>Save as pending</button>
          <button className="bb__btn" disabled={busy || !check?.free} onClick={() => save(true)}>Save and approve</button>
          <button className="bb__btn" onClick={onBack}>Cancel</button>
        </div>
      </section>
    </div>
  );
}

/* ---------------- The list ---------------- */
export default function BandBookingsPage() {
  const [tab, setTab] = useState('pending');
  const [data, setData] = useState(null);
  const [view, setView] = useState('list');
  const [open, setOpen] = useState(null);       // { id, type: 'approve' | 'decline' | 'cancel' }
  const [reason, setReason] = useState('');
  const [pick, setPick] = useState({});         // chosen suggestion per booking
  const [error, setError] = useState('');
  const [flash, setFlash] = useState('');

  const load = useCallback(() => api.get(`/admin/band-bookings?tab=${tab}`).then(setData).catch(e => setError(e.message)), [tab]);
  useEffect(() => { setData(null); load(); }, [load]);

  const run = async (fn, message) => {
    setError(''); setFlash('');
    try { await fn(); setOpen(null); setReason(''); setFlash(message); } catch (e) { setError(e.message); }
    await load();
  };
  const post = (b, path, body) => api.post(`/admin/band-bookings/${b.id}/${path}`, body);

  if (view === 'add') {
    return <AddRequest onBack={() => setView('list')} onDone={msg => { setView('list'); setFlash(msg); load(); }} />;
  }

  const tabs = [['pending', 'Pending'], ['approved', 'Approved'], ['declined', 'Declined']];
  const toggle = (b, type) => { setOpen(open?.id === b.id && open.type === type ? null : { id: b.id, type }); setReason(''); };

  const status = b => {
    if (b.status === 'pending') {
      const a = b.availability;
      return a.noBand ? <Pill kind="a">No band members set up</Pill>
        : a.free ? <Pill kind="g">All {a.members.length} free</Pill>
        : <Pill kind="a">Another band booking is at this time</Pill>;
    }
    if (b.status === 'approved') return <div><Pill kind={b.completed ? 'x' : 'g'}>{b.completed ? 'Completed' : 'Approved'}</Pill><small className="bb__small">Approved {fmtDate(b.decidedOn)}</small></div>;
    return <div><Pill kind="r">{b.status === 'cancelled' ? 'Cancelled' : 'Declined'}</Pill>{b.declineReason && <small className="bb__small">“{b.declineReason}”</small>}</div>;
  };

  const actions = b => {
    if (b.status === 'pending') return <>
      <button className="bb__btn bb__btn--d" onClick={() => toggle(b, 'decline')}>Decline</button>
      <button className="bb__btn bb__btn--p" disabled={!b.availability.free} onClick={() => toggle(b, 'approve')}>Approve</button></>;
    if (b.status === 'approved') return b.completed ? <span className="bb__muted">—</span> : <button className="bb__btn bb__btn--d" onClick={() => toggle(b, 'cancel')}>Cancel booking</button>;
    return <button className="bb__btn" onClick={() => run(() => post(b, 'reopen'), 'Request moved back to pending.')}>Reopen</button>;
  };

  const strips = b => {
    const a = b.availability;
    const out = [];
    if (b.status === 'pending' && !a.free) {
      out.push(
        <div className="bb__strip bb__strip--grey" key="s">
          {a.noBand ? <span>No band members yet. Turn on the Band switch for coaches on the Coaches page.</span> : <>
            {a.suggestions.length > 0 ? <span className="bb__bold">The whole band is free that day at:</span> : <span className="bb__bold">No free time left that day.</span>}
            {a.suggestions.map(s => <button key={s} className={`bb__chip ${(pick[b.id] || a.suggestions[0]) === s ? 'on' : ''}`} onClick={() => setPick(p => ({ ...p, [b.id]: s }))}>{s}–{hourEnd(s)}</button>)}
            {a.suggestions.length > 0 && <button className="bb__btn bb__btn--p" onClick={() => run(() => post(b, 'suggest', { start: pick[b.id] || a.suggestions[0] }), `Suggestion saved for ${first(b.requester)}.`)}>Send suggestion to {first(b.requester)}</button>}
            {b.suggestion && <span className="bb__muted">Suggested: {b.suggestion}</span>}
          </>}
        </div>);
    }
    if (open?.id === b.id && open.type === 'approve') out.push(
      <div className="bb__strip bb__strip--warn" key="a"><div><b>Approve this band booking?</b><small>The band will be booked on {fmtDate(b.date)}, {b.start}–{b.end}.</small></div>
        <div className="bb__acts"><button className="bb__btn" onClick={() => setOpen(null)}>Cancel</button><button className="bb__btn bb__btn--p" onClick={() => run(() => post(b, 'approve'), 'Band booking approved.')}>Yes, approve</button></div></div>);
    if (open?.id === b.id && open.type === 'cancel') out.push(
      <div className="bb__strip bb__strip--warn" key="c"><div><b>Cancel this approved band booking?</b><small>That time becomes free for the band again.</small></div>
        <div className="bb__acts"><button className="bb__btn" onClick={() => setOpen(null)}>Keep it</button><button className="bb__btn bb__btn--dr" onClick={() => run(() => post(b, 'cancel'), 'Band booking cancelled.')}>Yes, cancel booking</button></div></div>);
    if (open?.id === b.id && open.type === 'decline') out.push(
      <div className="bb__strip bb__strip--red" key="d">
        <b>Decline {b.requester}’s request?</b>
        <small>The reason is saved with the request. It is optional, but it helps them pick a new time.</small>
        <div className="bb__chips">{REASONS.map(r => <button key={r} className={`bb__chip ${reason === r ? 'on' : ''}`} onClick={() => setReason(r)}>{r}</button>)}</div>
        <textarea rows="2" aria-label="Reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="Write a reason (optional)" />
        <div className="bb__acts"><button className="bb__btn" onClick={() => setOpen(null)}>Cancel</button><button className="bb__btn bb__btn--dr" onClick={() => run(() => post(b, 'decline', { reason }), 'Request declined.')}>Decline request</button></div>
      </div>);
    return out;
  };

  return (
    <div className="bb">
      <div className="bb__head">
        <div><h1>Band booking requests</h1><p className="bb__sub">Approve a band booking only when all band members are free.</p></div>
        <button className="bb__btn bb__btn--p" onClick={() => setView('add')}>+ Add a request</button>
      </div>

      <div className="bb__tabs" role="tablist">
        {tabs.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={`bb__tab ${tab === key ? 'on' : ''}`} onClick={() => { setTab(key); setOpen(null); setFlash(''); setError(''); }}>
            {label}{data ? ` · ${data.counts[key]}` : ''}
          </button>
        ))}
      </div>

      {error && <p className="bb__alert" role="alert">{error}</p>}
      {flash && <p className="bb__flash" role="status">{flash}</p>}

      <section className="bb__card bb__table">
        <div className="bb__row bb__row--head"><span>Requested by</span><span>For</span><span>Requested time</span><span>{tab === 'pending' ? 'Band members' : 'Status'}</span><span /></div>
        {!data && <div className="bb__empty">Loading requests...</div>}
        {data && data.bookings.length === 0 && <div className="bb__empty">{tab === 'pending' ? 'No requests waiting. Use “Add a request” to enter one.' : 'Nothing here yet.'}</div>}
        {data && data.bookings.map(b => (
          <div key={b.id}>
            <div className="bb__row">
              <Two a={b.requester} b={b.requesterRole === 'parent' ? 'Parent' : 'Student'} />
              <Two a={b.forName} b="Band lesson · 60 min" />
              <Two a={fmtDate(b.date)} b={`${b.start}–${b.end}`} />
              {status(b)}
              <div className="bb__acts">{actions(b)}</div>
            </div>
            {strips(b)}
          </div>
        ))}
      </section>
    </div>
  );
}