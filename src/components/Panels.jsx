// Side panels: booking flow, confirmation and "My bookings". Rendered once in App.
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CLASS_BY_ID } from "../data/classes";
import { TEACHER_BY_ID } from "../data/teachers";
import { STUDIO_BY_ID } from "../data/studios";
import { DROP_IN_PRICE } from "../data/content";
import { addMinutes, formatDay, formatTime, plural } from "../lib/format";
import { useStudio } from "../context/StudioContext";
import { Level } from "./ui";
import "./Panels.css";

function Drawer({ title, children, footer, onClose }) {
  const closeBtn = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const prevFocus = document.activeElement;
    closeBtn.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCloseRef.current();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus?.focus?.();
    };
  }, []);

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <strong>{title}</strong>
          <button ref={closeBtn} className="x" onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="content">{children}</div>
        {footer && <div className="foot">{footer}</div>}
      </aside>
    </>
  );
}

function SessionDetails({ s, before, after }) {
  const c = CLASS_BY_ID[s.classId];
  const t = TEACHER_BY_ID[s.teacherId];
  const st = STUDIO_BY_ID[s.studioId];
  return (
    <div className="kv">
      {before}
      <span>When</span>
      <span>{formatDay(s.start)}, {formatTime(s.start)}–{formatTime(addMinutes(s.start, c.mins))}</span>
      <span>Teacher</span>
      <span><Link className="linkish" to={`/teachers/${t.id}`}>{t.name}</Link></span>
      <span>Studio</span>
      <span>{st.name} · {st.address}</span>
      {after}
    </div>
  );
}

