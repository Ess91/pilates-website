import { Link } from "react-router-dom";
import { CLASS_BY_ID } from "../data/classes";
import { TEACHER_BY_ID } from "../data/teachers";
import { STUDIO_BY_ID } from "../data/studios";
import { formatTime } from "../lib/format";
import { useStudio } from "../context/StudioContext";
import { Level } from "./ui";
import "./SessionRow.css";

export default function SessionRow({ session: s }) {
  const { bookingFor, isPast, spotsLeft, openBooking } = useStudio();
  const c = CLASS_BY_ID[s.classId];
  const t = TEACHER_BY_ID[s.teacherId];
  const booking = bookingFor(s.id);
  const left = spotsLeft(s);
  const past = isPast(s);
  const pct = Math.round(((s.capacity - left) / s.capacity) * 100);
  const unit = c.room === "mat" ? "Spot" : "Bed";

  let action;
  if (booking) action = <span className="booked-tag">{booking.waitlist ? `Waitlist #${booking.position}` : `Booked · ${unit} ${booking.spot}`}</span>;
  else if (past) action = <span className="spots">Started</span>;
  else if (left <= 0) action = <button className="btn sm" onClick={() => openBooking(s.id)}>Waitlist</button>;
  else action = <button className="btn sm solid" onClick={() => openBooking(s.id)}>Book</button>;

  return (
    <article className={`slot${past ? " past" : ""}`}>
      <div className="t">
        {formatTime(s.start)}
        <small>{c.mins} min</small>
      </div>
      <div className="cl">
        <strong>{c.name}</strong>
        <Level spring={c.spring} />
      </div>
      <div className="tchw">
        <Link className="tch" to={`/teachers/${t.id}`}>{t.name}</Link>
      </div>
      <div className="where">
        <span>{STUDIO_BY_ID[s.studioId].name}</span>
        <span className="cap" aria-hidden="true"><i style={{ width: `${pct}%` }} /></span>
        <span className={`spots${left > 0 && left <= 2 ? " low" : ""}`}>
          {left > 0 ? `${left} of ${s.capacity} spaces left` : `Full · ${s.waitlistCount} waiting`}
        </span>
      </div>
      <div className="act">{action}</div>
    </article>
  );
}