function BookPanel({ sessionId }) {
  const { sessionById, spotsLeft, account, book, joinWaitlist, busy, closePanel } = useStudio();
  const s = sessionById(sessionId);
  const hasCredit = account.unlimited || account.credits > 0;
  const [spot, setSpot] = useState(null);
  const [payment, setPayment] = useState(hasCredit ? "credit" : "drop-in");
  if (!s) return null;

  const c = CLASS_BY_ID[s.classId];
  const left = spotsLeft(s);
  const full = left <= 0;
  const unit = c.room === "mat" ? "spot" : "reformer";
  const cols = s.capacity > 12 ? 8 : s.capacity === 8 ? 4 : 6;

  const footer = full ? (
    <button className="btn solid" disabled={busy} onClick={() => joinWaitlist(s.id)}>
      {busy ? "Joining…" : "Join waitlist"}
    </button>
  ) : (
    <>
      <button className="btn solid" disabled={!spot || busy} onClick={() => book(s.id, spot, payment)}>
        {busy
          ? "Booking…"
          : spot
          ? `Book ${unit} ${spot} · ${payment === "drop-in" ? `£${DROP_IN_PRICE}` : "1 credit"}`
          : `Choose a ${unit} to continue`}
      </button>
      <p className="note center">Free cancellation until 12 hours before class.</p>
    </>
  );

  return (
    <Drawer title="Book a class" onClose={closePanel} footer={footer}>
      <div className="hero-img"><img src={c.image} alt="" /></div>
      <div className="stack-sm">
        <Level spring={c.spring} />
        <h2>{c.name}</h2>
      </div>
      <SessionDetails s={s} />
      <p className="muted">{full ? `Full · ${s.waitlistCount} on the waitlist` : `${left} of ${s.capacity} spaces left`}</p>

      {full ? (
        <div className="ask">
          <strong>This class is full</strong>
          <span>
            Join the waitlist as number {s.waitlistCount + 1}. If a space opens up to 2 hours before, we book you in and use a credit.
          </span>
        </div>
      ) : (
        <>
          <div className="stack">
            <p className="eyebrow">Choose your {unit}</p>
            <div className="bedgrid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: s.capacity }, (_, i) => i + 1).map((n) => {
                const taken = s.takenSpots.includes(n);
                return (
                  <button
                    key={n}
                    className="bed"
                    disabled={taken}
                    aria-pressed={spot === n}
                    aria-label={`${unit} ${n}${taken ? ", taken" : ""}`}
                    onClick={() => setSpot(n)}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <p className="front">Teacher at the front</p>
          </div>

          <div className="pay">
            <p className="eyebrow">Pay with</p>
            <label>
              <input type="radio" name="pay" id="payCredit" value="credit" disabled={!hasCredit}
                checked={payment === "credit"} onChange={() => setPayment("credit")} />
              Use a credit<small>{account.unlimited ? "Unlimited" : `${account.credits} left`}</small>
            </label>
            <label>
              <input type="radio" name="pay" id="payDrop" value="drop-in"
                checked={payment === "drop-in"} onChange={() => setPayment("drop-in")} />
              Drop-in<small>£{DROP_IN_PRICE}</small>
            </label>
            {!hasCredit && (
              <p className="note">
                No credits yet. <Link to="/pricing" onClick={closePanel}>The intro offer</Link> gives you 3 for £55.
              </p>
            )}
          </div>
        </>
      )}
    </Drawer>
  );
}

function ConfirmedPanel({ sessionId }) {
  const { sessionById, bookingFor, openMyBookings, closePanel } = useStudio();
  const s = sessionById(sessionId);
  const b = bookingFor(sessionId);
  if (!s || !b) return null;
  const c = CLASS_BY_ID[s.classId];

  return (
    <Drawer
      title={b.waitlist ? "On the waitlist" : "You're booked"}
      onClose={closePanel}
      footer={
        <>
          <button className="btn solid" onClick={openMyBookings}>View my bookings</button>
          <button className="btn" onClick={closePanel}>Done</button>
        </>
      }
    >
      <div className="hero-img"><img src={c.image} alt="" /></div>
      <p className="ok">
        {b.waitlist ? `You're number ${b.position} on the waitlist` : `See you on ${c.room === "mat" ? "spot" : "reformer"} ${b.spot}`}
      </p>
      <SessionDetails
        s={s}
        before={<><span>Class</span><span>{c.name}</span></>}
        after={!b.waitlist && <><span>Paid</span><span>{b.payment === "drop-in" ? `£${DROP_IN_PRICE} drop-in` : "1 credit"}</span></>}
      />
      <div className="ask">
        <strong>Before you come</strong>
        <span>Arrive 10 minutes early, bring grip socks, and tell your teacher about any injuries.</span>
      </div>
    </Drawer>
  );
}

function MyBookingsPanel() {
  const { account, sessionById, cancel, busy, closePanel } = useStudio();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(null);
  const items = Object.values(account.bookings)
    .map((b) => ({ b, s: sessionById(b.sessionId) }))
    .filter((x) => x.s)
    .sort((x, y) => x.s.start - y.s.start);

  return (
    <Drawer
      title="My bookings"
      onClose={closePanel}
      footer={<button className="btn solid" onClick={() => { closePanel(); navigate("/timetable"); }}>Book another class</button>}
    >
      {!items.length ? (
        <>
          <p className="ok small">Nothing booked yet</p>
          <p className="muted">Pick a class from the timetable and choose your reformer.</p>
        </>
      ) : (
        items.map(({ b, s }) => {
          const c = CLASS_BY_ID[s.classId];
          return (
            <div className="mb-item" key={s.id}>
              <div className="row">
                <strong className="w500">{c.name}</strong>
                <Level spring={c.spring} />
              </div>
              <span className="muted">
                {formatDay(s.start)} · {formatTime(s.start)} · {STUDIO_BY_ID[s.studioId].name} · {TEACHER_BY_ID[s.teacherId].name}
              </span>
              <span className="small-text">
                {b.waitlist
                  ? `Waitlist #${b.position}`
                  : `${c.room === "mat" ? "Spot" : "Reformer"} ${b.spot} · ${b.payment === "drop-in" ? `£${DROP_IN_PRICE}` : "1 credit"}`}
              </span>
              {confirming === s.id ? (
                <div className="ask">
                  <span>
                    Cancel this booking?
                    {b.payment === "credit" && !b.waitlist && !account.unlimited && " The credit goes back to your account."}
                  </span>
                  <div className="row start">
                    <button className="btn sm solid" disabled={busy} onClick={() => cancel(s.id).then(() => setConfirming(null))}>
                      Yes, cancel
                    </button>
                    <button className="btn sm" onClick={() => setConfirming(null)}>Keep it</button>
                  </div>
                </div>
              ) : (
                <div>
                  <button className="linkish" onClick={() => setConfirming(s.id)}>
                    {b.waitlist ? "Leave waitlist" : "Cancel booking"}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
      <div className="kv balance">
        <span>Balance</span>
        <span>{account.unlimited ? "Unlimited membership" : plural(account.credits, "credit")}</span>
      </div>
    </Drawer>
  );
}

export default function Panels() {
  const { panel } = useStudio();
  if (!panel) return null;
  if (panel.type === "book") return <BookPanel key={panel.sessionId} sessionId={panel.sessionId} />;
  if (panel.type === "confirmed") return <ConfirmedPanel sessionId={panel.sessionId} />;
  if (panel.type === "bookings") return <MyBookingsPanel />;
  return null;
}

export function Toast() {
  const { toast } = useStudio();
  return <div aria-live="polite">{toast && <div className="toast">{toast}</div>}</div>;
}
